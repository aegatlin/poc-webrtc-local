import { Disclosure } from "@headlessui/react";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { WrtcAnswer } from "./WrtcAnswer";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { Header } from "./components/Header";
import { MessagePanel } from "./components/MessagePanel";
import { PayloadAnswer, PayloadOffer, SnapshotAnswer } from "./types";
import { useParams, useSearchParams } from "react-router-dom";

const wrtcAnswer = new WrtcAnswer("def456");

const wrtcAnswerStore = {
  subscribe(onStoreChange: () => void) {
    wrtcAnswer.subscribe(onStoreChange);
    return () => null;
  },
  getSnapshot() {
    return wrtcAnswer.snapshot;
  },
};

const createUrlFromSnapshot = (wrtcSnapshot: SnapshotAnswer) => {
  const payload: PayloadOffer = {
    sessionDescription: wrtcSnapshot.sessionDescription,
    iceCandidates: wrtcSnapshot.iceCandidates,
  };
  const b64Payload = btoa(JSON.stringify(payload));

  const base = import.meta.env.DEV
    ? "http://localhost:5173/poc-webrtc-local"
    : "https://aegatlin.github.io/poc-webrtc-local";

  const url = new URL(`${base}/join?payload=${b64Payload}`);
  return url;
};

const writeUrlToClipboard = async (wrtcSnapshot: SnapshotAnswer) => {
  const url = createUrlFromSnapshot(wrtcSnapshot);
  await navigator.clipboard.writeText(url.toString());
};

export function Join() {
  const [searchParams, _] = useSearchParams();
  const remotePayload = searchParams.get("payload");
  if (!remotePayload) throw "no remote payload";

  const videoLocalRef = useRef<HTMLVideoElement>(null);
  const videoRemoteRef = useRef<HTMLVideoElement>(null);
  const wrtcSnapshot = useSyncExternalStore(
    wrtcAnswerStore.subscribe,
    wrtcAnswerStore.getSnapshot
  );

  useEffect(() => {
    if (wrtcSnapshot.mediaStream && videoLocalRef.current) {
      videoLocalRef.current.srcObject = wrtcSnapshot.mediaStream;
    }

    if (wrtcSnapshot.remoteMediaStream && videoRemoteRef.current) {
      videoRemoteRef.current.srcObject = wrtcSnapshot.mediaStream;
    }
  }, [wrtcSnapshot]);

  const handleClickCreateAnswer = () => {
    if (!window) throw "no window";
    wrtcAnswer.createAnswer();
    writeUrlToClipboard(wrtcSnapshot);
  };

  const handleClickReadOffer = async () => {
    if (!window) throw "no window";
    const payload: PayloadOffer = JSON.parse(atob(remotePayload));
    await wrtcAnswer.receiveRemoteOfferPayload(payload);
  };

  const handleClickWriteAnswer = async () => {
    if (!navigator) return;

    const payload: PayloadAnswer = {
      sessionDescription: wrtcSnapshot.sessionDescription,
      iceCandidates: wrtcSnapshot.iceCandidates,
    };
    const b64Payload = btoa(JSON.stringify(payload));

    await navigator.clipboard.writeText(b64Payload);
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center space-y-8 p-8">
        <div className="flex h-80 w-full max-w-screen-lg items-center justify-center rounded-lg border-2 border-purple-900 bg-purple-200">
          <video
            className={"h-full w-full"}
            ref={videoLocalRef}
            autoPlay
            style={{ transform: "rotateY(180deg)" }}
          />
          {wrtcSnapshot.remoteMediaStream && (
            <video
              className={"h-full w-full"}
              ref={videoRemoteRef}
              autoPlay
              style={{ transform: "rotateY(180deg)" }}
            />
          )}
        </div>
        <div className="flex gap-8">
          <Card>
            <div className="flex flex-col items-center space-y-4">
              <Button onClick={handleClickReadOffer}>
                Read offer
              </Button>
              <Button onClick={handleClickCreateAnswer}>Create answer</Button>
              <Button onClick={handleClickWriteAnswer}>
                Write answer into clipboard
              </Button>
            </div>
          </Card>
          <MessagePanel
            messages={wrtcSnapshot.messages}
            sendMessage={wrtcAnswer.sendMessage.bind(wrtcAnswer)}
          />
        </div>
        <div className="flex w-full max-w-prose flex-col gap-4 break-words rounded-lg border-2 border-purple-900 p-4">
          {wrtcSnapshot.remoteOfferPayload && (
            <>
              <Disclosure>
                <Disclosure.Button className="flex justify-between rounded-lg bg-purple-100 p-2 text-purple-900 hover:bg-purple-200">
                  <span className="mr-8">Remote Offer Session Description</span>
                  <ChevronsUpDown />
                </Disclosure.Button>
                <Disclosure.Panel className="p-2">
                  {JSON.stringify(
                    wrtcSnapshot.remoteOfferPayload.sessionDescription
                  )}
                </Disclosure.Panel>
              </Disclosure>
              <Disclosure>
                <Disclosure.Button className="flex justify-between rounded-lg bg-purple-100 p-2 text-purple-900 hover:bg-purple-200">
                  <span className="mr-8">Remote Offer Ice Candidates</span>
                  <ChevronsUpDown />
                </Disclosure.Button>
                <Disclosure.Panel className="p-2">
                  {wrtcSnapshot.remoteOfferPayload.iceCandidates.map((ic) => {
                    return (
                      <div className="" key={ic.candidate}>
                        <p>{JSON.stringify(ic)}</p>
                      </div>
                    );
                  })}
                </Disclosure.Panel>
              </Disclosure>
            </>
          )}
          {wrtcSnapshot.sessionDescription && (
            <Disclosure>
              <Disclosure.Button className="flex justify-between rounded-lg bg-purple-100 p-2 text-purple-900 hover:bg-purple-200">
                <span className="mr-8">Local Answer Session Description</span>
                <ChevronsUpDown />
              </Disclosure.Button>
              <Disclosure.Panel className="p-2">
                {JSON.stringify(wrtcSnapshot.sessionDescription)}
              </Disclosure.Panel>
            </Disclosure>
          )}
          {wrtcSnapshot.iceCandidates.length > 0 && (
            <Disclosure>
              <Disclosure.Button className="flex justify-between rounded-lg bg-purple-100 p-2 text-purple-900 hover:bg-purple-200">
                <span className="mr-8">Local Ice Candidates</span>
                <ChevronsUpDown />
              </Disclosure.Button>
              <Disclosure.Panel className="p-2">
                {wrtcSnapshot.iceCandidates.map((ic) => (
                  <div className="" key={ic.address}>
                    <p>{JSON.stringify(ic)}</p>
                  </div>
                ))}
              </Disclosure.Panel>
            </Disclosure>
          )}
        </div>
      </div>
    </>
  );
}
