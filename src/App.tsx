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

  const handleJoinRoom = () => {
    navigate(`/room/join`);
  };

  const handleIdk = async () => {
    if (!videoRef.current) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    videoRef.current.srcObject = stream;
  };

  return (
    <>
      <Header />
      <div className="m-16 flex flex-col items-center gap-8 ">
        <div className="h-80 w-full max-w-screen-lg rounded-lg border-2 border-purple-900 bg-purple-200">
          <video
            className="h-full w-full"
            ref={videoRef}
            autoPlay
            style={{ transform: "rotateY(180deg)" }}
          />
        </div>
        <div className="flex space-x-8">
          <Button onClick={handleNewRoom}>new room</Button>
          <Button onClick={handleJoinRoom}>join room</Button>
          <Button onClick={handleIdk}>idk</Button>
        </div>
        <Card>
          {"a demonstration of the limits of 'true p2p' in the browser"}
        </Card>
      </div>
    </>
  );
}
