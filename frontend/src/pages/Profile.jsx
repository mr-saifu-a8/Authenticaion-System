import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/auth";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // not logged in — redirect to login
      navigate("/login");
      return;
    }

    // use stored user while we refresh
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      if (stored) setUser(stored);
    } catch (err) {
      // ignore
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getProfile(token);
        setUser(res);
        localStorage.setItem("user", JSON.stringify(res));
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to fetch profile");
        // If token invalid or expired, clear and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("authChange"));
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  if (loading) return <p>Loading profile...</p>;

  if (error)
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
        >
          Go to Login
        </button>
      </div>
    );

  if (!user)
    return (
      <div className="p-6">
        <p className="text-yellow-600">Profile not available.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
        >
          Go to Login
        </button>
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-xl">Welcome, {user?.name}</h2>
      <p>{user?.email}</p>

      <button
        onClick={logout}
        className="mt-4 bg-red-600 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}
