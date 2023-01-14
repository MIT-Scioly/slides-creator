const url = "https://www.googleapis.com/drive/v3/files";

export const getFiles = (token) => {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
