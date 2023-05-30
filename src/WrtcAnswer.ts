import { Message, PayloadOffer, SnapshotAnswer, SnapshotOffer } from "./types";
import * as uuid from "uuid";

export class WrtcAnswer {
  id: string;
  rtcPeerConnection: RTCPeerConnection;
  iceCandidates: RTCIceCandidate[];
  dataChannel: RTCDataChannel | null = null;
  mediaStream: MediaStream | null = null;
  remoteMediaStream: MediaStream | null = null;
  public onUpdateCallback: () => void = () => null;
  public snapshot: SnapshotAnswer;
  private remoteOfferPayload: PayloadOffer | null = null;
  private subscriptionCallbacks: (() => void)[] = [];
  private messages: Message[] = [];

  constructor(id: string) {
    if (!window) throw "no window";

    this.snapshot = {
      remoteOfferPayload: this.remoteOfferPayload,
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

    this.initRemoteDataChannelListeners();

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

  async receiveRemoteOfferPayload(offerPayload: PayloadOffer) {
    if (!offerPayload.sessionDescription) {
      throw "remote has no session description";
    }

    await this.rtcPeerConnection.setRemoteDescription(
      offerPayload.sessionDescription
    );

    for (const ic of offerPayload.iceCandidates) {
      this.rtcPeerConnection.addIceCandidate(new RTCIceCandidate(ic));
    }

    this.remoteOfferPayload = offerPayload;
    this.snapshot = {
      ...this.snapshot,
      remoteOfferPayload: this.remoteOfferPayload,
    };
    this.publish();
  }

  async createAnswer() {
    const answer = await this.rtcPeerConnection.createAnswer();
    await this.rtcPeerConnection.setLocalDescription(answer);

    this.snapshot = {
      ...this.snapshot,
      sessionDescription: this.rtcPeerConnection.localDescription,
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
    this.dataChannel?.send(JSON.stringify(msg));
  }

  private addMessage(msg: Message) {
    this.messages.push(msg);
    this.snapshot = {
      ...this.snapshot,
      messages: this.messages,
    };
    this.publish();
  }

  private initRemoteDataChannelListeners() {
    this.rtcPeerConnection.addEventListener("datachannel", (e) => {
      this.dataChannel = e.channel;

      this.dataChannel.addEventListener("open", (e) => {
        console.log("remote datachannel open");
      });

      this.dataChannel.addEventListener("message", (e) => {
        const msg: Message = JSON.parse(e.data);
        this.addMessage({ ...msg, isRemote: true });
      });
    });
  }
}
