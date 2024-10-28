import React from "react";

interface ToggleSwitchProps {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isEnabled, onToggle }) => {
  return (
    <div
      className={`relative inline-flex items-center cursor-pointer ${
        isEnabled ? "bg-green-500" : "bg-gray-300"
      } rounded-full w-14 h-8`}
      onClick={() => onToggle(!isEnabled)}
    >
      <span
        className={`absolute w-6 h-6 bg-white rounded-full shadow transition-all duration-200 ease-in-out ${
          isEnabled ? "left-7" : "left-1" 
        }`}
      />
    </div>
  );
};

export default ToggleSwitch;
