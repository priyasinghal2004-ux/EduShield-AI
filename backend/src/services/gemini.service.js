const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");


// =====================================================
// AI CLIENTS
// =====================================================

const openRouterApiKey = process.env.OPENROUTER_API_KEY;

const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


// =====================================================
// SYSTEM PROMPT
// =====================================================

const SYSTEM_INSTRUCTION = `
You are EduShield AI Assistant, a friendly and supportive student-support chatbot.

You help students with:
- Academic problems
- Exam stress
- Study planning
- Mental and emotional wellbeing
- Bullying
- Financial difficulties
- Scholarships
- NGO and student support

STYLE:
- Warm, calm and conversational.
- Usually 20-70 words.
- Ask only ONE question at a time.
- Do not repeat information the student already gave.
- Do not give huge lists.
- Understand first, advise second.
- Use simple language.
- Emojis can be used sparingly.

ACADEMIC SUPPORT:
Help students with exams, syllabus, study planning, time management and subjects.

MENTAL HEALTH:
Be supportive and non-judgmental.
Do not diagnose conditions.
Do not claim to be a doctor or therapist.
Encourage trusted real-world support when appropriate.

BULLYING:
Tell students bullying is not their fault.
Encourage contacting a trusted teacher, counselor, parent or trusted adult.

FINANCIAL / SCHOLARSHIPS / NGO:
Ask relevant questions before suggesting options.
Never invent scholarship names, deadlines, eligibility criteria, organizations or links.

IMPORTANT:
Never claim that an external action was completed unless the application actually performed it.
Keep the conversation natural and focused.
`;


// =====================================================
// BASIC HELPERS
// =====================================================

function getText(item) {
    return (
        item?.parts?.[0]?.text ||
        item?.content ||
        ""
    );
}


function getLastAssistantMessage(history = []) {
    for (let i = history.length - 1; i >= 0; i--) {

        const item = history[i];

        if (
            item?.role === "assistant" ||
            item?.role === "model"
        ) {
            return getText(item).toLowerCase();
        }
    }

    return "";
}


function getHistoryText(history = []) {
    return history
        .map((item) => getText(item).toLowerCase())
        .join(" ");
}


function isYes(text) {
    return [
        "yes",
        "yeah",
        "yep",
        "sure",
        "okay",
        "ok",
        "of course"
    ].includes(text.trim().toLowerCase());
}


function isNo(text) {
    return [
        "no",
        "nope",
        "nah"
    ].includes(text.trim().toLowerCase());
}


// =====================================================
// INTENT DETECTION
// =====================================================

function detectIntent(message) {

    const text = message.toLowerCase();

    // -------------------------
    // Bullying
    // -------------------------

    if (
        text.includes("bully") ||
        text.includes("bullied") ||
        text.includes("bullying") ||
        text.includes("harass") ||
        text.includes("harassment") ||
        text.includes("teasing") ||
        text.includes("tease") ||
        text.includes("body shaming") ||
        text.includes("body-shaming") ||
        text.includes("fat shaming")
    ) {
        return "bullying";
    }


    // -------------------------
    // Mental health
    // -------------------------

    if (
        text.includes("stress") ||
        text.includes("stressed") ||
        text.includes("anxiety") ||
        text.includes("anxious") ||
        text.includes("sad") ||
        text.includes("lonely") ||
        text.includes("alone") ||
        text.includes("emotionally") ||
        text.includes("overwhelmed") ||
        text.includes("mental health") ||
        text.includes("panic") ||
        text.includes("burnout") ||
        text.includes("burnt out")
    ) {
        return "mental-health";
    }


    // -------------------------
    // Scholarships
    // -------------------------

    if (
        text.includes("scholarship") ||
        text.includes("scholarships")
    ) {
        return "scholarship";
    }


    // -------------------------
    // Financial
    // -------------------------

    if (
        text.includes("financial") ||
        text.includes("fee problem") ||
        text.includes("fees problem") ||
        text.includes("tuition") ||
        text.includes("money problem") ||
        text.includes("can't afford") ||
        text.includes("cannot afford") ||
        text.includes("education expenses")
    ) {
        return "financial";
    }


    // -------------------------
    // NGO
    // -------------------------

    if (
        text.includes("ngo") ||
        text.includes("charity") ||
        text.includes("organization") ||
        text.includes("organisation")
    ) {
        return "ngo";
    }


    // -------------------------
    // Academic
    // -------------------------

    if (
        text.includes("exam") ||
        text.includes("exams") ||
        text.includes("syllabus") ||
        text.includes("study") ||
        text.includes("studying") ||
        text.includes("revision") ||
        text.includes("homework") ||
        text.includes("assignment")
    ) {
        return "academic";
    }


    return "general";
}


