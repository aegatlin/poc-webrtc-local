export class Wrtc {
  id: string;
  rtcPeerConnection: RTCPeerConnection;
  iceCandidates: RTCIceCandidate[];
  dataChannel: RTCDataChannel;
  public onUpdateCallback: () => void;
  public snapshot: {
    localDescription: string | null;
    iceCandidates: RTCIceCandidate[];
  } = {
    localDescription: null,
    iceCandidates: [],
  };

  constructor(
    id: string,
    onUpdateCallback: Wrtc["onUpdateCallback"] = () => null
  ) {
    if (!window) throw "no window";
    this.onUpdateCallback = onUpdateCallback;

    this.id = id;
    this.rtcPeerConnection = new window.RTCPeerConnection();

    this.iceCandidates = [];
    this.initIceCandidateEventListeners();

    this.dataChannel = this.rtcPeerConnection.createDataChannel(this.id);
    this.initLocalDataChannelListeners();
    this.initRemoteDataChannelListeners();
  }

  setOnUpdateCallback(onUpdateCallback: Wrtc["onUpdateCallback"]) {
    this.onUpdateCallback = onUpdateCallback;
  }

  private update() {
    this.setSnapshot();
    this.onUpdateCallback();
  }

  getSnapshot() {
    return this.snapshot;
  }

  private setSnapshot() {
    this.snapshot = {
      localDescription: this?.rtcPeerConnection?.localDescription?.sdp ?? null,
      iceCandidates: this.iceCandidates,
    };
  }

  async createOffer() {
    const offer = await this.rtcPeerConnection.createOffer();
    await this.rtcPeerConnection.setLocalDescription(offer);
    this.update();
  }

  private initIceCandidateEventListeners() {
    if (!this.rtcPeerConnection) throw "no rtcPeerConnection";

    this.rtcPeerConnection.addEventListener("icecandidate", (e) => {
      console.log("ice candidate event: ", e);
      if (e.candidate) {
        this.iceCandidates.push(e.candidate);
        this.update();
      }
    });
  }

  /**
   * I think these listeners are listening to local message
   * events. Aka, they are not actually useful, but are
   * for logging/debugging.
   */
  private initLocalDataChannelListeners() {
    if (!this.dataChannel) throw "no data channel";

    this.dataChannel.addEventListener("open", (e) => {
      console.log("local datachannel open", e);
      this.dataChannel.send("hello from local");
    });

    this.dataChannel.addEventListener("message", (e) => {
      console.log("local message received", e, e.data);
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
  private initRemoteDataChannelListeners() {
    this.rtcPeerConnection.addEventListener("datachannel", (e) => {
      console.log("remote datachannel event: ", e);
      const dataChannel = e.channel;

      dataChannel.addEventListener("open", (e) => {
        console.log("remote datachannel open", e);
        dataChannel.send("hello from remote");
      });

      dataChannel.addEventListener("message", (e) => {
        console.log("remote message received", e, e.data);
      });
    });
  }
}
