import { useNavigate } from "react-router-dom";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { Header } from "./components/Header";

export function App() {
  const navigate = useNavigate();

  const handleNewRoomClick = () => {
    navigate(`/new`);
  };

  const handleJoinRoomClick = () => {
    navigate(`/join`);
  };

  return (
    <>
      <Header />
      <div className="m-16 flex flex-col items-center gap-8 ">
        <div className="flex space-x-8">
          <Button onClick={handleNewRoomClick}>new room</Button>
          <Button onClick={handleJoinRoomClick}>join room</Button>
        </div>
        <Card>
          {"a demonstration of the limits of 'true p2p' in the browser"}
        </Card>
      </div>
    </>
  );
}
