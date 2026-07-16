export default function MentalHealthActions({ onSelect }) {
  return (
    <div className="mt-3 space-y-2">

      <button
        onClick={() => onSelect("Talk to Teacher")}
        className="w-full p-3 rounded-lg bg-blue-50 hover:bg-blue-100 border text-left"
      >
        📞 Talk to Teacher
      </button>

      <button
        onClick={() => onSelect("Book Counsellor")}
        className="w-full p-3 rounded-lg bg-green-50 hover:bg-green-100 border text-left"
      >
        👩‍⚕️ Book Counsellor
      </button>

      <button
        onClick={() => onSelect("Self Help Tips")}
        className="w-full p-3 rounded-lg bg-purple-50 hover:bg-purple-100 border text-left"
      >
        🧘 Self Help Tips
      </button>

    </div>
  );
}