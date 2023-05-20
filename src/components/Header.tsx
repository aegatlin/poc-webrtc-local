import * as I from "react-ichabod";
import { classes } from "../themewind/classes";

export function Header() {
  return (
    <I.Header classes={classes.header}>
      <div className="">
        <a href="/">poc-webrtc-local</a>
      </div>
      <div className="">
        a{" "}
        <a href="https://www.gatlin.io" className={classes.link}>
          gatlin.io
        </a>{" "}
        project
      </div>
    </I.Header>
  );
}
