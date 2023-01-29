import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Navbar, NotFound } from "./components";
import { Employee, Home, Login, Register, Supplier } from "./Pages/index";
import { Context } from "./Helper/Context";
import axios from "axios";
import Profile from "./Pages/Profile";

function App() {
  const [user, setUser] = useState();
  const { pathname } = useLocation();
  const token = Cookies.get("jwt_token");

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:5000/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setUser(response.data))
        .catch((err) => console.log(err));
    }
  }, [token]);

  return (
    <div className="bg-violet-100">
      <Context.Provider value={{ user, token }}>
        {pathname !== "/login" && pathname !== "/register" && token && (
          <Navbar />
        )}
        <Routes>
          <Route
            path="/"
            element={user?.role === "admin" ? <Home /> : <Profile />}
          />
          {user?.role === "admin" && (
            <Route path="/employee" element={<Employee />} />
          )}
          <Route path="/supplier" element={<Supplier />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Context.Provider>
    </div>
  );
}

export default App;
