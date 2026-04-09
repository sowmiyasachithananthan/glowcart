import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AccountPage({ apiBase, user, setUser }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState(user ? "account" : "login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [login, setLogin] = useState({ email: "", password: "" });
  const [register, setRegister] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    setTab(user ? "account" : "login");
  }, [user]);

  const saveSession = (data) => {
    localStorage.setItem("authToken", data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/");
  };

  const doLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Login failed");
      saveSession(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const doRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(register),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Registration failed");
      saveSession(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <p className="section-tag">Account</p>
      <h1 className="section-title">My Account</h1>

      <div className="luxury-card">
        <div className="account-tabs">
          <button type="button" className={`tab-btn ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")} disabled={!!user}>Login</button>
          <button type="button" className={`tab-btn ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")} disabled={!!user}>Register</button>
          <button type="button" className={`tab-btn ${tab === "account" ? "active" : ""}`} onClick={() => setTab("account")} disabled={!user}>Account</button>
        </div>

        {error ? <p className="muted" style={{ color: "#a6362a" }}>{error}</p> : null}

        {user && tab === "account" ? (
          <div className="account-panel">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <div className="account-actions">
              <Link to="/orders">My Orders</Link>
              <button type="button" onClick={logout}>Logout</button>
            </div>
          </div>
        ) : null}

        {!user && tab === "login" ? (
          <form className="form" onSubmit={doLogin}>
            <input type="email" placeholder="Email" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} required />
            <input type="password" placeholder="Password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} required />
            <button type="submit" disabled={loading}>{loading ? "Please wait..." : "Login"}</button>
          </form>
        ) : null}

        {!user && tab === "register" ? (
          <form className="form" onSubmit={doRegister}>
            <input placeholder="Name" value={register.name} onChange={(e) => setRegister({ ...register, name: e.target.value })} required />
            <input type="email" placeholder="Email" value={register.email} onChange={(e) => setRegister({ ...register, email: e.target.value })} required />
            <input type="password" placeholder="Password (min 6 chars)" value={register.password} onChange={(e) => setRegister({ ...register, password: e.target.value })} required />
            <button type="submit" disabled={loading}>{loading ? "Please wait..." : "Create Account"}</button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

export default AccountPage;

