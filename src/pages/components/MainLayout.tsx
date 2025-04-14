import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <main className="min-h-screen bg-[#0F172A]">
      <div className="container mx-auto px-4 pt-36">
        <Outlet />
      </div>
    </main>
  );
};
