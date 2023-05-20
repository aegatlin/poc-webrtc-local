import { useEffect, useSyncExternalStore } from "react";
import { Wrtc } from "./Wrtc";
import { Header } from "./components/Header";
import * as I from "react-ichabod";
import { classes as c } from "./themewind/classes";

const wrtc = new Wrtc("abc123");

export const wrtcStore = {
  subscribe(onStoreChange: () => void) {
    wrtc.setOnUpdateCallback(onStoreChange);
    return () => null;
  },
  getSnapshot() {
    return wrtc.getSnapshot();
  },
};

export function Room() {
  const wrtcSnapshot = useSyncExternalStore(
    wrtcStore.subscribe,
    wrtcStore.getSnapshot
  );

  useEffect(() => {
    if (window) {
      wrtc.createOffer();
    }
  }, []);

  return (
    <>
      <Header />
      <div className="">
        <I.Card classes={c.card}>
          <div className="mb-4 border-b pb-4">
            <p className="text-xl">Local SDP</p>
          </div>
          <div className="">
            {wrtcSnapshot.localDescription ?? "no local sdp yet"}
          </div>
        </I.Card>
        <I.Card classes={c.card}>
          <div className="mb-4 border-b pb-4">
            <p className="text-xl">Ice Candidates</p>
            <p>{wrtcSnapshot.iceCandidates.length}</p>
          </div>
          <div className="">
            {wrtcSnapshot.iceCandidates.map((ic) => {
              return (
                <div className="" key={ic.address}>
                  <p>{JSON.stringify(ic)}</p>
                </div>
              );
            })}
          </div>
        </I.Card>
      </div>
    </>
  );
}
