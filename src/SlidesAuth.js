import React, { useState } from "react";
import { LoginWithGoogle } from "./auth";
import { getFiles } from "./drive";
import {createSheet} from './sheets';
import {createSlide} from './slides';


export default function SlidesAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async () => {
    const res = await LoginWithGoogle();
    console.log("App.js 14 | ", res);
    setUser(res.user);
    setToken(res.token);
  };

  const getDriveFiles = async () => {
    return getFiles(token)
      .then((response) => response.json())
      .then((files) => console.log("App.js | files", files));
  };

  const createNewSheet = async (fileName) => {
    return createSheet(token, fileName)
      .then((res) => {
        console.log("App.js | sheet created!", res);
      })
      .catch((error) => {
        console.log("App.js | ", "ERROR creating sheet", error);
      });
  };

  const createNewSlide = async (fileName) => {
    const res = await createSlide(token, fileName)
    const json = await res.json();
    console.log("App.js | slide created!", json);
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
        <button onClick={() => getDriveFiles()}>Get Files from Drive</button>
        <button onClick={() => createNewSheet("My Sheet 1")}>Create Spreadsheet</button>
        <button onClick={() => createNewSlide("My Slide 1")}>Create Slide</button>
      </div>
    );
  }
}
