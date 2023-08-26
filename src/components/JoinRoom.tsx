import { Peer } from "../Peer";
import { ShareFlow } from "./ShareFlow";
import { Header } from "./Header";
import { Room } from "./Room";
import { usePeer } from "./usePeer";

export function JoinRoom() {
  const peer = usePeer();

  if (!peer) return <div className="">Loading...</div>;

  return <WithPeer peer={peer} />;
}

function WithPeer({ peer }: { peer: Peer }) {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center gap-8">
        <ShareFlow peer={peer} type="answerer" />
      </div>
      <div className="flex flex-col items-center space-y-8 p-8">
        {peer && <Room peer={peer} />}
      </div>
    </>
  );
}
