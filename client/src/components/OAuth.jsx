import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { fetchSuccess } from "../app/features/userSlice.js";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const Provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, Provider);
      const user = result.user;

      const res = await fetch("/api/auth/googleAuth", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          username: user.displayName,
          email: user.email,
          profileImg: user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(fetchSuccess(data));
      navigate("/");
    } catch (error) {
      console.log(`error while google auth  :${error}`);
    }
  };
  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-green-700 text-white p-2 rounded-lg uppercase hover:bg-green-500"
    >
      Contiinue with google
    </button>
  );
};

export default OAuth;
