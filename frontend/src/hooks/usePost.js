import { useCallback, useEffect, useState } from "react";
import { getCache, saveCache } from "../utils/cache";

export const usePost = (
  cacheKey,
  apiFunction,
  cacheDuration = 5 * 60 * 1000,
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (ignoreCache = false, showLoading = true) => {
      try {
        if (showLoading) setLoading(true);

        if (!ignoreCache) {
          const cachedData = getCache(cacheKey);

          if (cachedData) {
            setData(cachedData);
            setLoading(false);
            return;
          }
        }

        const result = await apiFunction(1, 10);
        const posts = Array.isArray(result) ? result : result.posts;

        setData(posts || []);
        setPage(1);
        setHasMore((posts || []).length === 10);
        saveCache(cacheKey, posts || [], cacheDuration);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, cacheKey, cacheDuration],
  );

  useEffect(() => {
    Promise.resolve().then(fetchData);
  }, [fetchData]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const result = await apiFunction(nextPage, 10);
      const nextPosts = Array.isArray(result) ? result : result.posts;

      setData((currentPosts) => [...currentPosts, ...(nextPosts || [])]);
      setPage(nextPage);
      setHasMore((nextPosts || []).length === 10);
    } catch (loadMoreError) {
      setError(loadMoreError);
    } finally {
      setLoadingMore(false);
    }
  }, [apiFunction, hasMore, loading, loadingMore, page]);

  return {
    data,
    loading,
    error,
    loadingMore,
    hasMore,
    loadMore,
    refetch: () => fetchData(true, false),
  };
};
