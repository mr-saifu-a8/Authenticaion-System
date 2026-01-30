import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BASE = "/api/auth";

export default function Verify() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      setMessage("No token provided.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${BASE}/verify-email?token=${encodeURIComponent(token)}`,
        );
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully.");
          // redirect to login after 3s
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
        }
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Network error");
      }
    };

    verify();
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded shadow w-full max-w-md text-center">
        {status === "loading" && <p>Verifying...</p>}
        {status === "success" && (
          <>
            <h2 className="text-xl font-semibold mb-2">Verified ✅</h2>
            <p className="mb-4">{message}</p>
            <p className="text-sm text-gray-600 mb-4">
              Redirecting to login...
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-2 bg-blue-600 text-white py-2 px-4 rounded"
            >
              Go to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-xl font-semibold mb-2">Verification Failed</h2>
            <p className="mb-4">{message}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => navigate("/login")}
                className="mt-2 bg-blue-600 text-white py-2 px-4 rounded"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate("/")}
                className="mt-2 bg-gray-200 text-gray-800 py-2 px-4 rounded"
              >
                Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
