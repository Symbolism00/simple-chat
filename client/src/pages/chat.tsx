import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type MessageStruct = {
  username: string;
  message: string;
  serverMessage: boolean;
  myMessage: boolean;
};

const Chat = () => {
  const [username, setUsername] = useState<string>("");
  const [usernameChecked, setUsernameChecked] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageStruct[]>([]);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  useEffect(() => {
    if (socket === undefined) {
      setSocket(io("http://localhost:4000"));
    }
  }, [socket]);

  useEffect(() => {
    socket?.on("message-server", (username, message, serverMessage) => {
      setMessages([
        ...messages,
        {
          username: username,
          message: message,
          serverMessage: serverMessage,
          myMessage: false,
        },
      ]);
    });
  }, [socket, messages]);

  const joinChat = () => {
    setUsernameChecked(true);
    socket?.emit("join", 123);
    socket?.emit("joined", username, 123);
  };

  const submitMessage = () => {
    socket?.emit("message-client", username, message, 123);
    setMessages([
      ...messages,
      {
        username: username,
        message: message,
        serverMessage: false,
        myMessage: true,
      },
    ]);
    setMessage("");
  };

  return (
    <div className="justify-items-center h-96 grid content-center pt-52">
      <div className="flex flex-row gap-6 mb-8">
        {!usernameChecked ? (
          <>
            <input
              className="flex flex-col bg-gray-200 w-48 m-1 p-1 border-2 border-black"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></input>
            <button
              className="border-2 border-black bg-purple-200 h-10 m-1 hover:bg-purple-300 w-24"
              onClick={joinChat}
            >
              Join
            </button>
          </>
        ) : (
          <h1 className="text-xl">Welcome {username}, let's start chatting!</h1>
        )}
      </div>
      <div className="bg-green-50 h-96 border-2 border-black w-96 overflow-auto">
        {messages.map((messageStruct, index) => {
          return (
            <div key={`${index}`} className={`flex flex-row p-1`}>
              {messageStruct.serverMessage ? (
                <p className="font-semibold">{messageStruct.message}</p>
              ) : (
                <p>
                  {messageStruct.username}: {messageStruct.message}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-10 content-end border-x-2 border-b-2 border-black w-96">
        <input
          className="bg-gray-200 w-48 m-1 p-1 border-2 border-black"
          type="text"
          placeholder="Write something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!usernameChecked}
        ></input>
        <button
          className="border-2 border-black w-40 bg-red-200 h-10 m-1 hover:bg-red-300 disabled:bg-red-600"
          onClick={submitMessage}
          disabled={!usernameChecked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
