import { useState } from "react";
import QuickOptions from "./QuickOptions";
import { X } from "lucide-react";
import FinancialMenu from "./FinancialMenu";
import NeedHelpForm from "./NeedHelpForm";

export default function ChatWindow({ onClose }) {
    const [messages, setMessages] = useState([]);
    const [showNeedHelpForm, setShowNeedHelpForm] = useState(false);
    const [showFinancialMenu, setShowFinancialMenu] = useState(false);
    const handleOptionClick = (option) => {
        let reply = "";

        switch (option) {
            case "Financial Assistance":
                reply = "Please choose one of the following financial support options.";
                setShowFinancialMenu(true);
                break;

            case "Mental Health":
                reply =
                    "🧠 If you're feeling stressed or anxious, I can help you connect with your teacher or counsellor.";
                break;

            case "Scholarships":
                reply =
                    "🎓 Available Scholarships:\n\n• National Scholarship Portal (NSP)\n• Reliance Foundation\n• HDFC Parivartan Scholarship\n• PM Scholarship Scheme";
                break;

            case "NGO":
                reply =
                    "🏢 NGOs available:\n\n• Smile Foundation\n• CRY\n• Pratham\n\nA teacher can help you connect with them.";
                break;

            case "Fee":
                reply =
                    "💵 Fee Assistance\n\nPlease contact your class teacher. They can review your case and help you apply for fee concessions or financial aid.";
                break;

                case "Need Help":
                    reply = "Please fill out the support request form below.";
                    setShowNeedHelpForm(true);
                    break;

            default:
                reply = "How can I help you?";
        }

        setMessages((prev) => [...prev, { option, reply }]);
    };
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

                <QuickOptions onSelect={handleOptionClick} />
                {showFinancialMenu && (
                    <FinancialMenu onSelect={handleOptionClick} />
                )}
                {showNeedHelpForm && <NeedHelpForm />}
                {messages.map((msg, index) => (
                    <div key={index} className="mt-4">
                        <div className="bg-blue-100 text-blue-900 p-3 rounded-xl text-sm font-medium">
                            {msg.option}
                        </div>

                        <div className="bg-gray-100 text-gray-700 p-3 rounded-xl text-sm mt-2">
                            {msg.reply}
                        </div>
                    </div>
                ))}

            </div>

        </div>
    );
}