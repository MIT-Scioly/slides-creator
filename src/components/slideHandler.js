import {v4 as uuidv4} from 'uuid';

export const createPresentation = (token, title) => {
  return fetch("https://slides.googleapis.com/v1/presentations", {
    method: "post",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: title,
    }),
  });
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

export const batchUpdateSlides = (token, presentationId, requests) => {
  return fetch(
    `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        requests: requests,
      }),
    }
  );
}

export const insertTextWithDataRequest = (id, body) => {
  return {
    insertText: {
      objectId: id,
      text: body,
    }
  };
}

export const deleteTextWithIdRequest = (id) => {
  return {
    deleteText: {
      objectId: id,
    }
  };
}

export const createNewSlideWithDataRequest = (title, body) => {
  // run this on every combination of title and body, and append it to the request of the other thing.
  const titleId = uuidv4();
  const bodyId = uuidv4();
  return [
    {
      createSlide: {
        slideLayoutReference: {
          predefinedLayout: "TITLE_AND_BODY",
        },
        placeholderIdMappings: [
          {
            layoutPlaceholder: {
              type: "TITLE",
            },
            objectId: titleId,
          },
          {
            layoutPlaceholder: {
              type: "BODY",
            },
            objectId: bodyId,
          },
        ]
      }
    },
    {
      insertText: {
        objectId: titleId,
        text: title,
      }
    },
    {
      insertText: {
        objectId: bodyId,
        text: body,
      }
    }
  ]
}

