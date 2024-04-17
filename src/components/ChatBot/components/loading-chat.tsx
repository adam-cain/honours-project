import LoadingDots from "@/components/icons/loading-dots";
import React from "react";

interface LoadingChatProps {
  color?: string;
}

// Define the component with default props
const LoadingChat: React.FC<LoadingChatProps> = ({ color = "#FFF" }) => {
  return (
    <div className="items-center w-full flex justify-center p-4">
      <LoadingDots color={color} />
    </div>
  );
};

export default LoadingChat;
