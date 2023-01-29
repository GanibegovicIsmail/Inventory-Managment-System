import Cookies from "js-cookie";
import React from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../Helper/Context";
import img from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);

  const handleLogOut = () => {
    Cookies.remove("jwt_token");
    navigate("/login");
  };
  return (
    <>
      <div className="absolute top-0 w-full px-2 py-1 shadow-lg z-10 bg-violet-900">
        <div className="container flex flex-wrap items-center justify-end mx-auto">
          <div className="w-full flex justify-between">
            <ul className="flex text-white p-6 mt-6 border rounded-lg font-sans  bg-violet-900 md:flex-row md:space-x-32 md:mt-0 md:text-sm md:font-medium md:border-0">
              <li>
                <img className="w-14 h-14" src={img} />
              </li>
              <li>
                <Link
                  to="/"
                  className="block py-2 pl-3 pr-4 text-xl hover:text-violet-500  rounded"
                  aria-current="page"
                >
                  {user?.role === "admin" ? "Pocetna" : "Profil"}
                </Link>
              </li>
              {user?.role === "admin" && (
                <li>
                  <Link
                    to="/employee"
                    className="block py-2 pl-3 pr-4 text-xl hover:text-violet-500 rounded"
                  >
                    Zaposlenici
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/supplier"
                  className="block py-2 pl-3 pr-4 text-xl hover:text-violet-500  rounded"
                >
                  Dobavljaci
                </Link>
              </li>
            </ul>
            <div className="flex items-center">
              <button
                className="bg-white rounded-2xl text-black px-5 py-2 font-bold hover:bg-violet-500 hover:text-white"
                onClick={handleLogOut}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
