import { useState } from "react";
import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";

export default function ChatBot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ChatButton onClick={() => setOpen(true)} />

      {open && (
        <ChatWindow onClose={() => setOpen(false)} />
      )}
    </>
  );
}