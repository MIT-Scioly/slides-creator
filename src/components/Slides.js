import React, {useState} from "react";
import {LoginWithGoogle} from "./auth";
import {createPresentation, addSlide, addText, getPresentationObject} from './slideHandler';


export default function Slides({csvData}) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [presentationId, setPresentationId] = useState("");
  const login = async () => {
    const res = await LoginWithGoogle();
    setUser(res.user);
    setToken(res.token);
  };

  const createNewPresentation = async (fileName) => {
    if (presentationId !== "") {
      console.log("Already created");
      return;
    }
    const res = await createPresentation(token, fileName)
    const json = await res.json();
    setPresentationId(json.presentationId);
    console.log("slide created!", json);
    return json.presentationId;
  }

  const addNewSlide = async (token, presentationId) => {
    const res = await addSlide(token, presentationId, 5);
    const json = await res.json();
    console.log("slide added", json);
    return json.replies[0].createSlide.objectId;
  }

  const addNewText = async (objectId, text) => {
    if (token && presentationId) {
      let res = await addText(token, presentationId, objectId, text);
      let json = await res.json();
      console.log("text added", json);
    } else {
      console.log("no token or presentationId");
    }
  }

  const getNewSlideObjects = async () => {
    let ttId, bdId;
    if (token && presentationId) {
      const res = await getPresentationObject(token, presentationId);
      const json = await res.json();
      const last_slide = json.slides[json.slides.length - 1];
      ttId = last_slide.pageElements[0].objectId;
      bdId = last_slide.pageElements[1].objectId;
    } else {
      console.log("no token or presentationId");
    }
    return {titleId: ttId, bodyId: bdId};
  }

  const getFirstSlideObjects = async () => {
    let ttId, bdId;
    if (token && presentationId) {
      const res = await getPresentationObject(token, presentationId);
      const json = await res.json();
      const first_slide = json.slides[0];
      ttId = first_slide.pageElements[0].objectId;
      bdId = first_slide.pageElements[1].objectId;
    } else {
      console.log("no token or presentationId");
    }
    return {titleId: ttId, bodyId: bdId};
  }

  const addSlideFromCsv = async (token, presentationId) => {
    const {titleId, bodyId} = await getFirstSlideObjects();
    addNewText(titleId, 'Science Olympiad Results');
    addNewText(bodyId, 'MIT');
    if (csvData) {
      for (let i = 0; i < csvData.length; i++) {
      // for (let i = 0; i < 3; i++) {
        await addNewSlide(token, presentationId);
        const {titleId, bodyId} = await getNewSlideObjects();
        addNewText(titleId, csvData[i]['Event']);
        addNewText(bodyId, rankingsTransform(csvData[i]['Rankings']));
      }
    } else {
      console.log("No data");
    }
  }

  const rankingsTransform = (rankings) => {
    const res = rankings
    let res_str = "";
    for (let i = 0; i < res.length; i++) {
      res_str += i + 1 + ". " + res[i] + "\n";
    }
    return res_str;
  }

  return (
    <div>
      {(user === null) ?
        <button onClick={() => login()}>Sign in with Google</button> :
        <div>
          <p>User: {user.email}</p>
          <p>Presentation Id:
            <input onChange={(e) => setPresentationId(e.target.value)} value={presentationId} style={{width: "500px"}}/>
          </p>
          <a href={`https://docs.google.com/presentation/d/${presentationId}/edit`} target="_blank" rel="noreferrer">Open Presentation Link</a>
          <p/>
          <button onClick={() => createNewPresentation("SciOly Results")}>Create Presentation</button>
          <button onClick={() => addSlideFromCsv(token, presentationId)}>Generate Slides from CSV</button>
        </div>}
    </div>
  )
}