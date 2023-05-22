import { Message, PayloadAnswer, SnapshotOffer } from "./types";
import * as uuid from "uuid";

export class WrtcOffer {
  id: string;
  rtcPeerConnection: RTCPeerConnection;
  iceCandidates: RTCIceCandidate[];
  dataChannel: RTCDataChannel;
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
    };

    this.id = id;
    this.rtcPeerConnection = new window.RTCPeerConnection();

    this.iceCandidates = [];
    this.initIceCandidateEventListeners();

    this.dataChannel = this.rtcPeerConnection.createDataChannel(this.id);
    this.initLocalDataChannelListeners();
    // this.initRemoteDataChannelListeners();
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
      console.log("ice candidate event: ", e);
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
    console.log('!!!!!!!!!!!!!! ', this)
    const msg: Message = {
      id: uuid.v4(),
      isRemote: false,
      content,
    };

    this.addMessage(msg);
    this.dataChannel.send(JSON.stringify(msg));
    console.log(msg, JSON.stringify(msg))
  }

  private addMessage(msg: Message) {
    this.messages.push(msg);
    this.snapshot = {
      ...this.snapshot,
      messages: this.messages,
    };
    this.publish();
  }

  /**
   * I think these listeners are listening to local message
   * events. Aka, they are not actually useful, but are
   * for logging/debugging.
   */
  private initLocalDataChannelListeners() {
    if (!this.dataChannel) throw "no data channel";

    this.dataChannel.addEventListener("open", (e) => {
      console.log("datachannel open");
    });

    this.dataChannel.addEventListener("message", (e) => {
      console.log("message received");
      const msg: Message = JSON.parse(e.data);
      this.addMessage({ ...msg, isRemote: true });
    });
  }

  /**
   * I believe that once a 'datachannel' event is received,
   * it means that a remote connection has been established,
   * and therefore you:
   *
   * 1. have a data channel.
   * 2. Can add listeners to said channel
   * 3. Respond to 'message' events on said channel
   *
   * This function will need to get more sophisticated over time to
   * handle chats.
   */
  // private initRemoteDataChannelListeners() {
  //   this.rtcPeerConnection.addEventListener("datachannel", (e) => {
  //     console.log("remote datachannel event: ", e);
  //     const dataChannel = e.channel;

  //     dataChannel.addEventListener("open", (e) => {
  //       console.log("remote datachannel open", e);
  //       dataChannel.send("hello from remote");
  //     });

  //     dataChannel.addEventListener("message", (e) => {
  //       console.log("remote message received", e, e.data);
  //       const newMsg: Message = {
  //         id: uuid.v4(),
  //         isRemote: true,
  //         content: e.data,
  //       };

  //       this.messages.push(newMsg);
  //       this.snapshot = {
  //         ...this.snapshot,
  //         messages: this.messages,
  //       };
  //     });
  //   });
  // }
}
