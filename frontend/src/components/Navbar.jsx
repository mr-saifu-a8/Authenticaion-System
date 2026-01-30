import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (err) {
      return null;
    }
  });

  useEffect(() => {
    const onAuthChange = () => {
      setToken(localStorage.getItem("token"));
      try {
        setUser(JSON.parse(localStorage.getItem("user") || "null"));
      } catch (err) {
        setUser(null);
      }
    };
    window.addEventListener("authChange", onAuthChange);
    return () => window.removeEventListener("authChange", onAuthChange);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-gray-800 text-white">
      <div className="flex items-center gap-4">
        <h1 className="font-semibold">AuthApp</h1>
        {user && (
          <span className="text-sm text-gray-300">Hello, {user.name}</span>
        )}
      </div>

      <div className="space-x-4">
        {!token ? (
          <>
            <Link to="/" className="hover:underline">
              Register
            </Link>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="hover:underline">
              Profile
            </Link>
            <button onClick={logoutHandler} className="hover:underline">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
