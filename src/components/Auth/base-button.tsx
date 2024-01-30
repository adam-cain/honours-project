// components/BaseButton.tsx
import React from 'react';
import LoadingDots from '../icons/loading-dots';

interface BaseButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  loading: boolean;
  className?: string;
}

const BaseButton: React.FC<BaseButtonProps> = ({ children, onClick, loading, className }) => {
  const baseClasses = "my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border transition-colors duration-75 focus:outline-none";
  const loadingClasses = "cursor-not-allowed bg-stone-50 dark:bg-stone-800";
  const defaultClasses = "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black";

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${baseClasses} ${loading ? loadingClasses : defaultClasses} ${className}`}
    >
      {loading ? <LoadingDots color="#A8A29E" /> : children}
    </button>
  );
};

export default BaseButton;
