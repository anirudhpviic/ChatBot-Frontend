import ChatInterface from "@/components/ChatInterface";
import "../socket/socket"

const Home = () => {
  return (
    <main className="flex flex-col h-screen bg-gray-100">
      <ChatInterface />
    </main>
  );
};

export default Home;
