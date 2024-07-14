import React, { useState } from "react";
import { signInWithGoogle } from '../../Services/auth';
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { database } from "../../firebase";
import googlelogo from "../../assets/googlelogo.png";

export default function GoogleSignin({ close }) {

  const [loading, setLoading] = useState(false);

  const signInBtnClick = async () => {
    setLoading(true);
    let userBySignIn = await signInWithGoogle();
    if (userBySignIn) {
      database.ref(`/Users/${userBySignIn.uid}`).on("value", (snapshot) => {
        if (snapshot.val()) {
          database.ref(`Users/${userBySignIn.uid}`).update({
            timestamp: Date.now(),
          }).then(() => {
            localStorage.setItem('uid', userBySignIn.uid)
            setLoading(false);
            close()
            window.location.reload()
          }).catch((e) => {
            setLoading(false);
            console.log(e)
          });
        } else {
          database
            .ref(`/Users/${userBySignIn.uid}`)
            .update({
              uid: userBySignIn.uid,
              email: userBySignIn.email,
              createdAccountOn: Date.now(),
              photo: `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${userBySignIn.email.split('@')[0]}?size=96`,
              username: userBySignIn.email.split('@')[0],
              timestamp: Date.now(),
              public: false,
              premium: false,
              admin: false
            })
            .then(() => {
              localStorage.setItem('uid', userBySignIn.uid)
              setLoading(false);
              close()
              window.location.reload()
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