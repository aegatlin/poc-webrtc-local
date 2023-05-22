import { useState } from "react";
import { Message } from "../types";
import { Button } from "./Button";
import { Card } from "./Card";
export function MessagePanel({
  messages,
  sendMessage,
}: {
  messages: Message[];
  sendMessage: (content: string) => void;
}) {
  const [msg, setMsg] = useState("");

  const handleSendMessageClick = () => {
    sendMessage(msg);
    setMsg("");
  };

  return (
    <Card>
      <div className="flex h-full flex-col">
        <div className="flex max-h-32 flex-col-reverse overflow-auto">
          <div className="flex grow flex-col justify-end gap-1 rounded-lg bg-purple-50 p-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`${
                  m.isRemote ? "self-start" : "self-end"
                } rounded-full bg-purple-200 px-3 py-1 text-purple-900`}
              >
                {m.content}
              </div>
            ))}
          </div>
        </div>
        <span className="mt-2 flex gap-2">
          <input
            type="text"
            name=""
            id=""
            value={msg}
            onChange={(e) => setMsg(e.currentTarget.value)}
            className="rounded-lg border-2 border-purple-900 p-4"
            placeholder="...message peer"
          />
          <Button onClick={handleSendMessageClick}>Send</Button>
        </span>
      </div>
    </Card>
  );
}
