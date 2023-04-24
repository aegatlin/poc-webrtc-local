import { Button, Card, Header } from "react-ichabod";
import { classes } from "./themewind/classes";

export function App() {
  return (
    <>
      <Header classes={classes.header}>Play</Header>
      <div className="flex flex-col items-center mt-16">
        <Card classes={classes.card}>
          maybe this will be poc-local-webrtc one day!
        </Card>
        <Button classes={classes.button}>hello</Button>
      </div>
    </>
  );
}
