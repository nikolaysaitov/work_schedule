import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = "primary", active = false, className = "", ...props }) => {
  return (
    <button className={`btn btn-${variant} ${active ? "btn-active" : ""} ${className}`} {...props}>
      {children}
    </button>
  );
};
