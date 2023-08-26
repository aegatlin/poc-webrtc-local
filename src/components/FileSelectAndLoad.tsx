import { ReactNode, forwardRef, useRef } from "react";
import { Button } from "./Button";
import { receiveRemotePayload } from "./Room";

export function FileSelectAndLoad({ peer, selectText, loadText }) {
  const ref = useRef<HTMLInputElement>(null);

  const onClick = () => {
    if (ref.current) {
      ref.current.click();
    }
  };

  const handleLoadOfferClick = () => {
    if (ref.current) {
      const file = ref.current.files?.item(0);
      if (file && peer) {
        receiveRemotePayload(peer, file);
      }
    }
  };

  return (
    <div className="border p-4">
      <FileInputButton ref={ref} onClick={onClick}>
        {selectText}
      </FileInputButton>
      <Button onClick={handleLoadOfferClick}>{loadText}</Button>
    </div>
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
