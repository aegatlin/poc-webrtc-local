import { RemotePeerPayload } from "./types";

export function toBlobUrl(payload: RemotePeerPayload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  return url;
}
