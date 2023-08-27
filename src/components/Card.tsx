export const Card = ({ children }) => {
  return (
    <div className="rounded-xl border-2 border-purple-900 p-4 shadow-xl max-w-lg">
      {children}
    </div>
  );
};
