export const buttonClass =
  "rounded-lg bg-purple-100 p-4 text-purple-900 hover:bg-purple-200";

export const Button = ({ children, onClick }) => {
  return (
    <button
      className="rounded-lg border-purple-900 border-2 bg-purple-100 p-4 text-purple-900 hover:bg-purple-200"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
