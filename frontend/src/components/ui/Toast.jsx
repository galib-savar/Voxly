import { useEffect, useState } from "react";

const Toast = ({
  variant = "info",
  children,
  autoClose = true,
  delay = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const style = {
    info: "text-info border-info",
    success: "text-success border-success",
    warning: "text-warning border-warning",
    danger: "text-danger border-danger",
  };

  const iconStyle = {
    info: "ℹ",
    success: "✓",
    warning: "⚠",
    danger: "✕",
  };

  useEffect(() => {
    if (!autoClose) return undefined;

    const timer = window.setTimeout(() => {
      setIsVisible(false);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [autoClose, delay]);

  return (
    <div
      className={`fixed right-5 top-5 z-50 flex items-center gap-gap-small min-w-105 min-h-12 p-padding-small Border rounded-radius bg-background ${
        isVisible ? "toastIn" : "toastOut"
      } ${style[variant]}`}
    >
      <div
        className={`flex items-center justify-center w-5 h-5 rounded-radius text-${variant}`}
      >
        {iconStyle[variant]}
      </div>
      <span>{children}</span>
    </div>
  );
};

export default Toast;
