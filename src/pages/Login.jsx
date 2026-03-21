// src/pages/Login.jsx
// Authentication page — simulates sign in

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import useAuthStore from '../store/authStore'
import './Login.css'

export default function Login() {
  const { login, isLoading, user } = useAuthStore()
  const navigate = useNavigate()

  // Redirect if already logged in
  if (user) {
    navigate('/')
    return null
  }

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setLoginError('')
  }

  function validate() {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setLoginError(err.message || 'Sign in failed. Please try again.')
    }
  }

  return (
    <div className="login-page">
      <div className="login-split">
        {/* Left: Visual panel */}
        <div className="login-visual">
          <div className="login-visual-content">
            <Link to="/" className="login-logo">
              <span className="logo-icon">⌂</span>
              <span>StayNest</span>
            </Link>
            <div className="login-tagline">
              <h2>Your next adventure starts here</h2>
              <p>Discover beautiful properties in the world's most sought-after destinations.</p>
            </div>
            <div className="login-visual-stats">
              <div className="stat">
                <strong>50K+</strong>
                <span>Properties</span>
              </div>
              <div className="stat">
                <strong>120+</strong>
                <span>Countries</span>
              </div>
              <div className="stat">
                <strong>4.9★</strong>
                <span>Avg. rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="login-form-panel">
          <div className="login-form-content">
            <div className="login-form-header">
              <h1>Welcome back</h1>
              <p>Sign in to your StayNest account</p>
            </div>

            {loginError && (
              <div className="login-error-banner">
                {loginError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {/* Email */}
              <div className="login-field">
                <label htmlFor="email">Email address</label>
                <div className={`login-input-wrapper ${errors.email ? 'has-error' : ''}`}>
                  <Mail size={16} className="login-input-icon" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <span className="login-field-error">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="login-field">
                <label htmlFor="password">Password</label>
                <div className={`login-input-wrapper ${errors.password ? 'has-error' : ''}`}>
                  <Lock size={16} className="login-input-icon" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <span className="login-field-error">{errors.password}</span>}
              </div>

              <button
                type="submit"
                className="btn btn-primary login-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="login-spinner" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="login-hint">
              Use any email and a password (6+ chars) to sign in.
              <br />
              This is a demo — no real authentication required.
            </p>

            <div className="login-divider">
              <span>or</span>
            </div>

            <Link to="/" className="btn btn-secondary login-guest-btn">
              Continue as guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
