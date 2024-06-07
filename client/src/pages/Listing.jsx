import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);

          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <main className="font-semibold">
      {loading && <p className="text-center my-7 text-2xl">Loading.....</p>}
      {error && (
        <p className="text-center text-red-700 my-7 text-2xl">
          Something went wrong.....
        </p>
      )}

      {listing && !error && !loading && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((url, index) => {
              return (
                <SwiperSlide key={url}>
                  <div
                    className="h-[22rem]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col font-bold max-w-4xl mx-auto p-3 my-1 gap-4">
            <p className="text-2xl font-bold">
              {listing.name} - ${+listing.regularPrice - +listing.descountPrice}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-3 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p
                className={`${
                  listing.type === "rent" ? "bg-orange-500 " : "bg-red-600"
                }  cursor-pointer w-full max-w-[200px] text-white text-center p-1 rounded-md`}
              >
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 cursor-pointer w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${" "}
                  {listing.offer
                    ? listing.descountPrice.toLocaleString("en-US")
                    : listing.regularPrice.toLocaleString("en-US")}{" "}
                  Off
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-bold text-black">Description - </span>
              {listing.desc}
            </p>
            <ul className="flex items-center gap-4 sm:gap-6 text-green-900 font-semibold text-sm flex-wrap">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} bed's`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.batherooms > 1
                  ? `${listing.batherooms} bath's`
                  : `${listing.batherooms} bath`}
              </li>

              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking Spot " : "No Parking"}
              </li>

              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished " : "UnFurnished"}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                type="button"
                className="bg-orange-500 font-bold disabled:cursor-not-allowed text-white rounded-lg uppercase hover:bg-orange-400 p-2"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </main>
  );
};

export default Listing;
