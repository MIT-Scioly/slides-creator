export const createSlide = (token, title) => {
  const info = {
    method: "post",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: title,
    }),
  };
  console.log(info);
  return fetch("https://slides.googleapis.com/v1/presentations", info);
};

export const updateSheetValue = (token, sheetId, value) => {
    return fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requests: [
            {
              repeatCell: {
                range: {
                  startColumnIndex: 0,
                  endColumnIndex: 1,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  sheetId: 0,
                },
                cell: {
                  userEnteredValue: {
                    numberValue: value,
                  },
                },
                fields: "*",
              },
            },
          ],
        }),
      }
    );
  };
  