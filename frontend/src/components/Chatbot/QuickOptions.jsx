import {
    HeartHandshake,
    Wallet,
    GraduationCap,
    Building2,
    LifeBuoy,
  } from "lucide-react";
  
  const options = [
    {
      icon: <HeartHandshake size={20} />,
      title: "Mental Health",
    },
    {
      icon: <Wallet size={20} />,
      title: "Financial Assistance",
    },
    {
      icon: <GraduationCap size={20} />,
      title: "Scholarships",
    },
    {
      icon: <Building2 size={20} />,
      title: "NGO Support",
    },
    {
      icon: <LifeBuoy size={20} />,
      title: "Need Help",
    },
  ];
  
  export default function QuickOptions({ onSelect }) {
    return (
      <div className="grid grid-cols-1 gap-3 mt-5">
        {options.map((item) => (
          <button
            key={item.title}
            onClick={() => onSelect(item.title)}
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-500 transition"
          >
            <div className="text-blue-600">{item.icon}</div>
  
            <span className="font-medium text-gray-700">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    );
  }