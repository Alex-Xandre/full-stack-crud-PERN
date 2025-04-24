/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { User } from './types';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const storage = sessionStorage.getItem('token');
  if (storage) {
    return {
      Authorization: `Bearer ${storage}`,
    };
  }
  return {};
};

console.log(getAuthHeaders())

export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const saveUser = async (user: User): Promise<User> => {
  const formData = new FormData();

  formData.append('username', user.username);
  formData.append('lastname', user.username);
  formData.append('firstname', user.lastname);
  formData.append('country', user.country);
  formData.append('contact', user.contact);
  formData.append('email', user.email);
  formData.append('type', user.type);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (typeof user.photo_url !== 'string') formData.append('photo', user.photo_url as File);

  const method = user.id ? 'put' : 'post';
  const url = user.id ? `${API_URL}/${user.id}` : `${API_URL}`;

  const response = await axios({
    method,
    url,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...getAuthHeaders(),
    },
  });

  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
};

export const loginUser = async (username: string, password: string): Promise<void> => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });

    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};
