import { Outlet } from "react-router-dom";

export const GameLayout = () => {
  return (
    <div className="w-full h-screen">
      <Outlet />
    </div>
  );
};
