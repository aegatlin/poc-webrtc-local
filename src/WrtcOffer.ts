import * as uuid from "uuid";
import { Message, PayloadAnswer, SnapshotOffer } from "./types";

export class WrtcOffer {
  id: string;
  rtcPeerConnection: RTCPeerConnection;
  iceCandidates: RTCIceCandidate[];
  dataChannel: RTCDataChannel;
  mediaStream: MediaStream | null = null;
  remoteMediaStream: MediaStream | null = null;
  public onUpdateCallback: () => void = () => null;
  public snapshot: SnapshotOffer;
  private subscriptionCallbacks: (() => void)[] = [];
  remoteAnswerPayload: PayloadAnswer | null = null;
  private messages: Message[] = [];

  constructor(id: string) {
    if (!window) throw "no window";
    this.snapshot = {
      remoteAnswerPayload: this.remoteAnswerPayload,
      sessionDescription: null,
      iceCandidates: [],
      messages: [],
      mediaStream: this.mediaStream,
      remoteMediaStream: this.remoteMediaStream,
    };

    this.id = id;
    this.rtcPeerConnection = new window.RTCPeerConnection();

    this.iceCandidates = [];
    this.initIceCandidateEventListeners();

    this.dataChannel = this.rtcPeerConnection.createDataChannel(this.id);
    this.initLocalDataChannelListeners();

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        this.mediaStream = mediaStream;
        mediaStream
          .getTracks()
          .forEach((track) =>
            this.rtcPeerConnection.addTrack(track, mediaStream)
          );

        this.snapshot = {
          ...this.snapshot,
          mediaStream: this.mediaStream,
        };

        this.publish();
      });

    this.rtcPeerConnection.addEventListener(
      "track",
      (rtcTrackEvent: RTCTrackEvent) => {
        this.remoteMediaStream = rtcTrackEvent.streams?.at(0) ?? null;

        this.snapshot = {
          ...this.snapshot,
          remoteMediaStream: this.remoteMediaStream,
        };
      }
    );
  }

  async createOffer() {
    const offer = await this.rtcPeerConnection.createOffer();
    await this.rtcPeerConnection.setLocalDescription(offer);
    this.snapshot = {
      ...this.snapshot,
      sessionDescription: this.rtcPeerConnection.localDescription,
    };
    this.publish();
  }

  async receiveRemoteAnswerPayload(answerPayload: PayloadAnswer) {
    if (!answerPayload.sessionDescription) {
      throw "answer has no session description";
    }

    await this.rtcPeerConnection.setRemoteDescription(
      answerPayload.sessionDescription
    );

    for (const ic of answerPayload.iceCandidates) {
      await this.rtcPeerConnection.addIceCandidate(new RTCIceCandidate(ic));
    }

    this.remoteAnswerPayload = answerPayload;
    this.snapshot = {
      ...this.snapshot,
      remoteAnswerPayload: this.remoteAnswerPayload,
    };
    this.publish();
  }

  subscribe(callback: () => void) {
    this.subscriptionCallbacks.push(callback);
  }

  private publish() {
    this.subscriptionCallbacks.forEach((cb) => cb());
  }

  private initIceCandidateEventListeners() {
    if (!this.rtcPeerConnection) throw "no rtcPeerConnection";

    this.rtcPeerConnection.addEventListener("icecandidate", (e) => {
      if (e.candidate) {
        this.iceCandidates.push(e.candidate);
        this.snapshot = {
          ...this.snapshot,
          iceCandidates: this.iceCandidates,
        };
        this.publish();
      }
    });
  }

  sendMessage(content: string) {
    const msg: Message = {
      id: uuid.v4(),
      isRemote: false,
      content,
    };

    this.addMessage(msg);
    this.dataChannel.send(JSON.stringify(msg));
  }

  private addMessage(msg: Message) {
    this.messages.push(msg);
    this.snapshot = {
      ...this.snapshot,
      messages: this.messages,
    };
    this.publish();
  }

  private initLocalDataChannelListeners() {
    if (!this.dataChannel) throw "no data channel";

    this.dataChannel.addEventListener("open", (e) => {
      console.log("local datachannel open");
    });

    this.dataChannel.addEventListener("message", (e) => {
      const msg: Message = JSON.parse(e.data);
      this.addMessage({ ...msg, isRemote: true });
    });
  }
}
