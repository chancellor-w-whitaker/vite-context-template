export const MainContainer = ({ children }) => {
  return (
    <main className="container">
      <div className="my-3 p-3 bg-body rounded shadow-sm">{children}</div>
    </main>
  );
};
