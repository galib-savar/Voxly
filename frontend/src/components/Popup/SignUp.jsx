import { useState } from "react";
import { register } from "../../api/auth";
import Input from "../ui/Input";
import Toast from "../ui/Toast";
import Button from "../ui/Button";

const SignUp = ({ onClose, onSuccess }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, variant = "info") => {
    const cleanMessage = (message || "").includes(
      "User validation failed: password: ",
    )
      ? (message || "").split("User validation failed: password: ")[1]
      : message;

    setToast({
      id: Date.now() + Math.random(),
      message: cleanMessage,
      variant,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const user = await register(data);
      if (user && typeof onSuccess === "function") {
        onSuccess(user);
      }
      setToast({
        id: Date.now() + Math.random(),
        message: "Account created successfully.",
        variant: "success",
      });
      window.setTimeout(() => onClose?.(), 500);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

      if (error?.response?.data?.code === 422) {
        showToast(message, "warning");
      } else {
        showToast(message, "info");
      }
    }
  };

  return (
    <div className="flex flex-col gap-gap-large p-padding-large">
      <h2>Sign Up</h2>
      {toast && (
        <Toast key={toast.id} title="Sign up failed" variant={toast.variant}>
          {toast.message}
        </Toast>
      )}
      <form className="flex flex-col gap-gap-small" onSubmit={handleSubmit}>
        <Input
          type="text"
          label="Username"
          name="name"
          id="username"
          placeholder="Username"
          required
        />
        <Input
          type="email"
          label="Email"
          name="email"
          id="email"
          placeholder="Email"
          required
        />
        <Input
          type="password"
          label="Password"
          name="password"
          id="password"
          placeholder="Password"
          required
        />
        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
};

export default SignUp;
