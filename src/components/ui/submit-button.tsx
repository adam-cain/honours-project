import React from 'react';
import LoadingDots from '../icons/loading-dots';

interface BaseButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  loading: boolean;
  className?: string;
}

const SubmitButton: React.FC<BaseButtonProps> = ({ children, onClick, loading, className }) => {
  const baseClasses = "my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border transition-colors duration-75 focus:outline-none";
  const loadingClasses = "cursor-not-allowed bg-highlight text-white";
  const defaultClasses = "active:bg-stone-100 bg-black hover:border-white";

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${baseClasses} ${loading ? loadingClasses : defaultClasses} ${className}`}
    >
      {loading ? <LoadingDots color="#FFF" /> : children}
    </button>
  );
};

export default SubmitButton;
