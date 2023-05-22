import { useNavigate } from "react-router-dom";
import * as uuid from "uuid";
import { Header } from "./components/Header";
import { Card } from "./components/Card";
import { Button } from "./components/Button";

export function App() {
  const navigate = useNavigate();

  const handleNewRoom = () => {
    const roomId = uuid.v4();
    navigate(`/room/${roomId}`);
  };

  const handleJoinRoom = () => {
    navigate(`/room/join`)
  }

  return (
    <>
      <Header />
      <div className="mt-16 flex flex-col items-center gap-8">
        <div className="flex space-x-8">
          <Button onClick={handleNewRoom}>new room</Button>
          <Button onClick={handleJoinRoom}>join room</Button>
        </div>
        <Card>
          {"a demonstration of the limits of 'true p2p' in the browser"}
        </Card>
      </div>
    </>
  );
}
