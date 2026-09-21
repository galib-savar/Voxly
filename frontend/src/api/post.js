import client from "./client";

export const getPost = async (page = 1, limit = 10) => {
  const response = await client.get("/post", {
    params: { page, limit },
  });

  return {
    posts: response.data.data || [],
    pagination: response.data.pagination,
  };
};

export const createPost = async (formData, token) => {
  const response = await client.post("/post", formData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

export const getPostByUserId = async (userId) => {
  const response = await client.get(`/post/${userId}`);
  return response.data.data;
};

export const likePost = async (id) => {
  const response = await client.post(`/post/${id}/like`);
  return response.data.data;
};

export const createComment = async (postId, content) => {
  const response = await client.post("/comments", {
    postId,
    content,
  });

  return response.data.data;
};

export const getCommentsByPost = async (postId) => {
  const response = await client.get(`/comments/${postId}`);
  return response.data.data || [];
};
