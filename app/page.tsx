import React from "react";
import AccountPanel from "./components/AccountPanel";
import Users from "./components/User";
import Chat from "./components/ChatApp";

const Home: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <AccountPanel/>
      <Chat />
      <Users/>
    </div>
  );
};

export default Home;
