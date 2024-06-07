import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingCard from "../components/ListingCard";

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use(Navigation);

  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListing();
      } catch (error) {
        console.log(`Error while fetchOfferListing : ${error}`);
      }
    };

    const fetchRentListing = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListing();
      } catch (error) {
        console.log(`Error while fetchRentListing : ${error}`);
      }
    };

    const fetchSaleListing = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(`Error while fetchSaleListing : ${error}`);
      }
    };

    fetchOfferListing();
  }, []);

  return (
    <div className="font-semibold bg-slate-200">
      {/* Top of the web */}
      <div className="flex flex-col gap-6 py-24 px-3 max-w-6xl mx-auto">
        <h1 className="text-orange-700 font-bold text-3xl lg:text-6xl">
          Quickly Discover Your Next <br />
          <span className="text-orange-400">Perfect</span> Home
        </h1>
        <div className="text-orange-500 text-xs sm:text-sm font-semibold">
          Explore Estate: The Ultimate Destination to Find Your Next Perfect
          Home.
          <br />
          Choose from a Wide Range of Exceptional Properties Tailored Just for
          You.
        </div>
        <Link
          to={`/search`}
          className="text-xs sm:text-sm font-bold text-cyan-500 hover:underline"
        >
          {" "}
          Let's get started{" "}
        </Link>
      </div>

      {/* Swiper */}

      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <Link to={`/listing/${listing._id}`}>
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="h-[25rem]"
                ></div>
              </Link>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listing result for offer, sale and rent */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="flex flex-wrap flex-col md:flex-row justify-between my-5">
              <h2 className="text-2xl font-bold text-orange-500">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-600 hover:underline"
                to={`/search?offer=true`}
              >
                {" "}
                Show More Offers{" "}
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {offerListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="flex flex-wrap flex-col md:flex-row justify-between my-5">
              <h2 className="text-2xl font-bold text-orange-500">
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-blue-600 hover:underline"
                to={`/search?type=rent`}
              >
                {" "}
                Show More places for rent{" "}
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {rentListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="flex flex-wrap flex-col md:flex-row justify-between my-5">
              <h2 className="text-2xl font-bold text-orange-500">
                Recent places for sale
              </h2>
              <Link
                className="text-sm text-blue-600 hover:underline"
                to={`/search?type=sale`}
              >
                {" "}
                Show More rent estate{" "}
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {saleListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
