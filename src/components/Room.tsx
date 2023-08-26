import { Peer } from "../Peer";
import { MessagePanel } from "./MessagePanel";
import { Videos } from "./Videos";

/**
 * The `Room` contains all the p2p interactions, so the videos and chat.  If
 * there was a game board or other interactions, it would be in the "Room" as
 * well.
 */
export function Room({ peer }: { peer: Peer }) {
  return (
    <>
      <div className="flex gap-4">
        {peer ? <Videos peer={peer} /> : "loading... "}
        {peer ? <MessagePanel peer={peer} /> : "loading..."}
      </div>
    </>
  );
}
