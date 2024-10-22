import React from "react";

interface ProgressBarProps {
  value: number;
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, color }) => {
  return (
    <div className="relative w-full h-2 bg-gray-300 rounded-full overflow-hidden">
      <div
        className="h-full"
        style={{
          width: `${value}%`,
          backgroundColor: color,
          transition: "width 0.3s ease-in-out",
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
