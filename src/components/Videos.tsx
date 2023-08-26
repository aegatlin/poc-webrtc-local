import { useEffect, useRef } from "react";
import { Peer } from "../Peer";
import { usePeerMediaStreams } from "./usePeer";

export function Videos({ peer }: { peer: Peer }) {
  const mediaStreams = usePeerMediaStreams(peer);
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (mediaStreams.local && localRef.current) {
      localRef.current.srcObject = mediaStreams.local;
    }

    if (mediaStreams.remote && remoteRef.current) {
      remoteRef.current.srcObject = mediaStreams.remote;
    }
  }, [mediaStreams]);

  return (
    <div className="flex max-w-screen-lg flex-col items-center justify-center gap-y-8 rounded-lg border-2 border-purple-900 bg-purple-200 p-8">
      <video
        className={"rounded-2xl border-2 border-purple-900"}
        ref={remoteRef}
        autoPlay
      />
      <video
        className={"rounded-2xl border-2 border-purple-900"}
        ref={localRef}
        autoPlay
        style={{ transform: "rotateY(180deg)" }}
      />
    </div>
  );
}
