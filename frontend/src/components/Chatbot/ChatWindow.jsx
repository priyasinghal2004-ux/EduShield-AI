import { useEffect, useRef, useState } from "react";
import { X, Send } from "lucide-react";
import QuickOptions from "./QuickOptions";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function ChatWindow({ onClose }) {
    const { currentUser } = useAuth();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    // --------------------------------------------------
    // Auto scroll
    // --------------------------------------------------

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);


    // --------------------------------------------------
    // Send support request to teacher
    // --------------------------------------------------

    const sendSupportRequest = async () => {
        try {
            setLoading(true);

            const studentId =
                currentUser?.studentId ||
                currentUser?.student_id ||
                currentUser?.id ||
                currentUser?._id ||
                "STU-001";

            const studentName =
                currentUser?.name ||
                currentUser?.studentName ||
                currentUser?.fullName ||
                "Student";

            await axiosInstance.post("/help-requests", {
                studentId,
                studentName,
                message:
                    "Student requested support regarding bullying and would like to speak with a teacher/counselor.",
                type: "mental-health",
            });

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "💙 Your support request has been sent to your teacher. They can follow up with you privately.\n\nYou did the right thing by reaching out.",
                },
            ]);

        } catch (error) {
            console.error(
                "Support request error:",
                error.response?.data || error
            );

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "I couldn't send the support request right now. Please try again in a moment.",
                },
            ]);

        } finally {
            setLoading(false);
        }
    };


    // --------------------------------------------------
    // Send chat message
    // --------------------------------------------------

    const sendMessage = async (message) => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage || loading) return;

        /*
         * Check whether the previous assistant message
         * was asking for confirmation to send a support request.
         */

        const lastAssistantMessage =
            [...messages]
                .reverse()
                .find((msg) => msg.role === "assistant");

        const isSupportConfirmation =
            lastAssistantMessage?.content
                ?.toLowerCase()
                ?.includes("send a support request");

        const userConfirmed =
            trimmedMessage.toLowerCase() === "yes" ||
            trimmedMessage.toLowerCase() === "yeah" ||
            trimmedMessage.toLowerCase() === "yep";

        /*
         * If student explicitly says YES after being asked
         * about the support request, send it to the teacher.
         */

        if (isSupportConfirmation && userConfirmed) {

            setMessages((prev) => [
                ...prev,
                {
                    role: "user",
                    content: trimmedMessage,
                },
            ]);

            setInput("");

            await sendSupportRequest();

            return;
        }


        // Normal chat message
        const userMessage = {
            role: "user",
            content: trimmedMessage,
        };

        const updatedMessages = [
            ...messages,
            userMessage,
        ];

        setMessages(updatedMessages);
        setInput("");
        setLoading(true);


        try {

            // Convert messages to backend history format
            const history = messages.map((msg) => ({
                role:
                    msg.role === "assistant"
                        ? "model"
                        : "user",

                parts: [
                    {
                        text: msg.content,
                    },
                ],
            }));


            const response = await axiosInstance.post(
                "/chat",
                {
                    message: trimmedMessage,
                    history,
                }
            );


            const assistantMessage = {
                role: "assistant",

                content:
                    response.data.reply ||
                    "I'm sorry, I couldn't generate a response right now.",
            };


            setMessages((prev) => [
                ...prev,
                assistantMessage,
            ]);

        } catch (error) {

            console.error(
                "Chat error:",
                error.response?.data || error
            );

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "I'm having trouble connecting right now. Please try again in a moment.",
                },
            ]);

        } finally {
            setLoading(false);
        }
    };


    // --------------------------------------------------
    // Quick options
    // --------------------------------------------------

    const handleOptionClick = (option) => {

        const prompts = {

            "Mental Health":
                "I'm having a difficult time emotionally and I'd like someone to talk to.",

            "Financial Assistance":
                "I'm facing financial difficulties with my education and I'd like to know what support may be available.",

            Scholarships:
                "I need help finding scholarships that I may be eligible for.",

            "NGO Support":
                "I'd like to know what kind of organizations or NGOs may be able to help students.",

            "Need Help":
                "I'm facing a problem and I'm not sure what kind of support I need.",
        };


        sendMessage(
            prompts[option] || option
        );
    };


    // --------------------------------------------------
    // Submit
    // --------------------------------------------------

    const handleSubmit = (e) => {
        e.preventDefault();

        sendMessage(input);
    };


    // --------------------------------------------------
    // UI
    // --------------------------------------------------

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


                <button
                    onClick={onClose}
                    className="hover:bg-blue-700 rounded-full p-1 transition"
                    aria-label="Close assistant"
                >
                    <X size={22} />
                </button>

            </div>


            {/* Chat Body */}

            <div className="p-4 h-96 overflow-y-auto">

                {/* Welcome */}

                {messages.length === 0 && (

                    <>

                        <div className="bg-gray-100 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">

                            <div className="text-base font-medium mb-2">
                                👋 Hi! I'm your EduShield Assistant.
                            </div>

                            <p>
                                You can tell me what's bothering you —
                                whether it's studies, stress, bullying,
                                finances, or something else.
                            </p>

                            <p className="mt-2 font-medium">
                                What's going on?
                            </p>

                        </div>


                        <QuickOptions
                            onSelect={handleOptionClick}
                        />

                    </>

                )}


                {/* Messages */}

                {messages.map((msg, index) => (

                    <div
                        key={index}
                        className={`mt-3 flex ${
                            msg.role === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >

                        <div
                            className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed whitespace-pre-line ${
                                msg.role === "user"
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-gray-100 text-gray-700 rounded-bl-none"
                            }`}
                        >
                            {msg.content}
                        </div>

                    </div>

                ))}


                {/* Loading */}

                {loading && (

                    <div className="mt-3 flex justify-start">

                        <div className="bg-gray-100 text-gray-500 p-3 rounded-xl text-sm">

                            <span className="animate-pulse">
                                EduShield is thinking...
                            </span>

                        </div>

                    </div>

                )}


                <div ref={messagesEndRef} />

            </div>


            {/* Input */}

            <form
                onSubmit={handleSubmit}
                className="border-t border-gray-200 p-3 flex gap-2"
            >

                <input
                    type="text"
                    value={input}
                    onChange={(e) =>
                        setInput(e.target.value)
                    }
                    placeholder="Tell me what's bothering you..."
                    disabled={loading}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />


                <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send message"
                >
                    <Send size={18} />
                </button>

            </form>

        </div>
    );
}