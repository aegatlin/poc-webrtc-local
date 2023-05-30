import { Disclosure } from "@headlessui/react";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { WrtcOffer } from "./WrtcOffer";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { Header } from "./components/Header";
import { PayloadAnswer, PayloadOffer, SnapshotOffer } from "./types";
import { MessagePanel } from "./components/MessagePanel";

const wrtcOffer = new WrtcOffer("abc123");

const wrtcOfferStore = {
  subscribe(onStoreChange: () => void) {
    wrtcOffer.subscribe(onStoreChange);
    return () => null;
  },
  getSnapshot() {
    return wrtcOffer.snapshot;
  },
};

const createUrlFromSnapshot = (wrtcSnapshot: SnapshotOffer) => {
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

const writeUrlToClipboard = async (wrtcSnapshot: SnapshotOffer) => {
  const url = createUrlFromSnapshot(wrtcSnapshot);
  await navigator.clipboard.writeText(url.toString());
};

export function Room() {
  const videoLocalRef = useRef<HTMLVideoElement>(null);
  const videoRemoteRef = useRef<HTMLVideoElement>(null);
  const wrtcSnapshot = useSyncExternalStore(
    wrtcOfferStore.subscribe,
    wrtcOfferStore.getSnapshot
  );

  const handleClickCreateOffer = () => {
    if (!window) throw "no window";
    wrtcOffer.createOffer();
    writeUrlToClipboard(wrtcSnapshot);
  };

  const handleClickWriteOffer = async () => {
    if (!navigator) return;
    await writeUrlToClipboard(wrtcSnapshot);
  };

  const handleClickReadAnswer = async () => {
    if (!navigator) return;

    const payloadString = await navigator.clipboard.readText();
    const payload: PayloadAnswer = JSON.parse(atob(payloadString));
    await wrtcOffer.receiveRemoteAnswerPayload(payload);
  };

  useEffect(() => {
    if (wrtcSnapshot.mediaStream && videoLocalRef.current) {
      videoLocalRef.current.srcObject = wrtcSnapshot.mediaStream;
    }

    if (wrtcSnapshot.remoteMediaStream && videoRemoteRef.current) {
      videoRemoteRef.current.srcObject = wrtcSnapshot.mediaStream;
    }
  }, [wrtcSnapshot]);

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
              <Button onClick={handleClickCreateOffer}>Create offer</Button>
              <Button onClick={handleClickWriteOffer}>
                Write offer into clipboard
              </Button>
              <Button onClick={handleClickReadAnswer}>
                Read answer from clipboard
              </Button>
            </div>
          </Card>
          <MessagePanel
            messages={wrtcSnapshot.messages}
            sendMessage={wrtcOffer.sendMessage.bind(wrtcOffer)}
          />
        </div>
        <div className="flex w-full max-w-prose flex-col gap-4 break-words rounded-lg border-2 border-purple-900 p-4">
          {wrtcSnapshot.sessionDescription && (
            <Disclosure>
              <Disclosure.Button className="flex justify-between rounded-lg bg-purple-100 p-2 text-purple-900 hover:bg-purple-200">
                <span className="mr-8">Local Offer Session Description</span>
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
                  <div className="" key={JSON.stringify(ic.toJSON())}>
                    <p>{JSON.stringify(ic)}</p>
                  </div>
                ))}
              </Disclosure.Panel>
            </Disclosure>
          )}
          {wrtcSnapshot.remoteAnswerPayload && (
            <>
              <Disclosure>
                <Disclosure.Button className="flex justify-between rounded-lg bg-purple-100 p-2 text-purple-900 hover:bg-purple-200">
                  <span className="mr-8">
                    Remote Answer Session Description
                  </span>
                  <ChevronsUpDown />
                </Disclosure.Button>
                <Disclosure.Panel className="p-2">
                  {JSON.stringify(
                    wrtcSnapshot.remoteAnswerPayload.sessionDescription
                  )}
                </Disclosure.Panel>
              </Disclosure>
              <Disclosure>
                <Disclosure.Button className="flex justify-between rounded-lg bg-purple-100 p-2 text-purple-900 hover:bg-purple-200">
                  <span className="mr-8">Remote Answer Ice Candidates</span>
                  <ChevronsUpDown />
                </Disclosure.Button>
                <Disclosure.Panel className="p-2">
                  {wrtcSnapshot.remoteAnswerPayload.iceCandidates.map((ic) => (
                    <div className="" key={ic.candidate}>
                      <p>{JSON.stringify(ic)}</p>
                    </div>
                  ))}
                </Disclosure.Panel>
              </Disclosure>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function useVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [started, setStarted] = useState(false);

  const start = async () => {
    if (!ref.current) return;
    setStarted(true);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    ref.current.srcObject = stream;
    setStream(stream);
  };

  const state: "off" | "on" | "loading" = started
    ? stream
      ? "on"
      : "loading"
    : "off";

  return {
    ref,
    start,
    state,
  };
}
