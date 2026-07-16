import axiosInstance from "../../api/axiosInstance";
import { useState } from "react";

export default function NeedHelpForm() {
  const [problem, setProblem] = useState("");

  const handleSubmit = async () => {
    if (!problem.trim()) return;
  
    try {
      await axiosInstance.post("/help-requests", {
        studentId: "STU-001",
        studentName: "Demo Student",
        message: problem,
        type: "general",
      });
  
      alert("Support request sent successfully!");
  
      setProblem("");
    } catch (err) {
      alert("Failed to send request.");
      console.error(err);
    }
  };

  return (
    <div className="mt-4 border rounded-xl p-3 bg-red-50">

      <h3 className="font-semibold text-red-700 mb-2">
        🆘 Need Help
      </h3>

      <textarea
        rows={4}
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        placeholder="Describe your problem..."
        className="w-full border rounded-lg p-2 text-sm"
      />

      <button
        onClick={handleSubmit}
        className="mt-3 w-full bg-red-600 text-white rounded-lg py-2 hover:bg-red-700"
      >
        Send Request
      </button>

    </div>
  );
}