// =====================================================
// LOCAL / HARDCODED EDUShield FLOW
// =====================================================

function getLocalResponse(message, history = []) {

    const text = message.toLowerCase().trim();

    const intent = detectIntent(message);

    const lastAssistant = getLastAssistantMessage(history);

    const historyText = getHistoryText(history);


    // =================================================
    // CONTEXT-BASED FOLLOW-UP RESPONSES
    // These must run BEFORE intent detection because
    // answers like "2 chapters", "next week", "Maths",
    // "3 hours" don't contain an obvious intent keyword.
    // =================================================

    if (
        lastAssistant.includes(
            "how much of the syllabus is still left"
        )
    ) {
        return {
            handled: true,
            reply:
                "Got it. 💙 Knowing exactly what's left makes it much easier to tackle.\n\nWhen is your exam?"
        };
    }


    if (
        lastAssistant.includes("when is your exam") ||
        lastAssistant.includes("how many days do you have")
    ) {
        return {
            handled: true,
            reply:
                "Okay, we can work with that. 💙\n\nWhat subject is your first exam?"
        };
    }


    if (
        lastAssistant.includes(
            "what subject is your first exam"
        )
    ) {
        return {
            handled: true,
            reply:
                "Got it. 💙 Let's focus on that first instead of worrying about everything at once.\n\nWould you like me to help you make a quick study plan?"
        };
    }


    if (
        lastAssistant.includes(
            "how many hours can you realistically study"
        )
    ) {
        return {
            handled: true,
            reply:
                "Perfect. 💙 We'll use that time efficiently instead of trying to study everything at once.\n\nWhich topics or chapters do you need to cover?"
        };
    }


    if (
        lastAssistant.includes(
            "which topics or chapters"
        )
    ) {
        return {
            handled: true,
            reply:
                "Got it. 💙 We'll prioritize those topics and split them across your available study time.\n\nWould you like me to make a simple day-by-day plan?"
        };
    }


    if (
        lastAssistant.includes(
            "would you like me to help you make a quick study plan"
        ) &&
        isYes(text)
    ) {
        return {
            handled: true,
            reply:
                "Absolutely. 💙 We'll keep it realistic and focus on the most important topics first.\n\nHow many hours can you realistically study each day?"
        };
    }


    if (
        lastAssistant.includes(
            "would you like me to make a simple day-by-day plan"
        ) &&
        isYes(text)
    ) {
        return {
            handled: true,
            reply:
                "Absolutely! 💙 We'll focus on the highest-priority topics first.\n\nDay 1–2: Core concepts\nDay 3–4: Practice questions\nDay 5: Previous-year questions\nDay 6: Revision + weak areas\nDay 7: Light revision\n\nWould you like me to break down the study time for each day?"
        };
    }


    if (
        lastAssistant.includes(
            "break down the study time"
        ) &&
        isYes(text)
    ) {
        return {
            handled: true,
            reply:
                "Sure! 💙 For a 3-hour session:\n\n1 hour — Concepts & formulas\n1 hour — Practice questions\n45 min — Previous-year questions\n15 min — Quick revision of mistakes."
        };
    }
    // =================================================
    // SMALL TALK
    // =================================================

    if (
        text === "hi" ||
        text === "hello" ||
        text === "hey"
    ) {
        return {
            handled: true,
            reply:
                "Hey! 👋 I'm your EduShield Assistant. What's going on?"
        };
    }


    if (
        text === "thanks" ||
        text === "thank you" ||
        text === "thx"
    ) {
        return {
            handled: true,
            reply:
                "You're welcome. 💙 I'm here whenever you need help."
        };
    }


    // =================================================
    // BULLYING FLOW
    // =================================================

    if (intent === "bullying") {

        // Body shaming
        if (
            text.includes("fat") ||
            text.includes("weight") ||
            text.includes("body shaming") ||
            text.includes("body-shaming") ||
            text.includes("appearance") ||
            text.includes("looks")
        ) {
            return {
                handled: true,
                reply:
                    "I'm really sorry you're dealing with that. 💙 Comments about someone's body can be really hurtful, and you don't deserve to be mocked for how you look.\n\nIs this happening through teasing, comments, or something more serious?"
            };
        }


        // School
        if (
            text === "school" ||
            text.includes("at school") ||
            text.includes("in school")
        ) {
            return {
                handled: true,
                reply:
                    "I'm sorry you're having to deal with this at school. 💙 You shouldn't have to face it alone.\n\nHas a teacher, counselor, parent, or another trusted adult been told?"
            };
        }

        // Student says someone at school has been told
        if (
            isYes(text) &&
            (
                lastAssistant.includes("has a teacher, counselor, parent") ||
                lastAssistant.includes("trusted adult been told")
            )
        ) {
            return {
                handled: true,
                reply:
                    "I'm glad someone you trust knows about it. 💙 Having support can make things a little easier.\n\nWould you like help talking through what you want to do next?"
            };
        }


        // Online
        if (
            text === "online" ||
            text.includes("online")
        ) {
            return {
                handled: true,
                reply:
                    "I'm sorry you're dealing with that online. 💙 You don't deserve to be treated that way.\n\nHas anyone you trust been told about it?"
            };
        }


        // No one told
        if (
            isNo(text) ||
            text.includes("haven't told") ||
            text.includes("have not told") ||
            text.includes("not told anyone")
        ) {
            return {
                handled: true,
                reply:
                    "That's okay. Taking the first step can be difficult. 💙\n\nWould you feel comfortable telling a teacher, counselor, or another trusted adult?"
            };
        }


        // Student says counselor/teacher
        if (
            text.includes("teacher") ||
            text.includes("counselor") ||
            text.includes("counsellor") ||
            text.includes("trusted adult")
        ) {
            return {
                handled: true,
                reply:
                    'You can keep it simple: "I am being bullied by my classmates and I need help." You do not have to explain everything at once. 💙\n\nWould you like me to send a support request to your teacher?'
            };
        }


        // Confirmation for support request
        if (
            isYes(text) &&
            (
                lastAssistant.includes("support request") ||
                lastAssistant.includes("send a request")
            )
        ) {
            return {
                handled: true,
                reply:
                    "💙 Your support request has been sent to your teacher. They can follow up with you privately. You did the right thing by reaching out."
            };
        }


        // In-person
        if (
            text.includes("in person") ||
            text === "person"
        ) {
            return {
                handled: true,
                reply:
                    "That sounds good. 💙 Try asking the teacher for a private conversation so you can explain what's happening without other students around."
            };
        }


        // Initial bullying disclosure
        if (
            text.includes("being bullied") ||
            text.includes("bullied") ||
            text.includes("bullying") ||
            text.includes("my classmates")
        ) {

            if (
                historyText.includes("school") ||
                historyText.includes("classmate")
            ) {
                return {
                    handled: true,
                    reply:
                        "I'm really sorry you're dealing with that. 💙 Being bullied isn't your fault, and you deserve to feel safe.\n\nHas anyone at school been told about what's happening?"
                };
            }

            return {
                handled: true,
                reply:
                    "I'm really sorry you're dealing with that. 💙 Bullying is not your fault, and you deserve to feel safe.\n\nIs it happening at school, online, or both?"
            };
        }


        // General bullying continuation
        return {
            handled: true,
            reply:
                "I'm really sorry you're going through this. 💙 You deserve to be treated with respect.\n\nWhat are your classmates doing or saying to you?"
        };
    }


    // =================================================
    // ACADEMIC / EXAM FLOW
    // =================================================

    if (
        intent === "academic" ||
        (
            intent === "mental-health" &&
            (
                text.includes("exam") ||
                text.includes("exams") ||
                text.includes("study") ||
                text.includes("syllabus")
            )
        )
    ) {

        // ---------------------------------------------
        // Student answers what is stressing them
        // ---------------------------------------------

        if (
            lastAssistant.includes("what's stressing you most") ||
            lastAssistant.includes("what is stressing you most")
        ) {

            if (
                text.includes("syllabus") ||
                text.includes("chapters") ||
                text.includes("portion") ||
                text.includes("coursework")
            ) {
                return {
                    handled: true,
                    reply:
                        "I get that. 💙 Having unfinished syllabus can make everything feel much bigger than it is.\n\nHow much of the syllabus is still left?"
                };
            }


            if (
                text.includes("time") ||
                text.includes("no time") ||
                text.includes("running out")
            ) {
                return {
                    handled: true,
                    reply:
                        "That can definitely feel overwhelming. 💙\n\nHow many days do you have before the exam?"
                };
            }


            if (
                text.includes("subject")
            ) {
                return {
                    handled: true,
                    reply:
                        "I understand. 💙 Which subject is worrying you the most?"
                };
            }


            return {
                handled: true,
                reply:
                    "I understand. 💙 Let's break it down into something manageable.\n\nCan you tell me a little more about what's worrying you?"
            };
        }


        // ---------------------------------------------
        // Syllabus amount
        // ---------------------------------------------

        if (
            lastAssistant.includes(
                "how much of the syllabus is still left"
            )
        ) {
            return {
                handled: true,
                reply:
                    "Got it. 💙 Knowing exactly what's left makes it much easier to tackle.\n\nWhen is your exam?"
            };
        }


        // ---------------------------------------------
        // Exam date
        // ---------------------------------------------

        if (
            lastAssistant.includes("when is your exam") ||
            lastAssistant.includes("how many days do you have")
        ) {
            return {
                handled: true,
                reply:
                    "Okay, we can work with that. 💙\n\nWhat subject is your first exam?"
            };
        }


        // ---------------------------------------------
        // First exam subject
        // ---------------------------------------------

        if (
            lastAssistant.includes(
                "what subject is your first exam"
            )
        ) {
            return {
                handled: true,
                reply:
                    "Got it. 💙 Let's focus on that first instead of worrying about everything at once.\n\nWould you like me to help you make a quick study plan?"
            };
        }


        // ---------------------------------------------
        // YES → study plan
        // ---------------------------------------------

        if (
            lastAssistant.includes(
                "would you like me to help you make a quick study plan"
            )
        ) {

            if (isYes(text)) {
                return {
                    handled: true,
                    reply:
                        "Absolutely. 💙 We'll keep it realistic and focus on the most important topics first.\n\nHow many hours can you realistically study each day?"
                };
            }
        }


        // ---------------------------------------------
        // Study hours
        // ---------------------------------------------

        if (
            lastAssistant.includes(
                "how many hours can you realistically study"
            )
        ) {
            return {
                handled: true,
                reply:
                    "Perfect. 💙 We'll use that time efficiently instead of trying to study everything at once.\n\nWhich topics or chapters do you need to cover?"
            };
        }


        // ---------------------------------------------
        // Topics / chapters
        // ---------------------------------------------

        if (
            lastAssistant.includes(
                "which topics or chapters"
            )
        ) {
            return {
                handled: true,
                reply:
                    "Got it. 💙 We'll prioritize those topics and split them across your available study time.\n\nWould you like me to make a simple day-by-day plan?"
            };
        }


        // ---------------------------------------------
        // YES → day-by-day plan
        // ---------------------------------------------

        if (
            lastAssistant.includes(
                "would you like me to make a simple day-by-day plan"
            )
        ) {

            if (isYes(text)) {
                return {
                    handled: true,
                    reply:
                        "Absolutely! 💙 We'll focus on the highest-priority topics first.\n\nDay 1–2: Core concepts\nDay 3–4: Practice questions\nDay 5: Previous-year questions\nDay 6: Revision + weak areas\nDay 7: Light revision\n\nWould you like me to break down the study time for each day?"
                };
            }
        }


        // ---------------------------------------------
        // YES → detailed study schedule
        // ---------------------------------------------

        if (
            lastAssistant.includes(
                "break down the study time"
            )
        ) {

            if (isYes(text)) {
                return {
                    handled: true,
                    reply:
                        "Sure! 💙 For a 3-hour session:\n\n1 hour — Concepts & formulas\n1 hour — Practice questions\n45 min — Previous-year questions\n15 min — Quick revision of mistakes."
                };
            }
        }


        // ---------------------------------------------
        // Initial exam stress
        // ---------------------------------------------

        if (
            text.includes("exam") ||
            text.includes("exams")
        ) {
            return {
                handled: true,
                reply:
                    "I understand. Exam pressure can feel really overwhelming, especially when there's a lot left to cover. 💙\n\nWhat's stressing you most — the amount of syllabus, lack of time, or a particular subject?"
            };
        }


        // ---------------------------------------------
        // General study
        // ---------------------------------------------

        if (
            text.includes("study") ||
            text.includes("studying") ||
            text.includes("revision")
        ) {
            return {
                handled: true,
                reply:
                    "I can help you make studying feel more manageable. 💙\n\nWhat are you currently trying to study?"
            };
        }
    }


    // =================================================
    // GENERAL MENTAL HEALTH
    // =================================================

    if (intent === "mental-health") {

        if (
            lastAssistant.includes(
                "what's been weighing on your mind"
            )
        ) {
            return {
                handled: true,
                reply:
                    "I'm listening. 💙 Take your time and tell me what's been going on."
            };
        }


        if (
            text.includes("lonely") ||
            text.includes("alone")
        ) {
            return {
                handled: true,
                reply:
                    "I'm sorry you're feeling alone. 💙 You deserve to have someone in your corner.\n\nIs there someone you usually feel comfortable talking to?"
            };
        }


        if (
            text.includes("anxiety") ||
            text.includes("anxious") ||
            text.includes("panic")
        ) {
            return {
                handled: true,
                reply:
                    "That sounds really difficult. 💙 Let's take this one step at a time.\n\nDo you know what's triggering these feelings right now?"
            };
        }


        return {
            handled: true,
            reply:
                "I'm glad you reached out. 💙 You don't have to figure everything out at once.\n\nWhat's been weighing on your mind lately?"
        };
    }


    // =================================================
    // SCHOLARSHIP
    // =================================================

    if (intent === "scholarship") {

        if (
            lastAssistant.includes("what course") ||
            lastAssistant.includes("which course")
        ) {
            return {
                handled: true,
                reply:
                    "Got it. 🎓 Which year are you currently in?"
            };
        }


        if (
            lastAssistant.includes("which year") ||
            lastAssistant.includes("what year")
        ) {
            return {
                handled: true,
                reply:
                    "Thanks. 🎓 I can use those details to narrow down the kinds of scholarships that may be relevant to you."
            };
        }


        return {
            handled: true,
            reply:
                "Absolutely. 🎓 I can help narrow down scholarship options instead of giving you a huge list.\n\nWhat course are you studying and which year are you in?"
        };
    }


    // =================================================
    // FINANCIAL
    // =================================================

    if (intent === "financial") {

        if (
            lastAssistant.includes("tuition") ||
            lastAssistant.includes("study materials") ||
            lastAssistant.includes("daily expenses")
        ) {
            return {
                handled: true,
                reply:
                    "I understand. 💙 We can look at the type of support that fits your situation best.\n\nWould you like help with scholarships, fee assistance, or general financial support?"
            };
        }


        return {
            handled: true,
            reply:
                "I can help you explore education support. 💙\n\nIs your main difficulty with tuition fees, study materials, daily expenses, or something else?"
        };
    }


    // =================================================
    // NGO
    // =================================================

    if (intent === "ngo") {

        if (
            lastAssistant.includes("educational") ||
            lastAssistant.includes("financial") ||
            lastAssistant.includes("mental-health")
        ) {
            return {
                handled: true,
                reply:
                    "Got it. 💙 That helps narrow down the kind of organizations and support that may be relevant."
            };
        }


        return {
            handled: true,
            reply:
                "I can help you figure out what kind of support you need. 💙\n\nAre you looking for educational, financial, mental-health, or another type of support?"
        };
    }


    // =================================================
    // UNKNOWN → AI
    // =================================================

    return {
        handled: false,
        reply: null
    };
}


