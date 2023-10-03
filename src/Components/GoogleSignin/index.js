import React, { useState } from "react";
import { signInWithGoogle } from '../../Services/auth';
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { database } from "../../firebase";
import googlelogo from "../../assets/googlelogo.png";

export default function GoogleSignin({ close }) {

  const [loading, setLoading] = useState(false);
  const avatarArray = ['Willow', 'Spooky', 'Bubba', 'Lily', 'Whiskers', 'Pepper', 'Tiger', 'Zoey', 'Dusty', 'Simba']

  const signInBtnClick = async () => {
    setLoading(true);
    let userBySignIn = await signInWithGoogle();
    if (userBySignIn) {
      database.ref(`/Users/${userBySignIn.uid}`).on("value", (snapshot) => {
        if (snapshot.val()) {
          setLoading(false);
          close()
        } else {
          database
            .ref(`/Users/${userBySignIn.uid}`)
            .update({
              uid: userBySignIn.uid,
              email: userBySignIn.email,
              createdAccountOn: Date.now(),
              photo: `https://api.dicebear.com/6.x/thumbs/png?seed=${avatarArray[Math.ceil(Math.random() * 10)]}`,
              username: userBySignIn.email.replace("@gmail.com", ""),
              timestamp: Date.now(),
            })
            .then(() => {
              setLoading(false);
              close()
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    } else {
      setLoading(false)
      console.log('Error')
    }
  };

  return (

    <div className="login__withGoogle" onClick={signInBtnClick}>
      <img src={googlelogo} alt="Google Logo" />
      {!loading ? "Sign in using google" : "Please Wait..."}
    </div>

  );
}