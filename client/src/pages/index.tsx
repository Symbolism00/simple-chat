import Head from "next/head";
import Chat from "./chat";

export default function Home() {
  return (
    <>
      <Head>
        <title>Chat</title>
      </Head>
      <Chat />
    </>
  );
}
