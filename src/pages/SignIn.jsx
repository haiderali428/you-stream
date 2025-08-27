import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../app/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { showLoader, hideLoader } from '../app/loaderSlice';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    dispatch(showLoader());
    const timeout = setTimeout(() => {
      dispatch(hideLoader());
    }, 800);
    return () => clearTimeout(timeout);
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const allUsers = JSON.parse(localStorage.getItem('users')) || [];

    const foundUser = allUsers.find(
      (user) => user.email === form.email && user.password === form.password
    );

    if (foundUser) {
      dispatch(login(foundUser)); // Set currentUser in redux + localStorage
      localStorage.setItem('currentUser', JSON.stringify(foundUser)); // optional but useful
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Sign In
        </h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
