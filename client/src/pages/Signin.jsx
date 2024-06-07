import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFailure,
  fetchInStart,
  fetchSuccess,
} from "../app/features/userSlice";
import OAuth from "../components/OAuth";

const Signin = () => {
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      dispatch(fetchInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(fetchFailure(data.message));
        return;
      }

      dispatch(fetchSuccess(data));
      navigate("/");
      return;
    } catch (error) {
      dispatch(fetchFailure(error.message));
      console.log(`Error while sign up : ${error}`);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        <input
          autoFocus
          type="email"
          placeholder="email"
          className="border p-2 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-2 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-orange-500 disabled:cursor-not-allowed text-white p-2 rounded-lg uppercase hover:bg-orange-400 disabled:opacity-80"
        >
          {loading ? "LOADING..." : "Sign In"}
        </button>
        <hr />
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont Have an Account ?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default Signin;
