import React, {useState} from "react";
import {LoginWithGoogle} from "./auth";
import {createPresentation, addSlide, addText, getPresentationObject} from './slideHandler';


export default function Slides({csvData}) {
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
      return json.replies[0].createSlide.objectId;
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
    let ttId, bdId;
    if (token && presentationId) {
      const res = await getPresentationObject(token, presentationId);
      const json = await res.json();
      const last_slide = json.slides[json.slides.length - 1];
      ttId = last_slide.pageElements[0].objectId;
      bdId = last_slide.pageElements[1].objectId;
      setTitleId(last_slide.pageElements[0].objectId);
      setBodyId(last_slide.pageElements[1].objectId);
      console.log("slide objects", json);
    }
    return {titleId: ttId, bodyId: bdId};
  }

  const getNewPresentationObject = async () => {
    if (token && presentationId) {
      const res = await getPresentationObject(token, presentationId);
      const json = await res.json();
      console.log("presentation object", json);
    }
  }

  const addSlideFromCsv = async () => {
    if (csvData) {
      for (let i = 0; i < csvData.length; i++) {
        await addNewSlide();
        const {titleId, bodyId} = await getNewSlideObjects();
        await addNewText(titleId, csvData[i]['Event']);
        await addNewText(bodyId, rankingsTransform(csvData[i]['Rankings']));
      }
    }
  }

  const rankingsTransform = (rankings) => {
    // rankings = "Troy H.S. CA ,Solon H.S. OH ,Harriton H.S. PA ,Mason H.S. OH ,Pioneer H.S. (Ann Arbor) MI ,Adlai E. Stevenson H.S. IL ,Seven Lakes H.S. TX ,New Trier H.S. IL ,ABRHS MA ,Northville H.S. MI body text\n"
    // let res = rankings.split(',').map((r) => {
    //   return r.trim();
    // });
    //
    // console.log(res);
    const res = rankings
    let res_str = "";
    for (let i = 0; i < res.length; i++) {
      res_str += i+1 + ". " + res[i] + "\n";
    }
    // console.log(res_str);
    return res_str;
  }

  return (
    <div>
      {csvData && <p>csvData: {csvData.toString()}</p>}
      {(user === null) ?
        <button onClick={() => login()}>Sign in with Google</button> :
        <div>
          <h3>Logged In!</h3>
          <p>User: {user.email}</p>
          <p>Token: {token}</p>
          <p>Presentation Id: {presentationId}</p>
          <p>Last Slide Id: {lastSlideId}</p>
          <input onChange={(e) => setPresentationId(e.target.value)} placeholder="Presentation Id"/>
          <button onClick={() => createNewPresentation("My Slide 1")}>Create Presentation</button>
          <button onClick={() => addNewSlide()}>Create Slide</button>
          <p></p>
          <button onClick={() => getNewPresentationObject()}>Get New presentation object</button>
          <button onClick={() => getNewSlideObjects()}>Get Slide Objects</button>
          <p>Header Id: {titleId}</p>
          <p>Body Id: {bodyId}</p>
          <button onClick={() => addNewText(titleId, "Hello World")}>Add Title</button>
          <button onClick={() => addNewText(bodyId, "body text")}>Add Body</button>
          <button onClick={() => addSlideFromCsv()}>Add Slide From Csv</button>
          <button onClick={() => rankingsTransform()}>Transform Rankings</button>
        </div>}
    </div>
  )
}