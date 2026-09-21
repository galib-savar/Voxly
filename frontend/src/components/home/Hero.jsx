import { useEffect, useState } from "react";
import { getPost, likePost } from "../../api/post";
import { usePost } from "../../hooks/usePost";
import ThemeToggle from "../ui/ThemeToggle";
import Button from "../ui/Button";
import Popup from "../ui/Popup";
import Publisher from "../Popup/Publisher";
import Comment from "../Popup/Comment";
import Post from "../ui/Post";
import Loader from "../ui/Loader";
import Toast from "../ui/Toast";

const Hero = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [toast, setToast] = useState(null);
  const {
    data: posts,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    refetch,
  } = usePost("posts", getPost);

  useEffect(() => {
    const handleScroll = () => {
      const reachedBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

      if (reachedBottom) loadMore();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  return (
    <section className="flex-1 flex flex-col">
      <div className="p-padding-large flex items-center justify-between">
        <Button onClick={() => setShowPopup(true)}>+ Post</Button>
        <ThemeToggle />
      </div>
      <div>
        {loading ? (
          <>
            <Loader />
            <Loader />
            <Loader />
          </>
        ) : posts.length ? (
          posts.map((post) => (
            <Post
              key={post._id}
              id={post._id}
              userId={post.user?._id}
              logoSrc={post.user.profile.profileLogo}
              userName={post.user.name}
              userEmail={post.user.email}
              title={post.title}
              content={post.content}
              contentImgSrc={post.image}
              likeCount={post.likes}
              commentCount={post.comments.length}
              onLike={async () => {
                try {
                  await likePost(post._id);
                  await refetch();
                } catch (error) {
                  setToast({
                    id: Date.now() + Math.random(),
                    message:
                      error?.response?.data?.message ||
                      "Something went wrong. Please try again.",
                    variant: "info",
                  });
                }
              }}
              onComment={() => setActiveCommentPost(post)}
            />
          ))
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h2>No Post</h2>
            <p>Start by creating your first post!</p>
          </div>
        )}
        {loadingMore && <Loader />}
        {!loading && !loadingMore && !hasMore && posts.length > 0 && (
          <footer>
            <div className="text-paragraph text-center">
              &copy; {new Date().getFullYear()} Social Media. All rights
              reserved.
            </div>
          </footer>
        )}
      </div>
      {showPopup && (
        <Popup open={showPopup} onClose={() => setShowPopup(false)}>
          <Publisher
            onClose={async () => {
              setShowPopup(false);
              await refetch();
            }}
          />
        </Popup>
      )}

      {activeCommentPost && (
        <Popup
          open={!!activeCommentPost}
          onClose={() => setActiveCommentPost(null)}
        >
          <Comment
            postId={activeCommentPost._id}
            onClose={() => setActiveCommentPost(null)}
            onSuccess={async () => {
              await refetch();
            }}
          />
        </Popup>
      )}
      {toast && (
        <Toast key={toast.id} variant={toast.variant}>
          {toast.message}
        </Toast>
      )}
    </section>
  );
};

export default Hero;