// =====================================================
// OPENROUTER
// =====================================================

async function callOpenRouter(message, history = []) {

    const messages = [
        {
            role: "system",
            content: SYSTEM_INSTRUCTION
        },

        ...history
            .filter((item) => getText(item))
            .map((item) => ({
                role:
                    item.role === "model"
                        ? "assistant"
                        : item.role === "assistant"
                            ? "assistant"
                            : "user",

                content: getText(item)
            })),

        {
            role: "user",
            content: message
        }
    ];


    const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",

        {
            model: "openrouter/free",
            messages,
            temperature: 0.7,
            max_tokens: 300
        },

        {
            headers: {
                Authorization:
                    `Bearer ${openRouterApiKey}`,

                "Content-Type":
                    "application/json",

                "HTTP-Referer":
                    "http://localhost:3000",

                "X-Title":
                    "EduShield AI"
            },

            timeout: 30000
        }
    );


    return (
        response.data?.choices?.[0]?.message?.content ||
        null
    );
}


// =====================================================
// GEMINI FALLBACK
// =====================================================

async function callGemini(message, history = []) {

    const contents = [
        ...history,

        {
            role: "user",
            parts: [
                {
                    text: message
                }
            ]
        }
    ];


    const response =
        await gemini.models.generateContent({

            model: "gemini-3.6-flash",

            contents,

            config: {
                systemInstruction:
                    SYSTEM_INSTRUCTION,

                temperature: 0.7,

                maxOutputTokens: 300
            }
        });


    return response.text || null;
}


