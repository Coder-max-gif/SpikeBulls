import React from "react";

export default function SpikeBullsLogo({ className = "" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <path
        d="M20 80 L40 60 L50 70 L70 40 L85 55"
        stroke="#4A7C59"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M35 75 Q45 65 55 70 Q65 75 75 60 Q85 45 80 35"
        stroke="#000"
        strokeWidth="3"
        fill="none"
      />
      <circle cx="25" cy="85" r="4" fill="#000" />
      <circle cx="85" cy="30" r="4" fill="#000" />
    </svg>
  );
}
