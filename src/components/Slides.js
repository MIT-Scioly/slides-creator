import React, {useState} from "react";
import {LoginWithGoogle} from "./auth";
import {
  createPresentation,
  getPresentationObject,
  insertTextWithDataRequest,
  createNewSlideWithDataRequest, batchUpdateSlides
} from './slideHandler';


export default function Slides({csvData}) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [presentationId, setPresentationId] = useState("");
  const [presentation, setPresentation] = useState(null);
  const login = async () => {
    const res = await LoginWithGoogle();
    setUser(res.user);
    setToken(res.token);
  };

  const setPresentationIdWrapper = (data) => {
    setPresentationId(data);
    setPresentation(null);
  }
  const getPresentation = async () => {
    if (presentation) {
      return presentation;
    }
    const res = await getPresentationObject(token, presentationId);
    const json = await res.json();
    setPresentation(json);
    return json;
  }

  const createNewPresentation = async (fileName) => {
    if (presentationId !== "") {
      console.log("Already created");
      return;
    }
    const res = await createPresentation(token, fileName)
    const json = await res.json();
    setPresentationIdWrapper(json.presentationId);
    console.log("slide created!", json);
    return json.presentationId;
  }

  const getFirstSlideObjects = async () => {
    let ttId, bdId;
    if (token && presentationId) {
      const json = await getPresentation();
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
    const requestList = [];
    requestList.push(insertTextWithDataRequest(titleId, 'Science Olympiad Results'));
    requestList.push(insertTextWithDataRequest(bodyId, 'MIT'));
    if (csvData) {
      for (let i = 0; i < csvData.length; i++) {
        // for (let i = 0; i < 3; i++) {
        requestList.push(createNewSlideWithDataRequest(csvData[i]['Event'], rankingsTransform(csvData[i]['Rankings'])));
      }
    } else {
      console.log("No data");
    }
    const res = await batchUpdateSlides(token, presentationId, requestList);
    console.log(await res.json());
    return res;
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
            <input onChange={(e) => setPresentationIdWrapper(e.target.value)} value={presentationId}
                   style={{width: "500px"}}/>
          </p>
          <a href={`https://docs.google.com/presentation/d/${presentationId}/edit`} target="_blank" rel="noreferrer">Open
            Presentation Link</a>
          <p/>
          <button onClick={() => createNewPresentation("SciOly Results")}>Create Presentation</button>
          <p/>
          <button onClick={() => addSlideFromCsv(token, presentationId)}>Generate Slides from CSV</button>
        </div>}
    </div>
  )
}