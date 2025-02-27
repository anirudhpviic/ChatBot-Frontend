import parse from "html-react-parser";

interface Message {
  _id: string;
  question?: string;
  response?: string;
  sender: "user" | "bot";
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  console.log(message);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {message.sender === "user" ? (
        <div
          className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 text-white`}
          style={{ backgroundColor: "blue" }}
        >
          {message.question}
        </div>
      ) : (
        <div
          className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 `}
          dangerouslySetInnerHTML={{
            __html: "<div> " + message.response + " </div>",
          }}
        ></div>
      )}
    </div>
  );
}