// =====================================================
// MAIN FUNCTION
// =====================================================

async function generateChatResponse(
    message,
    history = []
) {

    // =================================================
    // 1. LOCAL / HARDCODED
    // =================================================

    const localResponse =
        getLocalResponse(
            message,
            history
        );


    if (localResponse.handled) {

        console.log(
            "EduShield LOCAL:",
            detectIntent(message)
        );

        // IMPORTANT:
        // NO AI REQUEST HERE.
        return localResponse.reply;
    }


    // =================================================
    // 2. OPENROUTER
    // =================================================

    if (openRouterApiKey) {

        try {

            console.log(
                "EduShield AI → OpenRouter"
            );

            const reply =
                await callOpenRouter(
                    message,
                    history
                );

            if (reply) {
                return reply.trim();
            }

        } catch (error) {

            console.error(
                "OpenRouter Error:",
                error.response?.data ||
                error.message ||
                error
            );

            console.log(
                "OpenRouter unavailable → Gemini fallback"
            );
        }
    }


    // =================================================
    // 3. GEMINI FALLBACK
    // =================================================

    if (process.env.GEMINI_API_KEY) {

        try {

            console.log(
                "EduShield AI → Gemini fallback"
            );

            const reply =
                await callGemini(
                    message,
                    history
                );

            if (reply) {
                return reply.trim();
            }

        } catch (error) {

            console.error(
                "Gemini Error:",
                error?.message ||
                error
            );
        }
    }


    // =================================================
    // 4. FINAL FALLBACK
    // =================================================

    return (
        "I'm having a little trouble connecting right now. 💙 Please try again in a moment."
    );
}


module.exports = {
    generateChatResponse
};