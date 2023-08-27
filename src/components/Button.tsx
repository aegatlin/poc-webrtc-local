export const Button = ({ children, onClick, disabled = false, title = "" }) => {
  return (
    <button
      className="rounded-lg border-2 border-purple-900 bg-purple-100 p-4 text-purple-900 hover:bg-purple-200 disabled:cursor-not-allowed disabled:border-gray-900 disabled:bg-gray-100 disabled:text-gray-900"
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
};
