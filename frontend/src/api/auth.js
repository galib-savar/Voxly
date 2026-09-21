import client from "./client";

const resolveUser = (response) => {
  const payload = response?.data?.data ?? response?.data;
  if (!payload) return null;
  return payload.user ?? payload;
};

const saveUser = (user) => {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  return user;
};

export const register = async (data) => {
  const response = await client.post("/auth/register", data);

  if (response?.data?.token) {
    const token = response.data.token;
    document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
  }

  return saveUser(resolveUser(response));
};

export const login = async (data) => {
  const response = await client.post("/auth/login", data);

  if (response?.data?.token) {
    const token = response.data.token;
    document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
  }

  return saveUser(resolveUser(response));
};
