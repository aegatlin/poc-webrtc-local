export function toBlobUrl(payload: RemotePeerPayload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  return url;
}

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

