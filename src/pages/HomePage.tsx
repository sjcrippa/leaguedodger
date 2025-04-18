import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col justify-center bg-slate-700 px-12 py-16 rounded-2xl">
        <div className="flex flex-col">
          <h1 className="text-[4rem] leading-tight font-bold text-white mb-16">
            League
            <br />
            Dodger
          </h1>
          <div className="flex flex-col gap-3">
            <Link
              to="/game"
              className="bg-[#3B82F6] hover:bg-blue-700 text-white font-bold border-2 border-gray-500 transition-colors py-4 rounded-xl text-center text-xl"
            >
              Start Game
            </Link>
            <Link
              to="/tutorial"
              className="bg-[#374151] hover:bg-gray-600 text-white font-bold border-2 border-gray-500 transition-colors py-4 rounded-xl text-center text-xl"
            >
              Tutorial
            </Link>
            <Link
              to="/settings"
              className="bg-[#374151] hover:bg-gray-600 text-white font-bold border-2 border-gray-500 transition-colors py-4 rounded-xl text-center text-xl"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
