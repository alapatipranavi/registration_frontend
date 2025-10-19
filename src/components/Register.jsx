import React, { useState } from 'react';
import '../styles/Register.css';

export default function Register() {
  const initial = {
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    password: '',
    confirm: ''
  };
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErr(null);
    setMsg(null);
  };

  const validate = () => {
    const { name, email, phone, gender, dob, password, confirm } = form;
    if (!name || !email || !phone || !gender || !dob || !password || !confirm) {
      return 'All fields are required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email';
    if (!/^[6-9]\d{9}$/.test(phone)) return 'Enter a valid 10-digit phone number';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirm) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    const v = validate();
    if (v) { setErr(v); return; }

    setLoading(true);
    try {
      // ✅ fixed: await the fetch
      const res = await fetch('https://registration-backend-vwji.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            gender: form.gender,
            dob: form.dob,
            password: form.password
        })
    });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setMsg(data.message || 'Registered successfully!');
      setForm(initial);
    } catch (error) {
      setErr(error.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initial);
    setErr(null);
    setMsg(null);
  };

  return (
    <div className="page-bg">
      <div className="register-card">
        <div className="card-header">
          <h1>Sign Up</h1>
          <p>Create your account — it takes a minute</p>
        </div>

        <form className="reg-form" onSubmit={handleSubmit} noValidate>
          <div className="row">
            <label className="input-group">
              <span>Name</span>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
            </label>

            <label className="input-group">
              <span>Email</span>
              <input name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </label>
          </div>

          <div className="row">
            <label className="input-group">
              <span>Phone</span>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit phone" />
            </label>

            <label className="input-group">
              <span>Date of Birth</span>
              <input name="dob" value={form.dob} onChange={handleChange} type="date" />
            </label>
          </div>

          <div className="row">
            <div className="input-group full">
              <span>Gender</span>
              <div className="gender-row">
                <label className="radio">
                  <input type="radio" name="gender" value="female" checked={form.gender === 'female'} onChange={handleChange} />
                  <span>Female</span>
                </label>
                <label className="radio">
                  <input type="radio" name="gender" value="male" checked={form.gender === 'male'} onChange={handleChange} />
                  <span>Male</span>
                </label>
                <label className="radio">
                  <input type="radio" name="gender" value="other" checked={form.gender === 'other'} onChange={handleChange} />
                  <span>Other</span>
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            <label className="input-group">
              <span>Password</span>
              <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="At least 6 characters" />
            </label>

            <label className="input-group">
              <span>Confirm Password</span>
              <input name="confirm" value={form.confirm} onChange={handleChange} type="password" placeholder="Repeat password" />
            </label>
          </div>

          <div className="actions">
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
            <button type="button" className="btn ghost" onClick={handleReset}>Reset</button>
          </div>

          {(err || msg) && (
            <div className={`notice ${err ? 'err' : 'ok'}`}>
              {err || msg}
            </div>
          )}
        </form>

        <div className="card-footer">
          <small>By signing up you agree to our terms & conditions.</small>
        </div>
      </div>

      {/* subtle animated shapes */}
      <div className="float circle c1"></div>
      <div className="float circle c2"></div>
      <div className="float square s1"></div>
    </div>
  );
}
