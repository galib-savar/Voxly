import client from "./client";

export const getProfile = async (userId) => {
  try {
    const response = await client.get(`/profile/${userId}`);
    return response?.data?.profile;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const editProfile = async (formData) => {
  try {
    const response = await client.put("/profile/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response?.data?.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
