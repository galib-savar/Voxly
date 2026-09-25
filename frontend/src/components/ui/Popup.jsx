import { useEffect, useRef } from "react";
import CloseIcon from "../../assets/icons/CloseIcon";

const Popup = ({
  children,
  open = false,
  onClose,
  className = "",
  ...props
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  if (!open || !children) return null;

  return (
    <dialog
      ref={dialogRef}
      className={`bg-background rounded-radius relative overflow-y-auto m-auto w-full lg:max-w-1/2 Border ${className}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      {...props}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 cursor-pointer text-foreground"
        aria-label="Close popup"
      >
        <CloseIcon />
      </button>
      {children}
    </dialog>
  );
};

export default Popup;
