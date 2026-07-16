import QuickOptions from "./QuickOptions";
import { X } from "lucide-react";

export default function ChatWindow({ onClose }) {
  return (
    <div className="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">

      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">
            EduShield AI Assistant
          </h2>
          <p className="text-xs text-blue-100">
            Always here to help
          </p>
        </div>

        <button onClick={onClose}>
          <X size={22} />
        </button>
      </div>

      {/* Chat Body */}
      <div className="p-5 h-96 overflow-y-auto">

        <div className="bg-gray-100 rounded-xl p-3 text-sm text-gray-700">
          👋 Hi!

          <br /><br />

          I'm your EduShield Assistant.

          <br /><br />

          How can I help you today?
        </div>

        <QuickOptions />

      </div>

    </div>
  );
}