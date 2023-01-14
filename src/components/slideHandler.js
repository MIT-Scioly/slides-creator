export const createPresentation = (token, title) => {
  const info = {
    method: "post",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: title,
    }),
  };
  return fetch("https://slides.googleapis.com/v1/presentations", info);
};

export const addSlide = (token, presentationId, value) => {
  return fetch(
    `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        requests: [
          {
            createSlide: {
              slideLayoutReference: {
                predefinedLayout: "TITLE_AND_BODY",
              }
            },
          },
        ],
      }),
    }
  );
};

export const getPresentationObject = (token, presentationId) => {
  return fetch(
    `https://slides.googleapis.com/v1/presentations/${presentationId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
export const addText = (token, presentationId, objectId, value) => {
  return fetch(
    `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              objectId: objectId,
              text: value,
            },
          },
        ],
      }),
    }
  );
}

