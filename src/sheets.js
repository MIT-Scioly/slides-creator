export const createSheet = (token, title) => {
  const info = {
    method: "post",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // body: JSON.stringify({
    //   properties: {
    //     title: title,
    //   },
    // }),
  };
  console.log(info);
  return fetch("https://sheets.googleapis.com/v4/spreadsheets", info);
};
