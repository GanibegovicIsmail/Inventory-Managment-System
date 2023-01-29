import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Context } from "../Helper/Context";
import useToggle from "../Hooks/useToggle";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [isOpen, toggle] = useToggle();
  const [error, setError] = useState("");
  const [changePaswordData, setChangePasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  const changePassword = (e) => {
    e.preventDefault();
    setError("");
    axios
      .patch("http://localhost:5000/api/change-user", {
        ...changePaswordData,
        _id: user._id,
      })
      .then((response) => {
        setError(response.data?.response?.data?.error);
        if (response.data?.response?.status !== 400) return toggle();
      })
      .catch((err) => err);
  };

  const handleChange = (e) => {
    setChangePasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const token = Cookies.get("jwt_token");
    axios
      .get("http://localhost:5000/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data?.response?.status === 401) {
          navigate("/login");
        }
      })
      .catch((err) => err);
  }, [navigate]);

  return (
    <div className="absolute top-0 w-full h-screen flex items-center justify-center bg-violet-100">
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-20 flex items-center justify-center z-10">
          <div className="w-full max-w-sm m-4 bg-violet-900 rounded-lg shadow-xl">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl leading-7 font-semibold text-white">
                  Promijeni Lozinku
                </h2>
                <div
                  onClick={toggle}
                  className=" flex items-center justify-center w-8 h-8 p-1 rounded-full bg-white focus:outline-none focus:bg-gray-300"
                >
                  <ion-icon name="close-outline" size="large"></ion-icon>
                </div>
              </div>
              <form onSubmit={changePassword} className="space-y-6 mt-4">
                <div className="space-y-4">
                  <input
                    type="password"
                    required
                    name="oldPassword"
                    placeholder="Trenutna Lozinka"
                    onChange={handleChange}
                    className="w-full p-2 border-[1px] border-gray-400 outline-none rounded"
                  />
                  <input
                    type="password"
                    required
                    name="newPassword"
                    placeholder="Nova Lozinka"
                    onChange={handleChange}
                    className="w-full p-2 border-[1px] border-gray-400 outline-none rounded"
                  />
                  <input
                    type="password"
                    required
                    name="repeatPassword"
                    placeholder="Ponovi Lozinku"
                    onChange={handleChange}
                    className="w-full p-2 border-[1px] border-gray-400 outline-none rounded"
                  />
                </div>
                <div>
                  <p className="text-lg text-red-600">{error}</p>
                </div>
                <button
                  type="submit"
                  className="bg-white text-black rounded  hover:bg-violet-500 hover:text-white py-2 px-4 font-bold"
                >
                  Izmijeni
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {user?.role === "employee" ? (
        <div className="w-80 rounded-xl shadow-2xl py-10 mt-20 bg-violet-900">
          <div className="bg-white w-28 h-28 rounded-full mx-auto mt-10 flex items-center justify-center">
            <img
              src={
                "https://militaryhealthinstitute.org/wp-content/uploads/sites/37/2021/08/blank-profile-picture-png-400x400.png"
              }
              alt="Profile"
              className="w-20 h-20"
            />
          </div>
          <div className="mt-7 px-5 space-y-2">
            <p className="text-white">
              Ime:{" "}
              <span className="font-bold">{user?.employee_id?.firstName}</span>
            </p>
            <p className="text-white">
              Prezime:{" "}
              <span className="font-bold">{user?.employee_id?.lastName}</span>
            </p>
            <p className="text-white">
              Telefon:{" "}
              <span className="font-bold">{user?.employee_id?.telephone}</span>
            </p>
            <p className="text-white">
              Adresa{" "}
              <span className="font-bold">{user?.employee_id?.address}</span>
            </p>
            <p className="text-white">
              Email:{" "}
              <span className="font-bold">{user?.employee_id?.email}</span>
            </p>
            <p className="text-white">
              Datum Zaposlenja:{" "}
              <span className="font-bold">
                {user?.employee_id?.dateOfEmployment?.slice(0, 10)}
              </span>
            </p>
            <div className="flex justify-center pt-10">
              <button
                onClick={toggle}
                className="bg-white text-black  hover:bg-violet-500 hover:text-white rounded-3xl py-3 px-5 font-bold"
              >
                Promijeni Lozinku
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Profile;
