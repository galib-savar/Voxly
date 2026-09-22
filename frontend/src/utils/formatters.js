export const formatCount = (num) => {
  return num >= 1000000
    ? `${(num / 1000000).toFixed(1)}M`
    : num >= 1000
      ? `${(num / 1000).toFixed(1)}K`
      : num;
};

export const formatEmail = (email) => {
  if (!email) return "";

  const username = email.split("@")[0]?.split(".")[0];
  return username ? `@${username}` : "";
};

export const formatUrl = (url) => {
  if (!url) return "";

  const { hostname } = new URL(url);
  return hostname.replace("www.", "");
};
