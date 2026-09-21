import { formatCount } from "../../utils/formatters";

const Button = ({
  children,
  variant = "default",
  type = "button",
  onClick,
  icon,
  count,
  ...props
}) => {
  const variantStyles = {
    default:
      "bg-foreground rounded-radius text-background px-padding-large py-padding-small cursor-pointer hover:scale-103 active:scale-95 Transition",
    ghost:
      "flex items-center justify-center gap-gap-small rounded-radius px-padding-large py-padding-small cursor-pointer hover:bg-hover Transition",
    danger:
      "bg-danger rounded-radius text-background px-padding-large py-padding-small cursor-pointer hover:scale-103 active:scale-95 Transition",
  };

  return (
    <button
      {...props}
      type={type}
      className={`${variantStyles[variant] || variantStyles.default}`.trim()}
      onClick={onClick}
    >
      {icon ? <span>{icon}</span> : null}

      {icon && Number(count) > 0 ? <span>{formatCount(count)}</span> : null}

      {variant !== "icon" ? children : null}
    </button>
  );
};

export default Button;
