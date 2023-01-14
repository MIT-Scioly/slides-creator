import firebase from "./firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const LoginWithGoogle = async () => {
  const auth = getAuth(firebase);
  const provider = new GoogleAuthProvider().addScope("https://www.googleapis.com/auth/drive");
  const res = await signInWithPopup(
    auth,
    provider
  )
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(res);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = res.user;
    // console.log(res);
    return { user, token };
};
