import { Check, ChevronRight, FilePlus2, Loader } from "lucide-react";
import { ReactNode, forwardRef, useRef, useState } from "react";
import { CreationState, Peer } from "../Peer";
import { toBlobUrl } from "../toBlobUrl";
import { Button } from "./Button";
import { LinkButton } from "./LinkButton";
import { receiveRemotePayload } from "../receiveRemotePayload";
import { usePeerStatus } from "./usePeer";

export function ShareFlow({
  peer,
  type,
}: {
  peer: Peer;
  type: "offerer" | "answerer";
}) {
  const status = usePeerStatus(peer);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dataUrl, setDataUrl] = useState<string>();

  const handleClickCreate = async () => {
    if (type === "offerer") {
      await peer.createOffer();
    } else {
      await peer.createAnswer();
    }

    if (!peer.rtcpc.localDescription) return;

    const url = toBlobUrl({
      sdp: peer.rtcpc.localDescription,
      ics: peer.ics,
    });

    setDataUrl(url);
  };

  const handleSelectFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLoadFileClick = () => {
    if (fileInputRef.current) {
      const file = fileInputRef.current.files?.item(0);
      if (file && peer) {
        receiveRemotePayload(peer, file);
      }
    }
  };

  const offerFlow = [
    <CreationStateButton
      text="Create offer"
      creationState={status.offer}
      onClick={handleClickCreate}
    />,
    <LinkButton href={dataUrl} download>
      Save offer
    </LinkButton>,
    <FileInputButton ref={fileInputRef} onClick={handleSelectFileClick}>
      Select answer file
    </FileInputButton>,
    <Button onClick={handleLoadFileClick}>Load answer</Button>,
  ];

  const answerFlow = [
    <FileInputButton ref={fileInputRef} onClick={handleSelectFileClick}>
      Select offer file
    </FileInputButton>,
    <Button onClick={handleLoadFileClick}>Load offer</Button>,
    <CreationStateButton
      text="Create answer"
      creationState={status.answer}
      onClick={handleClickCreate}
    />,
    <LinkButton href={dataUrl} download>
      Save answer
    </LinkButton>,
  ];

  const flow = type === "offerer" ? offerFlow : answerFlow;
  const isNotLast = (i: number) => flow.length - 1 > i;

  return (
    <div className="my-8 flex items-center justify-center gap-x-4 rounded-2xl border-2 border-purple-900 p-8">
      {flow.map((c, i) => {
        return (
          <>
            <div className="">{c}</div>
            {isNotLast(i) && (
              <div className="">
                <ChevronRight />
              </div>
            )}
          </>
        );
      })}
    </div>
  );
}

function CreationStateButton({
  creationState,
  onClick,
  text,
}: {
  creationState: CreationState;
  onClick: () => void;
  text: string;
}) {
  let icon;
  switch (creationState) {
    case CreationState.Creating:
      icon = (
        <div className="bg-yellow-100 p-4 text-yellow-900 group-hover:bg-yellow-200">
          <Loader className="animate-spin" />
        </div>
      );
      break;
    case CreationState.Created:
      icon = (
        <div className="bg-green-100 p-4 text-green-900 group-hover:bg-green-200">
          <Check />
        </div>
      );
      break;
    case CreationState.Uncreated:
    default:
      icon = (
        <div className="bg-purple-100 p-4 text-purple-900 group-hover:bg-purple-200">
          <FilePlus2 />
        </div>
      );
      break;
  }

  return (
    <button
      className="group overflow-hidden rounded-lg border-2 border-purple-900 bg-purple-100 text-purple-900 hover:bg-purple-200"
      onClick={onClick}
    >
      <div className="flex">
        <div className="border-r-2 border-purple-900 p-4">{text}</div>
        {icon}
      </div>
    </button>
  );
}

const FileInputButton = forwardRef<
  HTMLInputElement,
  { onClick: () => void; children: ReactNode }
>(({ onClick, children }, ref) => {
  return (
    <>
      <input
        ref={ref}
        className="hidden"
        type="file"
        accept="application/json"
      />
      <Button onClick={onClick}>{children}</Button>
    </>
  );
});
