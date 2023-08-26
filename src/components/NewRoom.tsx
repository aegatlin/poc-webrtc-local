import { Peer } from "../Peer";
import { OffererFlow } from "./ButtonFlow";
import { Header } from "./Header";
import { Room } from "./Room";
import { usePeer } from "./usePeer";

export function NewRoom() {
  const peer = usePeer();

  if (!peer) return "Loading...";
  return <WithPeer peer={peer} />;
}

function WithPeer({ peer }: { peer: Peer }) {
  return (
    <>
      <Header />
      <div className="flex flex-col gap-8 items-center">
        <OffererFlow peer={peer} />
      </div>
      <div className="flex flex-col items-center space-y-8 p-8">
        {peer && <Room peer={peer} />}
      </div>
    </>
  );
}
