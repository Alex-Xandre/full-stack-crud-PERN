/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { loginUser } from '../api';
import useAuthStore from '../store/auth-store';

const Login = () => {
  const [data, setData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const { login } = useAuthStore();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await loginUser(data.username, data.password);

    if ((res as any)?.error) return alert('Error');

    sessionStorage.setItem('token', (res as any)?.token);
    login((res as any)?.user);
  };

  return (
    <div className='w-full overflow-hidden p-6 flex flex-col gap-4'>
      <h1 className='border-b w-full border-gray-100'>
        Account: <span className='text-blue-500'>Login</span>
      </h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 w-1/2 mx-auto'
      >
        <div>
          <label
            htmlFor='username'
            className='block text-sm font-medium text-gray-700'
          >
            Username
          </label>
          <input
            type='text'
            id='username'
            name='username'
            value={data.username}
            onChange={handleChange}
            className='border border-gray-300 focus:outline-0 text-sm rounded py-1 px-2 shadow-sm w-full'
            placeholder='Enter your username'
          />
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'
          >
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            value={data.password}
            onChange={handleChange}
            className='border border-gray-300 focus:outline-0 text-sm rounded py-1 px-2 shadow-sm w-full'
            placeholder='Enter your password'
          />
        </div>

        <button
          type='submit'
          className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none'
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
