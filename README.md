# How to run/use simple-chat

- Check if you have node installed on your computer (the last version would be preferred)
- Clone the repository
- Open "client" folder in VSCode, for example, and run "npm i" in the console
- If everything went well then run "npm run dev" (it will say that the server has started at localhost:3000)
- Open "server" folder in VSCode, for example, and run "npm i" in the console
- If everything went well then run "npm run dev" (it will say that the server has started at localhost:4000)
- Open your browser with two tabs in the same URL localhost:3000
- Join two different people by giving them a name
- Start chatting
- Join as many people as you want but be careful that this demonstration is not using any database or persistence context so if you refresh the page or close the tab it will lose all chat history and the people created
- Navigate through the code to see how socket-io works in a simple chat room

## Technologies and Frameworks used in frontend
- Next.js (React and Typescript integrated)
- Tailwind
- Socket-io-client

## Technologies and Frameworks used in backend
- Node.js (with Typescript)
- Express
- Socket-io
