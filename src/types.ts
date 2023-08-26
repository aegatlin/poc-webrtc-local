export type Message = {
  id: string;
  isRemote: boolean;
  content: string;
};

export type W = typeof window;

export type RemotePeerPayload = {
  sdp: RTCSessionDescription;
  ics: RTCIceCandidate[];
};
