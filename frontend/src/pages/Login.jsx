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

        // fetch user details and store them too
        try {
          const profile = await getProfile(res.token);
          localStorage.setItem("user", JSON.stringify(profile));
        } catch (err) {
          console.error("Failed to fetch profile after login:", err);
          localStorage.removeItem("user");
        }

        // notify other components (Navbar) about auth change
        window.dispatchEvent(new Event("authChange"));
        // redirect to profile
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
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 w-80 shadow">
        <h2 className="text-xl mb-4">Login</h2>

        <input
          className="input"
          placeholder="Email"
          value={form.email}
          disabled={loading}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="input mt-2"
          type="password"
          placeholder="Password"
          value={form.password}
          disabled={loading}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          className={`mt-4 w-full py-2 rounded ${loading ? "bg-gray-400" : "bg-green-600"}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
