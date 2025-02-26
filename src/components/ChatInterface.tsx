import { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import InputBox from "./InputBox";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { socket } from "../socket/socket";
import parse from 'html-react-parser';


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
      // setPartialResponse("");
      // Update your UI with the final response
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
      console.log("response", res);
      setUserId(res.data.data.user._id);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          _id: uuidv4(),
          message: `${res.data.data.greetings}, ${res.data.data.introduction}`,
          mood: "",
          color: "gray",
          sender: "bot",
          jokes: [],
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
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
        { _id: uuidv4(), message, sender: "user" },
      ]);

      setLoading(true);
      try {
        const res = await axios.post("http://localhost:3002/chat", {
          userText: message,
          userId,
        });
        console.log("res", res);

        // setMessages((prevMessages) => [
        //   ...prevMessages,
        //   {
        //     _id: uuidv4(),
        //     jokes: res.data.data.jokes,
        //     mood: res.data.data.mood,
        //     color: res.data.data.color,
        //     sender: "bot",
        //   },
        // ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <h2>{nickName}</h2>
        <div className="bg-[#f0ec29]">asdfasdf</div>
        {messages.map((message) => (
          <MessageBubble key={message._id} message={message} />
        ))}
        
        {partialResponse && (
          // <div  dangerouslySetInnerHTML={{ __html: partialResponse }} />
          <div className="bg-[#6529f0]">{parse(partialResponse)}</div>

        )}
      </div>
      {loading && <div className="px-4 text-right">Generating...</div>}
      <InputBox onSendMessage={handleSendMessage} />
    </div>
  );
}
