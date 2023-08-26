import { useState } from "react";
import { Peer } from "../Peer";
import { Button } from "./Button";
import { Card } from "./Card";
import { usePeerChat } from "./usePeer";

export function MessagePanel({ peer }: { peer: Peer }) {
  const { messages, sendMessage } = usePeerChat(peer);
  const [newMsg, setNewMsg] = useState("");

  const handleSendMessageClick = () => {
    sendMessage(newMsg);
    setNewMsg("");
  };

  return (
    <Card>
      <div className="flex h-full flex-col">
        <div className="flex grow flex-col-reverse overflow-auto">
          {messages.length > 0 ? (
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
          ) : (
            <div className="flex grow items-center justify-center rounded-lg bg-purple-50 p-2">
              <span className="text-purple-900">No messages yet</span>
            </div>
          )}
        </div>
        <span className="mt-2 flex gap-2">
          <input
            type="text"
            name=""
            id=""
            value={newMsg}
            onChange={(e) => setNewMsg(e.currentTarget.value)}
            className="rounded-lg border-2 border-purple-900 p-4"
            placeholder="...message peer"
          />
          <Button onClick={handleSendMessageClick}>Send</Button>
        </span>
      </div>
    </Card>
  );
}
