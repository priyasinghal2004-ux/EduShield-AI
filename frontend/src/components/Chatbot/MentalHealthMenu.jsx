export default function MentalHealthMenu({ onSelect }) {
  return (
    <div className="mt-3 space-y-2">
      <button
        onClick={() => onSelect("Stress")}
        className="w-full text-left p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 border"
      >
        😔 Stress
      </button>

      <button
        onClick={() => onSelect("Anxiety")}
        className="w-full text-left p-3 rounded-lg bg-orange-50 hover:bg-orange-100 border"
      >
        😟 Anxiety
      </button>

      <button
        onClick={() => onSelect("Depression")}
        className="w-full text-left p-3 rounded-lg bg-red-50 hover:bg-red-100 border"
      >
        😢 Depression
      </button>

      <button
        onClick={() => onSelect("Exam Pressure")}
        className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 border"
      >
        📚 Exam Pressure
      </button>
    </div>
  );
}