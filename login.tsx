import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const { signIn, getRoleRedirect } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    const res = await signIn(email, password);

    setLoading(false);

    if (res?.error) {
      setErr(res.error);
      return;
    }

    nav(getRoleRedirect());
  };

  const demoLogin = async (role: string) => {
    const accounts: any = {
      owner: "demo-owner@ccbusiness.app",
      manager: "demo-manager@ccbusiness.app",
      employee: "demo-employee@ccbusiness.app",
      admin: "demo-admin@ccbusiness.app",
    };

    const res = await signIn(accounts[role], "Demo1234!");

    if (!res?.error) {
      nav(getRoleRedirect());
    } else {
      setErr(res.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm p-6 bg-gray-900 rounded-xl border border-gray-800">

        <h1 className="text-white text-xl mb-4">Login</h1>

        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full p-2 bg-gray-800 text-white"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-2 bg-gray-800 text-white"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err && <p className="text-red-400 text-sm">{err}</p>}

          <button
            className="w-full bg-blue-600 text-white p-2"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 space-y-2">
          <button onClick={() => demoLogin("owner")} className="text-blue-400">
            Demo Owner
          </button>
          <button onClick={() => demoLogin("manager")} className="text-green-400">
            Demo Manager
          </button>
          <button onClick={() => demoLogin("employee")} className="text-yellow-400">
            Demo Employee
          </button>
        </div>

        <p className="text-gray-400 mt-4 text-sm">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
