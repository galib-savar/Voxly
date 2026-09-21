import { useEffect, useState } from "react";
import Input from "../ui/Input";
import { createComment, getCommentsByPost } from "../../api/post";
import UserIcon from "../../assets/icons/UserIcon.jsx";
import Button from "../ui/Button.jsx";
import Loader from "../ui/Loader.jsx";
import UserName from "../ui/UserName.jsx";
import Toast from "../ui/Toast";

const Comment = ({ postId, onSuccess }) => {
  const [value, setValue] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchComments = async () => {
    if (!postId) return;

    try {
      setLoadingComments(true);
      const data = await getCommentsByPost(postId);
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      setComments([]);
      throw new error();
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (!postId) return;

    let cancelled = false;

    const loadComments = async () => {
      try {
        const data = await getCommentsByPost(postId);
        if (!cancelled) {
          setComments(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (!cancelled) {
          setComments([]);
          throw new error();
        }
      } finally {
        if (!cancelled) {
          setLoadingComments(false);
        }
      }
    };

    loadComments();

    return () => {
      cancelled = true;
    };
  }, [postId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmed = value.trim();
    if (!trimmed || !postId) return;

    try {
      setLoading(true);
      await createComment(postId, trimmed);
      setValue("");
      await fetchComments();
      setToast({
        id: Date.now() + Math.random(),
        message: "Comment posted successfully.",
        variant: "success",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create comment:", error);
      setToast({
        id: Date.now() + Math.random(),
        message:
          error?.response?.data?.message ||
          "Something went wrong while posting your comment.",
        variant: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-gap-large">
      <div className="flex flex-col gap-gap-small max-h-1/2 overflow-y-auto p-padding-small">
        <h2>Comments</h2>
        {loadingComments ? (
          <Loader />
        ) : comments.length ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="Border rounded-radius p-padding-small space-y-gap-small"
            >
              <div className="flex items-center gap-gap-small">
                {comment.user?.profile?.profileLogo ? (
                  <img
                    src={comment.user?.profile?.profileLogo}
                    alt={comment.user?.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover rounded-radius"
                  />
                ) : (
                  <UserIcon />
                )}
                <strong>
                  <UserName
                    name={comment.user?.name}
                    email={comment.user?.email}
                  />
                </strong>
              </div>
              <p>{comment.content}</p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
      <form
        className="p-padding-small flex items-center gap-gap-small"
        onSubmit={handleSubmit}
      >
        <Input
          name="content"
          placeholder="Write a comment..."
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <Button type="submit" disabled={loading || !value.trim()}>
          {loading ? "Posting..." : "Comment"}
        </Button>
      </form>
      {toast && (
        <Toast key={toast.id} variant={toast.variant}>
          {toast.message}
        </Toast>
      )}
    </div>
  );
};

export default Comment;
