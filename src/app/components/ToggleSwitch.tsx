import React from "react";

interface ToggleSwitchProps {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isEnabled, onToggle }) => {
  return (
    <div
      className={`lg:mt-1 relative inline-flex items-center cursor-pointer ${
        isEnabled ? "bg-green-500" : "bg-gray-300"
      } rounded-full w-11 h-5`}
      onClick={() => onToggle(!isEnabled)}
    >
      <span
        className={`absolute w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ease-in-out ${
          isEnabled ? "left-6" : "left-1" 
        }`}
      />
    </div>
  );
};

export default ToggleSwitch;
