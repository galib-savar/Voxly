const Textarea = ({
  label,
  id,
  name,
  placeholder,
  maxLength,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-gap-small text-foreground">
      {label ? <label htmlFor={id}>{label}</label> : null}
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full h-40 p-padding-small field-sizing-content Border rounded-radius resize-none Transition Focus ${className}`}
        {...props}
      />
    </div>
  );
};

export default Textarea;
