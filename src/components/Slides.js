import React, { useState } from "react";
import { LoginWithGoogle } from "./auth";
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
        <button onClick={() => createNewSlide("My Slide 1")}>Create Slide</button>
      </div>
    );
  }
}
