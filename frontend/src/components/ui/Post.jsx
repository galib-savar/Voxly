import { Link } from "react-router-dom";
import Image from "./Image.jsx";
import Button from "./Button";
import LikeIcon from "../../assets/icons/LikeIcon.jsx";
import CommentIcon from "../../assets/icons/CommentIcon.jsx";
import UserName from "./UserName.jsx";
import Video from "./Video.jsx";

const renderPostMedia = (src) => {
  const extension = src.split(/[?#]/)[0].split(".").pop()?.toLowerCase();
  const videoExtensions = ["mp4", "mov"];

  if (videoExtensions.includes(extension)) {
    return (
      <Video
        src={src}
        width={800}
        height={500}
        className="w-full h-auto rounded-radius"
      />
    );
  }

  return (
    <Image
      src={src}
      alt="Post content image"
      width={800}
      height={500}
      className="w-full h-auto rounded-radius"
    />
  );
};

const Post = ({
  userId,
  logoSrc,
  title,
  userName,
  userEmail,
  content,
  contentImgSrc,
  likeCount,
  commentCount,
  onLike,
  onComment,
}) => {
  const normalizedLikeCount = Array.isArray(likeCount)
    ? likeCount.length
    : Number(likeCount) || 0;
  return (
    <article className="Border m-margin-small rounded-radius p-padding-large space-y-gap-small">
      <section className="flex items-center gap-gap-small">
        {userId ? (
          <Link to={`/profile/${userId}`}>
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt={`${userName} avatar`}
                width={48}
                height={48}
                className="rounded-radius"
              />
            ) : (
              <span className="bg-foreground text-background rounded-radius text-2xl w-12 h-12 flex items-center justify-center">
                {userName?.charAt(0)}
              </span>
            )}
          </Link>
        ) : logoSrc ? (
          <Image
            src={logoSrc}
            alt={`${userName} avatar`}
            width={48}
            height={48}
            className="rounded-radius"
          />
        ) : (
          <span className="bg-foreground text-background rounded-radius text-2xl w-12 h-12 flex items-center justify-center">
            {userName?.charAt(0)}
          </span>
        )}
        <h3>
          {userId ? (
            <Link to={`/profile/${userId}`}>
              <UserName name={userName} email={userEmail} />
            </Link>
          ) : (
            <UserName name={userName} email={userEmail} />
          )}
        </h3>
      </section>
      <section>
        <h2>{title}</h2>
        <p>{content}</p>
        {contentImgSrc && renderPostMedia(contentImgSrc)}
      </section>
      <section className="flex gap-gap-small">
        <Button
          type="button"
          variant="ghost"
          icon={<LikeIcon />}
          count={normalizedLikeCount}
          onClick={(e) => {
            onLike(e);
          }}
        />
        <Button
          type="button"
          variant="ghost"
          icon={<CommentIcon />}
          count={commentCount}
          onClick={onComment}
        />
      </section>
    </article>
  );
};

export default Post;
