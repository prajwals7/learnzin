import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const AuthInput = ({ label, ...props }: AuthInputProps) => {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-text-secondary">{label}</label>
      <input
        {...props}
        className="block w-full rounded-lg border border-gray-200 bg-white/50 p-2.5 text-text-dark outline-none transition-all focus:border-primary-purple focus:ring-1 focus:ring-primary-purple"
      />
    </div>
  );
};

export default AuthInput;
