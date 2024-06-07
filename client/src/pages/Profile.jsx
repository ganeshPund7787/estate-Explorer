import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateToggle,
  fetchSuccess,
  deleteUser,
  fetchInStart,
  fetchFailure,
  logoutUser,
} from "../app/features/userSlice";

import { Link } from "react-router-dom";

const Profile = () => {
  const { currentUser, isEditable, loading } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePer, setFilePer] = useState(0);
  const [uploadFileError, setUploadFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingError, setShowListngError] = useState(false);
  const [userListing, setUserListing] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePer(Math.round(progress));
      },
      (error) => {
        setUploadFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURI) =>
          setFormData({ ...formData, profileImg: downloadURI })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const handleUpdateClick = async (e) => {
    try {
      e.preventDefault();
      dispatch(fetchInStart());
      const res = await fetch(`/api/user/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(fetchFailure());
        return;
      }
      dispatch(fetchSuccess(data));
      dispatch(updateToggle());
    } catch (error) {
      console.log(`Error while upadate: ${error}`);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`/api/user/logout`);
      const data = await res.json();
      if (data.success === false) return;
      dispatch(logoutUser());
    } catch (error) {
      console.log(`Error while logout: ${error}`);
    }
  };

  const handleDelete = async () => {
    try {
      const confirmUser = confirm(
        "Are you sure you want to delete your account ? "
      );
      if (!confirmUser) return;
      const res = await fetch(`/api/user/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      dispatch(deleteUser());
      console.log(data);
    } catch (error) {
      console.log(`Error while delete user : ${error}`);
    }
  };

  const handleListing = async () => {
    try {
      setShowListngError(false);
      const res = await fetch(`/api/user/listing/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListngError(true);
        return;
      }
      setUserListing(data);
    } catch (error) {
      console.log(`Error while listing : ${error}`);
      setShowListngError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListing((pre) =>
        pre.filter((listing) => listing._id !== listingId)
      );
      return;
    } catch (error) {
      console.log(`Error while delete listing ${error}`);
    }
  };
  return (
    <>
      {isEditable ? (
        <div className=" fontFamily: Lora, serif, flex-col justify-center px-6 py-12 lg:px-8">
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form>
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <input
                  onChange={(e) => setFile(e.target.files[0])}
                  accept="image/*"
                  hidden
                  type="file"
                  ref={fileRef}
                />
                <img
                  onClick={() => fileRef.current.click()}
                  className="mx-auto h-24 w-24 object-cover rounded-full"
                  src={currentUser.profileImg}
                  alt="Your Company"
                  title="logo"
                />
                <p className="text-center font-bold">
                  {uploadFileError ? (
                    <span className="text-red-700">
                      Error Image Upload(Image must be less than 2mb)
                    </span>
                  ) : filePer > 0 && filePer < 100 ? (
                    <span className="text-slate-700">{`Uploading ${filePer}%`}</span>
                  ) : filePer === 100 ? (
                    <span className="text-green-700">
                      Image SuccessFully Uploaded
                    </span>
                  ) : (
                    ""
                  )}
                </p>
              </div>
              <div>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    defaultValue={currentUser.username}
                    autoComplete="email"
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-2 px-2 text-gray-900
                 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                 outline-none "
                  />
                </div>
              </div>

              <div className="mt-2">
                <input
                  id="password"
                  name="email"
                  onChange={handleChange}
                  defaultValue={currentUser.email}
                  type="email"
                  className="block w-full rounded-md border-0 py-2 px-2 text-gray-900
                 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                 outline-none"
                />
              </div>

              <div>
                <button
                  onClick={handleUpdateClick}
                  type="button"
                  disabled={loading}
                  className="flex disabled:cursor-not-allowed my-5 w-full md:text-lg justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {loading ? "LOADING..." : "save"}
                </button>

                <button
                  type="button"
                  onClick={() => dispatch(updateToggle())}
                  className="flex w-full md:text-lg justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  cancle
                </button>
              </div>
            </form>
            <div
              className={`mt-6 text-red-600 flex justify-between ${
                currentUser ? "flex" : "hidden"
              }`}
            ></div>
          </div>
        </div>
      ) : (
        <div className="font-bold flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                  className="mx-auto h-24 w-24 object-cover rounded-full"
                  src={currentUser.profileImg}
                  alt="Your Company"
                  title="logo"
                />
              </div>
              <div>
                <div className="mt-2">
                  <input
                    id="email"
                    name="username"
                    type="text"
                    defaultValue={currentUser.username}
                    readOnly
                    className="block w-full rounded-md border-0 py-2 px-2 text-gray-900
                 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                 outline-none "
                  />
                </div>
              </div>
              <div>
                <div className="mt-2">
                  <input
                    name="email"
                    defaultValue={currentUser.email}
                    readOnly
                    type="email"
                    className="block w-full rounded-md border-0 py-2 px-2 text-gray-900
                 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                 outline-none"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  onClick={() => dispatch(updateToggle())}
                  className="disabled:bg-indigo-400 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Edit Profile
                </button>
              </div>
            </form>
            <div>
              <Link
                to={"/create-listing"}
                type="submit"
                className="disabled:bg-cyan-400 my-5 flex w-full justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
              >
                create listing
              </Link>
            </div>
            <div
              className={`mt-6 text-red-600 flex justify-between ${
                currentUser ? "flex" : "hidden"
              }`}
            >
              <button type="button" onClick={handleDelete}>
                Delete Profile
              </button>
              <button type="button" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
          {userListing.length > -1 && (
            <button
              type="button"
              onClick={handleListing}
              className="text-green-600 mt-8 hover:shadow-lg w-full"
            >
              Show listing
            </button>
          )}
          <p className="text-red-600 m-5">
            {showListingError ? `Error Showing Listing...` : ""}
          </p>

          {userListing && userListing.length > 0 && (
            <div className="flex flex-col gap-4">
              <h1 className="text-center mt-7 text-2xl font-semibold">
                Your Listing
              </h1>
              {userListing.map((listing) => (
                <div
                  className="border mx-3 md:mx-56 hover:scale-105 shadow-lg gap-4 rounded-lg p-2 flex justify-between items-center"
                  key={listing._id}
                >
                  <Link to={`/listing/${listing._id}`} key={listing._id}>
                    <img
                      className="h-16 w-16 object-contain"
                      src={listing.imageUrls[0]}
                      alt="listing img.."
                    />
                  </Link>
                  <Link
                    className="text-slate-700 font-semibold flex-1 hover:underline truncate"
                    to={`/listing/${listing._id}`}
                  >
                    <p className="truncate">{listing.name}</p>
                  </Link>

                  <div className="flex gap-8 items-center">
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className="text-red-700 hover:shadow-lg uppercase"
                      type="button"
                    >
                      Delete
                    </button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button
                        className="text-green-700 hover:shadow-lg uppercase"
                        type="button"
                      >
                        Edit
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Profile;
