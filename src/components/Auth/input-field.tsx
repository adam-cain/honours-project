// components/InputField.tsx
import React from 'react';

interface InputFieldProps {
  type: string;
  name: string;
  id: string;
  label: string;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ type, name, id, label, error, onChange }) => {
  return (
    <div className="my-2">
      <div className="relative">
        <input onChange={onChange}
          type={type}
          name={name}
          id={id}
          aria-describedby={`${id}_error_help`}
          className={`peer block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none dark:text-white focus:outline-none focus:ring-0 
            ${!error ? "" : "dark:border-red-400 border-red-600"}`}
          placeholder=""
        />
        <label htmlFor={id}
          className={`absolute text-sm bg-black duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-2
          hover:cursor-text peer-focus:hover:cursor-auto
            ${!error ? "" : "text-red-600 dark:text-red-400"}`}>{label}</label>
      </div>
      <p id={`${id}_error_help`} className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
    </div>
  );
};

export default InputField;
