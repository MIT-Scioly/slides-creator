import {v4 as uuidv4} from 'uuid';

export const createPresentation = (token, title) => {
  return fetch("https://slides.googleapis.com/v1/presentations", {
    method: "POST",
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

export const createNewTitleOnlySlide = (slide_id, title) => { 
  // Creates a slide with only a title, currently the one being used
  const titleId = slide_id + "_title";
  return [
    {
      createSlide: {
        objectId: slide_id,
        slideLayoutReference: {
          predefinedLayout: "TITLE_ONLY",
        },
        placeholderIdMappings: [
          {
            layoutPlaceholder: {
              type: "TITLE",
            },
            objectId: titleId,
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
  ]
}

export const addAwardsTextBoxes = (slide_id, place, text) => {
  const textBoxId = slide_id + "_award_" + place
  return [
    {
      createShape: {
        objectId: textBoxId,
        shapeType: "TEXT_BOX",
        elementProperties: {
          pageObjectId: slide_id,
          size: {
            height: {magnitude: 50, unit: "PT"},
            width: {magnitude: 600, unit: "PT"}
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 50,
            translateY: place * 40 + 50,
            unit: "PT",
          }
        }
      }
    },
    {
      insertText: {
        objectId: textBoxId,
        text: text,
      }
    },
  ]
}

export const duplicateHeaderSlide = (
    originalSlideId, 
    copySlideId, 
    insertionIndex, 
    textBoxId,
    text
  ) => {
  const newTextBoxId = copySlideId + "_text";
  return [
    {
      duplicateObject: {
        objectId: originalSlideId,
        objectIds: {
          [originalSlideId]: copySlideId,
          [textBoxId]: newTextBoxId,
        },
      }
    },
    {
      updateSlidesPosition: {
        slideObjectIds: [copySlideId],
        insertionIndex: insertionIndex,
      }
    },
    {
      deleteText: {
        objectId: newTextBoxId,
      }
    },
    {
      insertText: {
        objectId: newTextBoxId,
        text: text,
      }
    },
  ]
}

export const duplicateAwardSlide = (originalSlideId, copySlideId, insertionIndex, texts) => {
  return [
    {
      duplicateObject: {
        objectId: originalSlideId,
        objectIds: {
          [originalSlideId]: copySlideId
        },
      }
    },
    {
      updateSlidesPosition: {
        slideObjectIds: [copySlideId],
        insertionIndex: insertionIndex,
      }
    },
  ]
}


