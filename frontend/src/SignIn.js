import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import React from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const auth = getAuth();
const provider = new GoogleAuthProvider();

function SignIn() {
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        // Check if the user exists in Firestore
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
          // User does not exist in Firestore, so add them
          await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          });
        }
        // Redirect the user to the desired page
        window.location.href = "/cart";
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

export default SignIn;

