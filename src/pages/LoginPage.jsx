// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(username, password);
      localStorage.setItem('token', res.token);
      localStorage.setItem('username', res.username);
      localStorage.setItem('userId', res.id);
      localStorage.setItem('roles', JSON.stringify(res.roles));

      if (res.roles.includes('ROLE_ADMIN')) {
        navigate('/admin');
      } 
      else if(res.roles.includes('ROLE_MANAGER')){
        navigate('/manager')
      }
      else if(res.roles.includes('ROLE_FINANCE')){
        navigate('/finance')
      }
      else if (res.roles.includes('ROLE_USER')) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans bg-gray-50">
      {/* Left Side Section with branding and info */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-12 bg-gradient-to-b from-blue-100 via-white to-blue-100">
        <h1 className="text-4xl font-extrabold mb-4 text-blue-900 leading-tight text-center">
          Loan<br /> Management <br /> App
        </h1>
        <p className="text-lg text-blue-700 text-center max-w-sm">
          Easily manage and track employee loan applications in one place.
        </p>
      </div>

      {/* Right Side Section with login form */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-12 bg-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800">Login</h2>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="w-full max-w-xs mb-6 p-3 bg-red-500 text-white rounded-md text-center font-medium"
          >
            {error}
          </div>
        )}

        <div className="w-full max-w-xs">
          <form onSubmit={handleLogin} noValidate>
            {/* Username Field */}
            <div className="mb-6">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                autoComplete="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Password Field */}
            <div className="mb-8">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-800 text-white font-semibold rounded-md 
                hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
