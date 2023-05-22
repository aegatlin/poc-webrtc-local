import { Message, PayloadOffer, SnapshotAnswer, SnapshotOffer } from "./types";
import * as uuid from "uuid";

export class WrtcAnswer {
  id: string;
  rtcPeerConnection: RTCPeerConnection;
  iceCandidates: RTCIceCandidate[];
  dataChannel: RTCDataChannel | null = null;
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
    };

    this.id = id;
    this.rtcPeerConnection = new window.RTCPeerConnection();

    this.iceCandidates = [];
    this.initIceCandidateEventListeners();

    // this.dataChannel = this.rtcPeerConnection.createDataChannel(this.id);
    // this.initLocalDataChannelListeners();
    this.initRemoteDataChannelListeners();
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

  /**
   * I think these listeners are listening to local message
   * events. Aka, they are not actually useful, but are
   * for logging/debugging.
   */
  // private initLocalDataChannelListeners() {
  //   if (!this.dataChannel) throw "no data channel";

  //   this.dataChannel.addEventListener("open", (e) => {
  //     console.log("local datachannel open", e);
  //     this.dataChannel.send("hello from local");
  //   });

  //   this.dataChannel.addEventListener("message", (e) => {
  //     console.log("local message received", e, e.data);
  //   });
  // }

  /**
   * I believe that once a 'datachannel' event is received,
   * it means that a remote connection has been established,
   * and therefore you:
   *
   * 1. have a data channel which was created by remote (so, in this case, offer).
   * 2. Can add listeners to said channel
   * 3. Respond to 'message' events on said channel
   */
  private initRemoteDataChannelListeners() {
    this.rtcPeerConnection.addEventListener("datachannel", (e) => {
      console.log("remote datachannel initiated");
      this.dataChannel = e.channel;

      this.dataChannel.addEventListener("open", (e) => {
        console.log("remote datachannel open");
      });

      this.dataChannel.addEventListener("message", (e) => {
        console.log("remote message received");
        console.log('???? ', e.data, JSON.parse(e.data))
        const msg: Message = JSON.parse(e.data);
        this.addMessage({ ...msg, isRemote: true });
      });
    });
  }
}
