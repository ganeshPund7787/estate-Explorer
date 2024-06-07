import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingCard = ({ listing }) => {
  return (
    <div className="bg-white w-[17rem] shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="listing_cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-orange-700">
            {" "}
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="w-full text-sm text-orange-400 truncate">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 truncate line-clamp-2">{listing.desc}</p>
          <p className="text-orange-300 mt-2 font-bold">
            ${" "}
            {listing.offer
              ? listing.descountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex gap-4 text-slate-700">
            <div className="font-bold text-xs ">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>
            <div className="font-bold text-xs ">
              {listing.batherooms > 1
                ? `${listing.batherooms} baths`
                : `${listing.batherooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
