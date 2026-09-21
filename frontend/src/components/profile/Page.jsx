import { useState } from "react";
import { useParams } from "react-router-dom";
import { likePost } from "../../api/post";
import Image from "../ui/Image";
import LinkIcon from "../../assets/icons/LinkIcon";
import GithubIcon from "../../assets/icons/GitHubIcon";
import LinkedInIcon from "../../assets/icons/LinkedinIcon";
import XIcon from "../../assets/icons/XIcon";
import MapIcon from "../../assets/icons/MapIcon";
import { formatEmail, formatUrl } from "../../utils/formatters";
import Post from "../ui/Post";
import Popup from "../ui/Popup";
import Comment from "../Popup/Comment";
import Banner from "../../assets/images/banner.jfif";
import { useProfile } from "../../hooks/useProfile";

const Page = () => {
  const { userId: routeUserId } = useParams();
  const { profile, posts, refreshPosts } = useProfile(routeUserId);
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  return (
    <section className="flex-1 flex flex-col">
      <div className="p-padding-small">
        {profile?.profileBannerPhoto ? (
          <Image
            src={profile?.profileBannerPhoto}
            alt="Banner"
            className="w-full h-52 object-cover rounded-radius"
          />
        ) : (
          <Image
            src={Banner}
            alt="Default Banner"
            className="w-full h-52 object-cover rounded-radius"
          />
        )}
        {profile?.profileLogo ? (
          <Image
            src={profile?.profileLogo}
            alt="Profile"
            width="128"
            height="128"
            className="rounded-radius object-cover mt-margin-small"
          />
        ) : (
          <span className="h-32 w-32 bg-foreground text-background rounded-radius text-5xl flex items-center justify-center mt-margin-small">
            {profile?.user?.name?.charAt(0)}
          </span>
        )}
        <div>
          <h1>{profile?.user?.name}</h1>
          <div className="text-paragraph">
            {formatEmail(profile?.user?.email)}
          </div>
          <div className="flex items-center justify-between mt-margin-small">
            <div className="flex gap-gap-large">
              {profile?.website && (
                <a
                  href={profile?.website}
                  target="_blank"
                  className="flex gap-gap-small"
                >
                  <LinkIcon />
                  {formatUrl(profile?.website)}
                </a>
              )}
              {profile?.location && (
                <span className="flex gap-gap-small">
                  <MapIcon />
                  {profile?.location}
                </span>
              )}
            </div>
            <div className="flex gap-gap-large">
              {profile?.github && (
                <a href={profile?.github} target="_blank">
                  <GithubIcon />
                </a>
              )}
              {profile?.linkedin && (
                <a href={profile?.linkedin} target="_blank">
                  <LinkedInIcon />
                </a>
              )}
              {profile?.twitter && (
                <a href={profile?.twitter} target="_blank">
                  <XIcon />
                </a>
              )}
            </div>
          </div>
        </div>
        {profile?.profileBio && (
          <p className="mt-margin-small">{profile?.profileBio}</p>
        )}
      </div>
      {posts.length > 0 ? (
        <section className="flex flex-col">
          {posts.map((post) => (
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
              commentCount={post.comments?.length || 0}
              onLike={async () => {
                try {
                  await likePost(post._id);
                  await refreshPosts();
                } catch (error) {
                  console.error(error);
                }
              }}
              onComment={() => setActiveCommentPost(post)}
            />
          ))}
        </section>
      ) : (
        <div>No posts yet.</div>
      )}
      {activeCommentPost && (
        <Popup
          open={!!activeCommentPost}
          onClose={() => setActiveCommentPost(null)}
        >
          <Comment
            postId={activeCommentPost._id}
            onClose={() => setActiveCommentPost(null)}
            onSuccess={refreshPosts}
          />
        </Popup>
      )}
    </section>
  );
};

export default Page;
