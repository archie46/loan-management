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
      setError('Invalid credentials'+err);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side Section */}
      <div className="w-1/2 flex flex-col justify-center items-center p-20 bg-gradient-to-b from-[#E6F2FF] via-white to-[#E6F2FF]">
        <h1 className="text-4xl font-semibold mb-3 text-navy">
          Loan<br /> Management <br /> App
        </h1>
        <p className="text-lg text-[#3399cc]">
          Easily manage and track employee loan applications in one place.
        </p>
      </div>

      {/* Right Side Section */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white text-dark p-20">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        {error && <div className="alert alert-danger w-full mb-4 p-3 bg-red-500 text-white rounded-md">{error}</div>}

        <div className="p-6 rounded-4xl shadow-lg w-full max-w-xs">
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#3399cc] focus:border-[#3399cc]"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#3399cc] focus:border-[#3399cc]"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full py-2 px-4 bg-[#003366] text-white font-semibold rounded-md hover:bg-[#002244] transition">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
