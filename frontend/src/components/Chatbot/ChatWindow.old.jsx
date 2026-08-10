import MentalHealthMenu from "./MentalHealthMenu";
import { useState } from "react";
import QuickOptions from "./QuickOptions";
import { X } from "lucide-react";
import FinancialMenu from "./FinancialMenu";
import NeedHelpForm from "./NeedHelpForm";
import MentalHealthActions from "./MentalHealthActions";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function ChatWindow({ onClose }) {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [showNeedHelpForm, setShowNeedHelpForm] = useState(false);
    const [showFinancialMenu, setShowFinancialMenu] = useState(false);
    const [showMentalMenu, setShowMentalMenu] = useState(false);
    const [showMentalActions, setShowMentalActions] = useState(false);
    const handleOptionClick = async (option) => {
        let reply = "";

        switch (option) {
            case "Financial Assistance":
                reply = "Please choose one of the following financial support options.";
                setShowFinancialMenu(true);
                setShowMentalMenu(false);
                break;

            case "Mental Health":
                reply = "Please choose what you're experiencing.";
                setShowMentalMenu(true);
                setShowFinancialMenu(false);
                break;

            case "Stress":
                reply =
                    "😔 It's okay to feel stressed sometimes.\n\nYou can:\n• Talk to your class teacher\n• Book a counsellor session\n• Try some breathing exercises.";
                setShowMentalActions(true);
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

            case "Talk to Teacher":
                try {
                    await axiosInstance.post("/help-requests", {
                        studentId: "STU-001",
                        studentName: "Demo Student",
                        message: "Student requested to talk to a teacher regarding mental health.",
                        type: "mental-health",
                    });

                    reply =
                        "📞 Your teacher has been informed and will contact you soon.";
                } catch (err) {
                    console.error(err.response?.data || err);
                    reply = "❌ Failed to notify teacher.";
                }
                setShowMentalActions(false);
                break;

            case "Book Counsellor":
                reply =
                    "👩‍⚕️ Counsellor booking feature will be available in the next version. Meanwhile, please contact your teacher.";

                setShowMentalActions(false);
                break;

            case "Self Help Tips":
                reply =
                    "🧘 Here are some tips to help you feel better:\n\n• Take deep breaths for 5 minutes\n• Drink enough water\n• Take short study breaks\n• Talk to someone you trust\n• Get enough sleep";
                setShowMentalActions(false);
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
                {showMentalMenu && (
                    <MentalHealthMenu onSelect={handleOptionClick} />
                )}
                {showMentalActions && (
                    <MentalHealthActions onSelect={handleOptionClick} />
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