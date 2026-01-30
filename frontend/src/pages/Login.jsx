import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getProfile } from "../api/auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);

      if (res.token) {
        localStorage.setItem("token", res.token);

        try {
          const profile = await getProfile(res.token);
          localStorage.setItem("user", JSON.stringify(profile));
        } catch (err) {
          console.error("Failed to fetch profile after login:", err);
          localStorage.removeItem("user");
        }

        window.dispatchEvent(new Event("authChange"));
        navigate("/profile");
      } else {
        alert(res.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-gray-800">Sign in</h2>
        <p className="text-sm text-gray-500 mt-1 mb-5">
          Enter your credentials to continue
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            placeholder="name@company.com"
            value={form.email}
            disabled={loading}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            disabled={loading}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className={`w-full py-2 rounded-md text-sm font-medium text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
