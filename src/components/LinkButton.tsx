export function LinkButton({ href, download, children }) {
  return (
    <div className="w-max h-max">
      <a
        className="rounded-lg border-2 border-purple-900 bg-purple-100 p-4 text-purple-900 hover:bg-purple-200"
        href={href}
        download={!!download}
      >
        {children}
      </a>
    </div>
  );
}
