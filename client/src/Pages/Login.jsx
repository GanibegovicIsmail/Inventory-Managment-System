import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/check-user", loginData)
      .then((response) => {
        Cookies.set("jwt_token", response.data.token);
        navigate("/");
      })
      .catch((err) => setError(err.response.data.error));
  };

  return (
    <>
      <div className=" h-screen text-gray-800 ">
        <div className="flex justify-center items-center flex-wrap h-full g-6">
          <div className="pozadina bg-violet-800 w-1/2 h-screen flex items-center justify-center text-5xl">
            <p className="LogIn text-white font-sans font-bold">Prijava</p>
          </div>
          <div className="xl:w-1/2 h-1/2 lg:w-5/12 md:w-8/12 mb-12 md:mb-0 py-20 px-10 rounded-xl flex items-center justify-center">
            <form>
              <div className="mb-6">
                <input
                  type="text"
                  name="username"
                  className="form-control block w-full px-4 py-4 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-2xl transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-violet-600 focus:outline-none"
                  placeholder="Korisnicko Ime"
                  onChange={handleChange}
                />
              </div>

              <div className="mb-2">
                <input
                  type="password"
                  name="password"
                  className="form-control block w-full rounded-2xl px-4 py-4 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-violet-600 focus:outline-none"
                  placeholder="Lozinka"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <p className="text-red-500 text-xl">{error}</p>
              </div>
              <div className="text-center lg:text-left">
                <button
                  type="button"
                  onClick={handleLogin}
                  className="inline-block rounded-2xl px-7 py-4 text-white bg-violet-400 font-medium hover:bg-violet-900 text-sm leading-snug uppercase shadow-mdfocus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
                >
                  Prijavi Se
                </button>
                <p className="text-sm font-semibold mt-2 pt-1 mb-0">
                  Nemate racun?
                  <Link
                    to="/register"
                    className="text-violet-400 hover:text-violet-900 focus:text-fuchsia-400 transition duration-200 ease-in-out"
                  >
                    {" "}
                    Registriruj Se
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
