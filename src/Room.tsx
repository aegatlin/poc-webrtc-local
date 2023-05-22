import { Disclosure } from "@headlessui/react";
import { ChevronsUpDown } from "lucide-react";
import { useSyncExternalStore } from "react";
import { WrtcOffer } from "./WrtcOffer";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { Header } from "./components/Header";
import { PayloadAnswer, PayloadOffer } from "./types";
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

export function Room() {
  const wrtcSnapshot = useSyncExternalStore(
    wrtcOfferStore.subscribe,
    wrtcOfferStore.getSnapshot
  );

  const handleClickCreateOffer = () => {
    if (window) {
      wrtcOffer.createOffer();
    }
  };

  const handleClickWriteOffer = async () => {
    if (!navigator) return;
    const payload: PayloadOffer = {
      sessionDescription: wrtcSnapshot.sessionDescription,
      iceCandidates: wrtcSnapshot.iceCandidates,
    };
    await navigator.clipboard.writeText(JSON.stringify(payload));
  };

  const handleClickReadAnswer = async () => {
    if (!navigator) return;

    const payloadString = await navigator.clipboard.readText();
    const payload: PayloadAnswer = JSON.parse(payloadString);
    await wrtcOffer.receiveRemoteAnswerPayload(payload);
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center space-y-8 p-8">
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
                  <div className="" key={ic.address}>
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
