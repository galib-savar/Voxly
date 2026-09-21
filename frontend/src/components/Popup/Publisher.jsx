import { useState } from "react";
import { createPost } from "../../api/post";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import UploadIcon from "../../assets/icons/UploadIcon";
import Toast from "../ui/Toast";
import { getCookie } from "../../utils/getCookie";

const Publisher = ({ onClose }) => {
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const token = getCookie("token");

    try {
      await createPost(formData, token);
      setToast({
        id: Date.now() + Math.random(),
        message: "Post published successfully.",
        variant: "success",
      });
      window.setTimeout(() => onClose?.(), 500);
    } catch (error) {
      setToast({
        id: Date.now() + Math.random(),
        message:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
        variant: "info",
      });
    }
  };

  return (
    <div className="flex flex-col gap-gap-large p-padding-large">
      <h2>Create Post</h2>
      <form className="flex flex-col gap-gap-small" onSubmit={handleSubmit}>
        <Input
          type="text"
          label="Title"
          name="title"
          id="title"
          placeholder="Title"
          required
        />
        <Textarea
          className="w-full"
          label="Content"
          name="content"
          id="content"
          placeholder="What's on your mind?"
          maxLength={500}
          required
        />
        <Input
          type="file"
          label={<UploadIcon />}
          id="image"
          name="image"
          className="w-full flex items-center p-padding-large justify-center rounded-radius Border hover:bg-hover cursor-pointer"
        />
        <Button type="submit">Post</Button>
      </form>
      {toast && (
        <Toast key={toast.id} variant={toast.variant}>
          {toast.message}
        </Toast>
      )}
    </div>
  );
};

export default Publisher;
