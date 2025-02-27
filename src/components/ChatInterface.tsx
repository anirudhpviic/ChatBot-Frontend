import { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import InputBox from "./InputBox";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { socket } from "../socket/socket";
import parse from "html-react-parser";
import { Button } from "./ui/button";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [nickName, setNickName] = useState("");
  const [partialResponse, setPartialResponse] = useState("");

  useEffect(() => {
    socket.on("partialResponse", (data) => {
      console.log("Partial response: jsx:", data);
      setPartialResponse((prev) => prev + data);
    });

    socket.on("finalResponse", (data) => {
      console.log("Final response:", data);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: uuidv4(),
          response: data,
          sender: "bot",
        },
      ]);
      setPartialResponse("");
    });

    return () => {
      socket.off("partialResponse");
      socket.off("finalResponse");
    };
  }, []);

  const createUser = async (nickName: string) => {
    try {
      const res = await axios.post("http://localhost:3002/user/create", {
        nickName,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          nickName,
          _id: res.data.data._id,
        })
      );

      setUserId(res.data.data._id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setNickName(JSON.parse(user).nickName);
      setUserId(JSON.parse(user)._id);
      return;
    }

    const userNickname = prompt("Please enter your nickname:");
    if (userNickname) {
      setNickName(userNickname);
      createUser(userNickname);
    }
  }, []);

  const handleSendMessage = async (message: string) => {
    if (message.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { _id: uuidv4(), question: message, sender: "user" },
      ]);

      setLoading(true);
      try {
        const res = await axios.post("http://localhost:3002/chat", {
          userText: message,
          userId,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between m-4">
        <div>
          <h2>Nickname: {nickName}</h2>
          <h3 className="text-red-500">UserId: {userId}</h3>
        </div>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => {
          if (message.sender === "user") {
            return <MessageBubble key={message._id} message={message} />;
          } else if (message.sender === "bot") {
            return <MessageBubble key={message._id} message={message} />;
          }
        })}

        {partialResponse && (
          <div
            dangerouslySetInnerHTML={{
              __html: "<div> " + partialResponse + "</div>",
            }}
          ></div>
        )}
      </div>
      {loading && <div className="px-4 text-right">Generating...</div>}
      <InputBox onSendMessage={handleSendMessage} />
    </div>
  );
}
