import axios from "axios";
import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = () => {
    setError("");
    axios
      .post("http://localhost:5000/api/add-user", userData)
      .then(() => {
        setUserData({
          username: "",
          password: "",
          confirm_password: "",
        });
        navigate("/login");
      })
      .catch((error) => setError(error.response.data.error));
  };

  return (
    <>
      <div className="w-screen flex flex-row items-center">
        <div className="pozadina bg-violet-800 w-1/2 h-screen flex items-center justify-center text-5xl">
          <p className="LogIn text-white font-sans font-bold">Registracija</p>
        </div>
        <div className="flex flex-col xl:w-1/4 h-1/2 mb-12 md:mb-0  rounded justify-center items-center">
          <div className="bg-transparent px-6 py-8 rounded-2xl text-gray-900 w-full ml-96">
            <input
              type="text"
              className="block border  w-full p-4 rounded-2xl mb-4  focus:border-violet-600"
              name="username"
              placeholder="Korisnicko Ime"
              onChange={handleChange}
            />

            <input
              type="password"
              className="block border  w-full p-4 rounded-2xl mb-4   focus:border-violet-600"
              name="password"
              placeholder="Lozinka"
              onChange={handleChange}
            />
            <input
              type="password"
              className="block border  w-full p-4 rounded-2xl mb-4  focus:border-violet-600"
              name="confirm_password"
              placeholder="Potvrdi Lozinku"
              onChange={handleChange}
            />
            <div className="mb-4">
              <p className="text-red-500 text-lg">{error}</p>
            </div>

            <button
              onClick={handleRegister}
              type="submit"
              className="w-full text-center py-4 rounded-2xl bg-violet-400  hover:bg-violet-900  focus:border-violet-600 text-white focus:outline-none my-1"
            >
              Registruj Se
            </button>
          </div>

          <div className="text-grey-dark mt-6 ml-8">
            <p className="text-sm font-semibold mt-2 pt-1 mb-0 ml-28">
              Vec imate racun?{" "}
              <Link
                to="/login"
                className="text-violet-400 hover:text-violet-900 focus:text-violet-400 transition duration-200 ease-in-out"
              >
                Prijavi Se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
