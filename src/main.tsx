import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App.tsx";
import { JoinRoom } from "./components/JoinRoom.tsx";
import { NewRoom } from "./components/NewRoom.tsx";
import "./index.css";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/new",
      element: <NewRoom />,
    },
    {
      path: "/join",
      element: <JoinRoom />,
    },
  ],
  {
    basename: "/poc-webrtc-local",
  }
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
