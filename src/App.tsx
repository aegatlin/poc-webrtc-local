import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as uuid from "uuid";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { Header } from "./components/Header";

export function App() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleNewRoom = () => {
    const roomId = uuid.v4();
    navigate(`/room/${roomId}`);
  };

  return (
    <>
      <Header />
      <div className="m-16 flex flex-col items-center gap-8 ">
        <div className="flex space-x-8">
          <Button onClick={handleNewRoom}>new room</Button>
        </div>
        <Card>
          {"a demonstration of the limits of 'true p2p' in the browser"}
        </Card>
      </div>
    </>
  );
}
