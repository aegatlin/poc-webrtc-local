export function Header() {
  return (
    <div className="flex justify-between border-b-2 border-purple-900 p-8">
      <div className="">
        <a href="/poc-webrtc-local">poc-webrtc-local</a>
      </div>
      <div className="">
        a{" "}
        <a href="https://www.gatlin.io" className="text-blue-500">
          gatlin.io
        </a>{" "}
        project
      </div>
    </div>
  );
}
