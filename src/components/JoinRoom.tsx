import { Room } from "./Room";
import { Header } from "./Header";
import { usePeer } from "./usePeer";

export function JoinRoom() {
  const peer = usePeer();

  return (
    <>
      <Header />
      <div className="flex flex-col items-center space-y-8 p-8">
        {peer && <Room peer={peer} />}
      </div>
    </>
  );
}
