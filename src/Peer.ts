import * as uuid from "uuid";
import { Store } from "./Store";
import { Message, RemotePeerPayload as PeerPayload, W } from "./types";
import { waitForMs } from "./waitForMs";

export class Peer {
  rtcpc: RTCPeerConnection;
  ics: RTCIceCandidate[];
  mediaStreams: MediaStreams;
  chat: Chat;
  status: Status;

  constructor(window: W) {
    this.rtcpc = new window.RTCPeerConnection();
    this.chat = new Chat(this);
    this.mediaStreams = new MediaStreams(this);
    this.status = new Status();

    this.ics = [];
    this.rtcpc.onicecandidate = (e) => {
      if (e.candidate) {
        this.ics.push(e.candidate);
      }
    };
  }

  async createOffer() {
    this.status.update({ offer: CreationState.Creating });
    const offer = await this.rtcpc.createOffer();
    await this.rtcpc.setLocalDescription(offer);

    // Hack to wait for some ice candidates
    await waitForMs(500);

    this.status.update({ offer: CreationState.Created });
  }

  async createAnswer() {
    this.status.update({ answer: CreationState.Creating });
    const answer = await this.rtcpc.createAnswer();
    await this.rtcpc.setLocalDescription(answer);

    // Hack to wait for some ice candidates
    await waitForMs(500);

    this.status.update({ answer: CreationState.Created });
  }

  async receiveRemotePayload({ sdp, ics }: PeerPayload) {
    await this.rtcpc.setRemoteDescription(sdp);
    for (const ic of ics) {
      await this.rtcpc.addIceCandidate(new window.RTCIceCandidate(ic));
    }
  }
}

export enum CreationState {
  Uncreated,
  Creating,
  Created,
}

class Status {
  status: {
    offer: CreationState;
    answer: CreationState;
  };
  store: Store<typeof this.status>;

  constructor() {
    this.status = {
      offer: CreationState.Uncreated,
      answer: CreationState.Uncreated,
    };
    this.store = new Store(() => this.status);
  }

  update(partial: Partial<typeof this.status>) {
    this.status = {
      ...this.status,
      ...partial,
    };
    this.store.emitChange();
  }
}

class MediaStreams {
  mediaStreams: {
    local: MediaStream;
    remote: MediaStream;
  };
  store: Store<typeof this.mediaStreams>;

  constructor(peer: Peer) {
    this.mediaStreams = {
      local: new window.MediaStream(),
      remote: new window.MediaStream(),
    };
    this.store = new Store(() => this.mediaStreams);

    // get local streams
    window.navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((mediaStream) => {
        mediaStream.getTracks().forEach((track) => {
          peer.rtcpc.addTrack(track, mediaStream);
          this.mediaStreams.local.addTrack(track);
        });
        this.store.emitChange();
      });

    // listen for remote streams
    peer.rtcpc.ontrack = (e) => {
      e.streams
        ?.at(0)
        ?.getTracks()
        .forEach((track) => {
          this.mediaStreams.remote.addTrack(track);
        });

      this.store.emitChange();
    };
  }
}

class Chat {
  messages: Message[];
  #dc: RTCDataChannel;
  store: Store<Message[]>;

  constructor(peer: Peer) {
    this.messages = [];

    this.store = new Store(() => this.messages);

    // This creates an "out-of-band" data channel. Both peers create it and it
    // resolves somehow to the same data channel.
    this.#dc = peer.rtcpc.createDataChannel("chat", {
      negotiated: true,
      id: 0,
    });

    this.#dc.onopen = () => console.log("channel open");
    this.#dc.onclose = () => console.log("channel close");
    this.#dc.onerror = () => console.log("channel error");

    // Receive message
    this.#dc.onmessage = (e) => {
      const m: Message = JSON.parse(e.data);
      this.messages.push(m);
      this.store.emitChange();
    };
  }

  sendMessage(content: string) {
    const m: Message = {
      id: uuid.v4(),
      isRemote: false,
      content,
    };
    this.messages.push(m);
    this.store.emitChange();
    this.#dc.send(JSON.stringify(m));
  }
}
