import { Peer } from "./Peer";

export async function receiveRemotePayload(peer: Peer, file: File) {
  if (!peer) return;

  const text = await file.text();
  const json = JSON.parse(text);
  await peer.receiveRemotePayload(json);
}
