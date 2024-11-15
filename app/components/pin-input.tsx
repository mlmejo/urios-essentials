import React, { useState, useEffect } from "react";

interface PinInputProps {
  length?: number;
  onComplete: (pin: string) => void;
  isVisible?: boolean; // This prop indicates if the PinInput is visible (e.g., modal is open)
}

const PinInput: React.FC<PinInputProps> = ({
  length = 4,
  onComplete,
  isVisible,
}) => {
  const [pin, setPin] = useState<string[]>(Array(length).fill(""));

  // Automatically focus the first input when the PinInput is visible
  useEffect(() => {
    if (isVisible) {
      document.getElementById(`pin-input-0`)?.focus();
    }
  }, [isVisible]);

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < length - 1) {
        document.getElementById(`pin-input-${index + 1}`)?.focus();
      }

      // Call onComplete when PIN is fully entered
      if (newPin.every((digit) => digit !== "")) {
        onComplete(newPin.join(""));
      }
    }
  };

  const handleBackspace = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      document.getElementById(`pin-input-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {pin.map((digit, index) => (
        <input
          key={index}
          id={`pin-input-${index}`}
          type="text"
          value={digit}
          maxLength={1}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleBackspace(index, e)}
          className="h-12 w-12 rounded-md border border-gray-300 text-center text-2xl text-gray-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  );
};

export default PinInput;
