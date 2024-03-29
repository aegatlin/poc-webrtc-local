import { Check, ChevronRight, FilePlus2, Loader } from "lucide-react";
import {
  Fragment,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
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
  const selectAnswerFileInputRef = useRef<FileHandle>(null);
  const selectOfferFileInputRef = useRef<FileHandle>(null);
  const [dataUrl, setDataUrl] = useState<string>();
  const canShare = !!window?.navigator?.canShare;

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

  const offerFlow = [
    <CreationStateButton
      text="Create offer"
      creationState={status.offer}
      onClick={handleClickCreate}
    />,
    <LinkButton href={dataUrl} download>
      Save offer
    </LinkButton>,
  ];

  if (canShare) {
    offerFlow.push(
      <FileInputButton ref={selectOfferFileInputRef}>
        Select offer file
      </FileInputButton>,
      <FileShareButton
        getFile={() => {
          const file = selectOfferFileInputRef.current?.getFile();
          return file && peer ? file : null;
        }}
      >
        Share offer file
      </FileShareButton>
    );
  }

  offerFlow.push(
    <FileInputButton ref={selectAnswerFileInputRef}>
      Select answer file
    </FileInputButton>,
    <Button
      onClick={() => {
        const file = selectAnswerFileInputRef.current?.getFile();
        if (file && peer) {
          receiveRemotePayload(peer, file);
        }
      }}
    >
      Load answer
    </Button>
  );

  const answerFlow = [
    <FileInputButton ref={selectOfferFileInputRef}>
      Select offer file
    </FileInputButton>,
    <Button
      onClick={() => {
        const file = selectOfferFileInputRef.current?.getFile();
        if (file && peer) {
          receiveRemotePayload(peer, file);
        }
      }}
    >
      Load offer
    </Button>,
    <CreationStateButton
      text="Create answer"
      creationState={status.answer}
      onClick={handleClickCreate}
    />,
    <LinkButton href={dataUrl} download>
      Save answer
    </LinkButton>,
  ];

  if (canShare) {
    answerFlow.push(
      <FileInputButton ref={selectAnswerFileInputRef}>
        Select answer file
      </FileInputButton>,
      <FileShareButton
        getFile={() => {
          const file = selectAnswerFileInputRef.current?.getFile();
          return file && peer ? file : null;
        }}
      >
        Share answer file
      </FileShareButton>
    );
  }

  const flow = type === "offerer" ? offerFlow : answerFlow;
  const isNotLast = (i: number) => flow.length - 1 > i;

  return (
    <div className="mx-16 my-8 flex max-w-6xl flex-wrap items-center justify-center gap-4 gap-x-4 rounded-2xl border-2 border-purple-900 p-8">
      {flow.map((c, i) => {
        return (
          <Fragment key={i}>
            <div>{c}</div>
            {isNotLast(i) && (
              <div>
                <ChevronRight />
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

function FileShareButton({
  getFile,
  children,
}: {
  getFile: () => File | null;
  children: ReactNode;
}) {
  const canShare = !!window.navigator.canShare;
  const handleOnClick = () => {
    const file = getFile();
    if (!file) return;

    const data = {
      title: "File to share",
      text: "share this file with your peer",
      files: [file],
    };

    if (window.navigator.canShare(data)) {
      window.navigator.share(data);
    } else {
      console.log("cannot share: ", data);
    }
  };

  return (
    <Button
      onClick={handleOnClick}
      disabled={canShare ? false : true}
      title={canShare ? "" : "content sharing is not supported on this browser"}
    >
      {children}
    </Button>
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

type FileHandle = {
  getFile: () => File | null;
};

const FileInputButton = forwardRef<FileHandle, { children: ReactNode }>(
  ({ children }, ref) => {
    const _ref = useRef<HTMLInputElement>(null);

    useImperativeHandle(
      ref,
      () => {
        return {
          getFile: () => {
            const file = _ref.current?.files?.item(0);
            return file ? file : null;
          },
        };
      },
      []
    );

    return (
      <>
        <input
          ref={_ref}
          className="hidden"
          type="file"
          accept="application/json"
        />
        <Button onClick={() => _ref.current?.click()}>{children}</Button>
      </>
    );
  }
);
