import React from "react";

type LoadingProps = {
  size?: number;
  className?: string;
  label?: string;
};

const Loading: React.FC<LoadingProps> = ({ size = 16, className = "", label = "Loading" }) => {
  const stroke = Math.max(2, Math.floor(size / 6));
  return (
    <span role="status" aria-live="polite" className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={stroke} opacity="0.15" />
        <path
          d="M22 12a10 10 0 00-10-10"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
};

export default Loading;

