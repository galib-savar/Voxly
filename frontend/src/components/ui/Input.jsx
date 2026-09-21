import { useEffect, useState } from "react";

const Input = ({
  type = "text",
  label,
  id,
  name,
  placeholder,
  className = "",
  ...props
}) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (type === "file") {
    const handleFileChange = (event) => {
      const file = event.target.files?.[0];

      if (file?.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }

      props.onChange?.(event);
    };

    return (
      <>
        {label ? (
          <label htmlFor={id} className={`text-foreground ${className}`}>
            {preview ? (
              <img
                src={preview}
                alt="Selected image preview"
                className="w-full h-full object-contain rounded-radius"
              />
            ) : (
              label
            )}
          </label>
        ) : null}
        <input
          type="file"
          id={id}
          name={name}
          hidden
          {...props}
          onChange={handleFileChange}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-gap-small text-foreground">
      {label ? <label htmlFor={id}>{label}</label> : null}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`h-10 w-80 p-padding-small Border rounded-radius Transition Focus ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
