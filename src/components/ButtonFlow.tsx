import { Check, ChevronRight, FilePlus2, Loader } from "lucide-react";
import { ReactNode, forwardRef, useRef, useState } from "react";
import { CreationState, Peer } from "../Peer";
import { toBlobUrl } from "../temp";
import { FileSelectAndLoad } from "./FileSelectAndLoad";
import { LinkButton } from "./LinkButton";
import { usePeerStatus } from "./usePeer";
import { Button } from "./Button";
import { receiveRemotePayload } from "./Room";

export function OffererFlow({ peer }: { peer: Peer }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [offerDataUrl, setOfferDataUrl] = useState<string>();

  const handleClickCreateOffer = async () => {
    await peer.createOffer();
    if (!peer.rtcpc.localDescription) return;

    const url = toBlobUrl({
      sdp: peer.rtcpc.localDescription,
      ics: peer.ics,
    });

    setOfferDataUrl(url);
  };

  const handleSelectAnswerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLoadAnswerClick = () => {
    if (fileInputRef.current) {
      const file = fileInputRef.current.files?.item(0);
      if (file && peer) {
        receiveRemotePayload(peer, file);
      }
    }
  };

  return (
    <div className="my-8 flex items-center justify-center gap-x-4 border-2 p-8 rounded-2xl border-purple-900">
      <div className="">
        <CreateOfferButton onClick={handleClickCreateOffer} peer={peer} />
      </div>
      <div className="">
        <ChevronRight />
      </div>
      <div className="">
        <LinkButton href={offerDataUrl} download>
          Save offer
        </LinkButton>
      </div>
      <div className="">
        <ChevronRight />
      </div>
      <div className="">
        <FileInputButton ref={fileInputRef} onClick={handleSelectAnswerClick}>
          Select answer file
        </FileInputButton>
      </div>
      <div className="">
        <ChevronRight />
      </div>
      <div className="">
        <Button onClick={handleLoadAnswerClick}>Load answer</Button>
      </div>
    </div>
  );
}

function CreateOfferButton({
  peer,
  onClick,
}: {
  peer: Peer;
  onClick: () => void;
}) {
  const status = usePeerStatus(peer);

  let icon;
  switch (status.offer) {
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
        <div className="border-r-2 border-purple-900 p-4">Create offer</div>
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
