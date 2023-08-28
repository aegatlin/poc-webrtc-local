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

  const text = [
    "About",
    `This is a proof of concept for a purely local webrtc session. The way it works is by collecting the ICE candidates
  and the SDP in a single JSON payload, and saving that payload as a file. That file can then be transferred to a peer
  manually (e.g., a thumb drive), or via the Share Web API (e.g., via the NFC Apple AirDrop utility).`,
    `Usage notes`,
    `Share Web APIs are not fully adopted yet across browsers. The share utility has been tested successfully on
  Safari between a local mac laptop and ipad.`,
  ];

  return (
    <>
      <Header />
      <div className="m-16 flex flex-col items-center gap-8 ">
        <div className="flex space-x-8">
          <Button onClick={handleNewRoomClick}>new room</Button>
          <Button onClick={handleJoinRoomClick}>join room</Button>
        </div>
        <Card>
          <div className="flex flex-col gap-y-4">
            {text.map((t) => (
              <p>{t}</p>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
