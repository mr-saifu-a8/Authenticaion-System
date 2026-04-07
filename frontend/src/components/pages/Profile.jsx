import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Profile = () => {
  const [data, setData] = useState(null);

  const navigate = useNavigate()


  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/")
      }

      try {
        const res = await api.get("/user/profile")
        setData(res.data)
      } catch (error) {
        alert("Unauthorized")
      }
    };
    fetchProfile()
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Data Block */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
            Response Data
          </h2>
          <pre className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-sm text-gray-700 overflow-x-auto leading-relaxed">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-2.5 rounded-lg border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 active:scale-[0.98] transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
