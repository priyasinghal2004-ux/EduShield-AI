export default function FinancialMenu({ onSelect }) {
  return (
    <div className="mt-3 space-y-2">
      <button onClick={() => onSelect("Scholarships")} className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 border">
        🎓 Scholarships
      </button>

      <button onClick={() => onSelect("NGO")} className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 border">
        🏢 NGO Support
      </button>

      <button onClick={() => onSelect("Fee")} className="w-full text-left p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 border">
        💵 Fee Assistance
      </button>

    </div>
  );
}