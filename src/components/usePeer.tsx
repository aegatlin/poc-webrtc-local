import { useEffect, useState, useSyncExternalStore } from "react";
import { Peer } from "../Peer";

export function usePeer() {
  const [peer, setPeer] = useState<Peer>();

  // If useEffect runs, there's a window
  // aka: we are on the client-side
  useEffect(() => {
    setPeer(new Peer(window));
  }, []);

  return peer;
}

export function usePeerStatus(peer: Peer) {
  const status = useSyncExternalStore(
    peer.status.store.subscribe.bind(peer.status.store),
    peer.status.store.getSnapshot.bind(peer.status.store),
  )

  return status
}

export function usePeerChat(peer: Peer) {
  const messages = useSyncExternalStore(
    peer.chat.store.subscribe.bind(peer.chat.store),
    peer.chat.store.getSnapshot.bind(peer.chat.store)
  );

  return {
    messages,
    sendMessage: peer.chat.sendMessage.bind(peer.chat),
  };
}

export function usePeerMediaStreams(peer: Peer) {
  const mediaStreams = useSyncExternalStore(
    peer.mediaStreams.store.subscribe.bind(peer.mediaStreams.store),
    peer.mediaStreams.store.getSnapshot.bind(peer.mediaStreams.store)
  );

  return mediaStreams;
}
