interface Message {
  _id: string;
  message: any;
  sender: "user" | "bot";
  color?: string;
  jokes: string[];
  mood:string
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  console.log(message)

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 text-white`}
        style={{ backgroundColor: isUser ? "blue" : message.color }}
      >
        {!isUser && message?.mood && <p>{message.mood}</p>}
        {isUser
          ? message.message
          : message.jokes.map((m: string, index: number) => (
              <p key={index}>
                {index + 1}. {m}
              </p>
            ))}

        {!isUser && !message.jokes.length && message.message}
      </div>
    </div>
  );
}
