import * as uuid from "uuid";
import { Store } from "./Store";
import { Message } from "./types";
import { Peer } from "./Peer";

export class Chat {
  #messages: Message[];
  #dc: RTCDataChannel;
  store: Store<Message[]>;

  constructor(peer: Peer) {
    this.#messages = [];

    this.store = new Store(() => this.#messages);

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
      const m: Omit<Message, "isRemote"> = JSON.parse(e.data);
      this.#messages = [
        ...this.#messages,
        {
          ...m,
          isRemote: true,
        },
      ];
      this.store.emitChange();
    };
  }

  sendMessage(content: string) {
    const m: Omit<Message, "isRemote"> = {
      id: uuid.v4(),
      content,
    };
    this.#messages.push({
      ...m,
      isRemote: false,
    });
    this.store.emitChange();
    this.#dc.send(JSON.stringify(m));
  }
}
