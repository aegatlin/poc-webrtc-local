export type SnapshotOffer = {
  remoteAnswerPayload: PayloadAnswer | null;
  sessionDescription: RTCSessionDescription | null;
  iceCandidates: RTCIceCandidate[];
  messages: Message[];
};

export type PayloadOffer = {
  sessionDescription: RTCSessionDescription | null;
  iceCandidates: RTCIceCandidateInit[];
};

export type SnapshotAnswer = {
  remoteOfferPayload: PayloadOffer | null;
  sessionDescription: RTCSessionDescription | null;
  iceCandidates: RTCIceCandidate[];
  messages: Message[];
};

export type PayloadAnswer = {
  sessionDescription: RTCSessionDescription | null;
  iceCandidates: RTCIceCandidateInit[];
};

export type Message = {
  id: string;
  isRemote: boolean;
  content: string;
};
