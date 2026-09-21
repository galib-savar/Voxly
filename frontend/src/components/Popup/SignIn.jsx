import { useState } from "react";
import { login } from "../../api/auth";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Toast from "../ui/Toast";

const SignIn = ({ onClose, onSuccess }) => {
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const user = await login(data);
      if (user && typeof onSuccess === "function") {
        onSuccess(user);
      }
      setToast({
        id: Date.now() + Math.random(),
        message: "Signed in successfully.",
        variant: "success",
      });
      window.setTimeout(() => onClose?.(), 500);
    } catch (error) {
      setToast({
        id: Date.now() + Math.random(),
        message:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
        variant: "warning",
      });
    }
  };

  return (
    <div className="flex flex-col gap-gap-large p-padding-large">
      <h2>Sign In</h2>
      <form className="flex flex-col gap-gap-small" onSubmit={handleSubmit}>
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
          placeholder="Password"
          required
        />
        <Button type="submit">Sign In</Button>
      </form>
      {toast && (
        <Toast key={toast.id} variant={toast.variant}>
          {toast.message}
        </Toast>
      )}
    </div>
  );
};

export default SignIn;
