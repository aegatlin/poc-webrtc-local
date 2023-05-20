import { Button, Card } from "react-ichabod";
import { useNavigate } from "react-router-dom";
import * as uuid from "uuid";
import { classes } from "./themewind/classes";
import { Header } from "./components/Header";

export function App() {
  const navigate = useNavigate();

  const handleNewRoom = () => {
    const roomId = uuid.v4();
    navigate(`/room/${roomId}`);
  };

  return (
    <>
      <Header />
      <div className="mt-16 flex flex-col items-center">
        <Card classes={classes.card}>
          {"a demonstration of the limits of 'true p2p' in the browser"}
        </Card>
        <div className="flex space-x-8">
          <Button classes={classes.button} onClick={handleNewRoom}>
            new room
          </Button>
          <Button classes={classes.button}>join room</Button>
        </div>
      </div>
    </>
  );
}
