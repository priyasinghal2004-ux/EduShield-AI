import { MessageCircle } from "lucide-react";

export default function ChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
    >
      <MessageCircle size={30} />
    </button>
  );
}