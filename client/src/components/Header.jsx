import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("searchTerm", searchTerm);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
      return;
    } catch (error) {
      console.log(`Error While seachTerm in Header client side : ${error}`);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl || "");
    }
  }, [location.search]);

  return (
    <header className="bg-orange-500 shadow-md ">
      <div className="flex justify-between items-center max-w-6xl mx-auto py-4 p-3">
        <Link to={"/"}>
          <h1 className="font-bold text-sm sm:text-2xl flex flex-wrap">
            <span className="text-slate-700">estate</span>
            <span className="text-slate-500">Explorer</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-2 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="search..."
            className="bg-transparent outline-none focus:outline-none w-24 sm:w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4 font-bold">
          <Link to={"/"}>
            <li className="hidden sm:inline hover:underline ">HOME</li>
          </Link>
          <Link to={"/about"}>
            <li className="hidden sm:inline hover:underline">ABOUT</li>
          </Link>
          {currentUser ? (
            <Link to={"/profile"}>
              <img
                className="rounded-full h-7 w-7 object-cover cursor-pointer"
                src={currentUser.profileImg}
                alt="profile"
              />
            </Link>
          ) : (
            <Link to={"/sign-in"}>
              <li className=" hover:underline">SIGN IN</li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
