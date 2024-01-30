// components/FormSubmitButton.tsx
import React from 'react';
import BaseButton from '@/components/Auth/base-button';

interface FormSubmitButtonProps {
  loading: boolean;
  text: string;
}

const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({ loading, text }) => {
  return (
    <BaseButton onClick={() => {}} loading={loading}>
      <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
        {text}
      </p>
    </BaseButton>
  );
};

export default FormSubmitButton;
