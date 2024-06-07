import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";

const Search = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listing, setListings] = useState([]);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnshedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnshedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnshedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async (e) => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }

      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "offer" ||
      e.target.id === "furnished"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const onShowMoreClick = async (e) => {
    const numberOfListings = listing.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);

    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listing, ...data]);
  };

  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      const urlParams = new URLSearchParams();
      urlParams.set("searchTerm", sidebarData.searchTerm);
      urlParams.set("type", sidebarData.type);
      urlParams.set("parking", sidebarData.parking);
      urlParams.set("furnished", sidebarData.furnished);
      urlParams.set("offer", sidebarData.offer);
      urlParams.set("sort", sidebarData.sort);
      urlParams.set("order", sidebarData.order);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
    } catch (error) {
      console.log(`Error while sideSubmit : ${error}`);
    }
  };
  return (
    <div className="flex flex-col md:flex-row font-semibold">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="font-bold whitespace-nowrap">Search Term: </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="search"
              className="border rounded-lg p-2 w-full"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-bold" htmlFor="">
              Type:{" "}
            </label>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                checked={sidebarData.type === "all"}
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={sidebarData.type === "rent"}
                onChange={handleChange}
              />
              <span>Rent </span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={sidebarData.type === "sale"}
                onChange={handleChange}
              />
              <span>Sale</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={sidebarData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-bold" htmlFor="">
              Amenities:{" "}
            </label>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={sidebarData.parking}
                onChange={handleChange}
              />
              <span>Parking </span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={sidebarData.furnished}
                onChange={handleChange}
              />
              <span>furnished </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-bold " htmlFor="">
              Sort:{" "}
            </label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              className="border rounded-lg p-2"
              id="sort_order"
            >
              <option value="regularPrice_desc">Price hign to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button
            className="bg-orange-500 text-white p-2 rounded-lg uppercase hover:bg-orange-400"
            type="submit"
          >
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-2 text-orange-500 mt-5">
          Listing Results :{" "}
        </h1>
        <div className="flex flex-wrap gap-4 p-7">
          {!loading && listing.length === 0 && (
            <p className="text-xl text-red-600">No LIsting Found !</p>
          )}
          {loading && (
            <p className="text-xl text-green-500 text-center w-full">
              LOADING......
            </p>
          )}
          {!loading &&
            listing &&
            listing.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
