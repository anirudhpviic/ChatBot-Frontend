import { io } from "socket.io-client";

const socket = io("http://localhost:3002"); // Adjust the URL as needed

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

socket.emit("message", { data: "fine" });

socket.on("hi", (data) => {
  console.log("hhi,", data);
});

socket.on("partialResponse", (data) => {
  console.log("Partial response:", data);
  // Update your UI with the partial response
});

socket.on("finalResponse", (data) => {
  console.log("Final response:", data);
  // Update your UI with the final response
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
