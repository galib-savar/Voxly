import { useCallback, useEffect, useState } from "react";
import { getProfile } from "../api/profile";
import { getPostByUserId } from "../api/post";

export const useProfile = (routeUserId) => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTargetUserId = useCallback(() => {
    const user = localStorage.getItem("user");
    const currentUserId = user ? JSON.parse(user)?._id : null;
    return routeUserId || currentUserId;
  }, [routeUserId]);

  const refreshPosts = useCallback(async () => {
    const targetUserId = getTargetUserId();

    if (!targetUserId) {
      setPosts([]);
      return;
    }

    try {
      const data = await getPostByUserId(targetUserId);
      setPosts(data || []);
    } catch (caughtError) {
      setError(caughtError);
    }
  }, [getTargetUserId]);

  const refetch = useCallback(async () => {
    const targetUserId = getTargetUserId();

    if (!targetUserId) {
      setProfile(null);
      setPosts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [profileData, postData] = await Promise.all([
        getProfile(targetUserId),
        getPostByUserId(targetUserId),
      ]);

      setProfile(profileData);
      setPosts(postData || []);
    } catch (caughtError) {
      setError(caughtError);
      setProfile(null);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [getTargetUserId]);

  useEffect(() => {
    let isMounted = true;

    const loadProfileData = async () => {
      const targetUserId = getTargetUserId();

      if (!targetUserId) {
        if (isMounted) {
          setProfile(null);
          setPosts([]);
          setLoading(false);
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
        setError(null);
      }

      try {
        const [profileData, postData] = await Promise.all([
          getProfile(targetUserId),
          getPostByUserId(targetUserId),
        ]);

        if (!isMounted) return;

        setProfile(profileData);
        setPosts(postData || []);
      } catch (caughtError) {
        if (!isMounted) return;

        setError(caughtError);
        setProfile(null);
        setPosts([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, [getTargetUserId]);

  return {
    profile,
    posts,
    loading,
    error,
    refreshPosts,
    refetch,
  };
};
