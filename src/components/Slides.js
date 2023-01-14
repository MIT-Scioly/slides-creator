import React, { useState } from "react";
import { LoginWithGoogle } from "./auth";
import {createPresentation, addSlide, addText, getSlideObjects, getPresentationObject} from './slideHandler';


export default function Slides() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [presentationId, setPresentationId] = useState(null);
  const [lastSlideId, setLastSlideId] = useState(null);

  const [titleId, setTitleId] = useState(null);
  const [bodyId, setBodyId] = useState(null);
  const login = async () => {
    const res = await LoginWithGoogle();
    setUser(res.user);
    setToken(res.token);
  };

  const createNewPresentation = async (fileName) => {
    if (presentationId !== null) {
      console.log("Already created");
      return;
    }
    const res = await createPresentation(token, fileName)
    const json = await res.json();
    setPresentationId(json.presentationId);
    console.log("slide created!", json);
  }

  const addNewSlide = async () => {
    if (token && presentationId) {
      const res = await addSlide(token, presentationId, 5);
      const json = await res.json();
      setLastSlideId(json.replies[0].createSlide.objectId);
      console.log("slide updated", json);
    }
  }

  const addNewText = async (objectId, text) => {
    if (token && presentationId && titleId) {
      let res = await addText(token, presentationId, objectId, text);
      let json = await res.json();
      console.log("text added", json);
    }
  }

  const getNewSlideObjects = async () => {
    if (token && presentationId) {
      const res = await getPresentationObject(token, presentationId);
      const json = await res.json();
      const last_slide = json.slides[json.slides.length - 1];
      setTitleId(last_slide.pageElements[0].objectId);
      setBodyId(last_slide.pageElements[1].objectId);
      console.log("slide objects", json);
    }
  }

  const getNewPresentationObject = async () => {
    if (token && presentationId) {
      const res = await getPresentationObject(token, presentationId);
      const json = await res.json();
      console.log("presentation object", json);
    }
  }

  if (user === null) {
    return (
      <div className="App">
        <h1>Google APIs Tutorial</h1>
        <button onClick={() => login()}>Sign in with Google</button>
      </div>
    );
  } else {
    return (
      <div>
        <h3>Logged In!</h3>
        <p>User: {user.email}</p>
        <p>Token: {token}</p>
        <p>Presentation Id: {presentationId}</p>
        <p>Last Slide Id: {lastSlideId}</p>
        <input onChange={(e) => setPresentationId(e.target.value)} placeholder="Presentation Id" />
        <button onClick={() => createNewPresentation("My Slide 1")}>Create Presentation</button>
        <button onClick={() => addNewSlide()}>Create Slide</button>
        <p></p>
        <button onClick={() => getNewPresentationObject()}>Get New presentation object</button>
        <button onClick={() => getNewSlideObjects()}>Get Slide Objects</button>
        <p>Header Id: {titleId}</p>
        <p>Body Id: {bodyId}</p>
        <button onClick={() => addNewText(titleId, "Hello World")}>Add Title</button>
        <button onClick={() => addNewText(bodyId, "body text")}>Add Body</button>
      </div>
    );
  }
}
