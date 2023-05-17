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
  const [isUserA, setIsUserA] = useState<boolean>(true);
  const [chatId, setChatId] = useState<string>("");
  const [offsetMessages, setOffsetMessages] = useState<number>(10);

  useEffect(() => {
    if (socket === undefined) {
      setSocket(io("http://localhost:3001"));
    }
  }, [socket]);

  useEffect(() => {
    socket?.on("joinedChat", (chat) => {
      setChatId(chat.chatId);
      setMessages(
        chat.messages.map((message: any) => {
          return {
            username: message.userId,
            message: message.content,
            myMessage: true,
            serverMessage: false,
          };
        })
      );
    });

    socket?.on("newChatMessage", (message) => {
      const newMessages: MessageStruct[] = [
        {
          username: isUserA ? "2" : "1",
          message: message,
          serverMessage: false,
          myMessage: true,
        },
      ];
      setMessages(newMessages.concat(messages));
      const offset: number = offsetMessages + 1;
      setOffsetMessages(offset);
    });

    socket?.on("collectedChatHistory", (chat) => {
      const oldMessages: MessageStruct[] = messages;
      const chatHistory: MessageStruct[] = chat.messages.map((message: any) => {
        return {
          username: message.userId,
          message: message.content,
          myMessage: true,
          serverMessage: false,
        };
      });
      setMessages(oldMessages.concat(chatHistory));
    });
  }, [socket, messages]);

  const joinChat = (isUserA: boolean) => {
    setUsernameChecked(true);
    setIsUserA(isUserA);
    socket?.emit("joinChat", { userIdA: 1, userIdB: 2 });
  };

  const submitMessage = () => {
    socket?.emit("chatMessage", {
      chatId: chatId,
      userId: isUserA ? 1 : 2,
      content: message,
    });
    const newMessages: MessageStruct[] = [
      {
        username: isUserA ? "1" : "2",
        message: message,
        serverMessage: false,
        myMessage: true,
      },
    ];
    setMessages(newMessages.concat(messages));
    setMessage("");
    const offset: number = offsetMessages + 1;
    setOffsetMessages(offset);
  };

  const loadChatHistory = (e: any) => {
    if (
      e.currentTarget.scrollHeight -
        e.currentTarget.clientHeight +
        e.currentTarget.scrollTop ===
      0
    ) {
      socket?.emit("chatHistory", {
        chatId: chatId,
        offset: offsetMessages,
        limit: 10,
      });
      const offset: number = offsetMessages + 10;
      setOffsetMessages(offset);
    }
  };

  return (
    <div className="justify-items-center h-96 grid content-center pt-52">
      <div className="flex flex-row gap-6 mb-8">
        {!usernameChecked ? (
          <>
            <button
              className="border-2 border-black bg-blue-200 h-10 m-1 hover:bg-blue-300 w-24"
              onClick={() => joinChat(true)}
            >
              User A
            </button>
            <button
              className="border-2 border-black bg-green-200 h-10 m-1 hover:bg-green-300 w-24"
              onClick={() => joinChat(false)}
            >
              User B
            </button>
          </>
        ) : (
          <h1 className="text-xl">Welcome {username}, lets start chatting!</h1>
        )}
      </div>
      <div
        className="flex bg-green-50 h-96 border-2 border-black w-96 overflow-auto flex-col-reverse"
        onScroll={loadChatHistory}
      >
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
