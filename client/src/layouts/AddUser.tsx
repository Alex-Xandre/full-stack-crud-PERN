import React, { useEffect, useState } from 'react';
import { useUserStore } from '../store/user-store';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const [formData, setFormData] = useState<Partial<User>>();
  const [photo, setPhoto] = useState<File | null | undefined>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const inputFields = [
    { label: 'Country', type: 'select', name: 'country', options: ['--', 'Philippines', 'USA', 'Canada'] },
    { label: 'Account Type', type: 'select', name: 'type', options: ['--', 'Team Member', 'System Administrator'] },
    { label: 'Username', type: 'text', name: 'username' },
    {
      label: 'Last Name',
      type: 'text',
      name: 'lastname',
      transform: (value: string) => {
        const parts = value.split(' ');
        return parts.length > 1 ? parts.slice(1).join(' ') : '';
      },
    },
    { label: 'First Name', type: 'text', name: 'firstname', transform: (value: string) => value.split(' ')[0] || '' },
    { label: 'Email Address', type: 'email', name: 'email' },
    { label: 'Contact Number', type: 'tel', name: 'contact' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhoto(null);
      setPhotoPreview(null);
    }
  };

  const { fetchUsers, users, saveUser } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get('id');

  useEffect(() => {
    if (userId) {
      const user = users.find((user) => user.id === parseInt(userId));
      console.log(user);
      if (user) {
        setFormData(user);
        if (user.photo_url) {
          setPhotoPreview(user.photo_url as unknown as string);
        }
      }
    }
  }, [users]);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      await saveUser({ ...formData, photo_url: photo });
      alert(`User ${userId ? 'Updated' : 'Created'}  successfully!`);
      navigate(-1);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Error saving user.');
    }
  };

  return (
    <div className='w-full overflow-hidden p-6 flex flex-col gap-4'>
      <h1 className='border-b w-full border-gray-100'>
        Account:<span className='text-blue-500'>{userId ? 'Update' : 'Add'} Record</span>
      </h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 w-1/2 mx-auto '
      >
        {inputFields.map((field) => (
          <div
            key={field.name}
            className='flex flex-col gap-1'
          >
            <label
              htmlFor={field.name}
              className='text-sm font-medium text-gray-700'
            >
              {field.label}
              {field.label !== 'Photo' && <span className='text-red-500'>*</span>}
            </label>
            {field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                value={formData?.[field.name]}
                onChange={handleChange}
                className='border border-gray-300 focus:outline-0 text-sm rounded py-1 px-2 shadow-sm'
              >
                {field.options?.map((option) => (
                  <option
                    key={option}
                    value={option}
                    disabled={option === '--'}
                  >
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                id={field.name}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                value={formData?.[field.name]}
                name={field.name}
                onChange={handleChange}
                className='border border-gray-300 focus:outline-0 text-sm rounded py-1 px-2 shadow-sm'
                {...(field.transform && {
                  onBlur: (e) => {
                    const transformedValue = field.transform(e.target.value);
                    setFormData((prevData) => ({ ...prevData, [field.name]: transformedValue }));
                  },
                })}
              />
            )}
          </div>
        ))}

        <div className='flex flex-col gap-1'>
          <label
            htmlFor='photo'
            className='text-sm font-medium text-gray-700'
          >
            Photo (optional)
          </label>
          <div className='flex items-center gap-2 flex-col w-full'>
            <input
              type='file'
              id='photo'
              accept='image/*'
              onChange={handleFileChange}
              className='border border-gray-300 focus:outline-0 text-sm w-full rounded py-1 px-2 shadow-sm'
            />
            {photoPreview && (
              <div className='rounded-full overflow-hidden w-10 h-10'>
                <img
                  src={photoPreview}
                  alt='Photo Preview'
                  className='w-24  object-cover'
                />
              </div>
            )}
            {!photoPreview && <span className='text-gray-500 text-sm'>No file chosen</span>}
          </div>
          {photoPreview && <p className='text-gray-500 text-xs mt-1'>Photo Uploaded</p>}
        </div>

        <button
          type='submit'
          className='mt-2 bg-sky-600 uppercase px-2 py-1 w-fit items-center gap-2 rounded-sm mx-auto text-white inline-flex'
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddUser;
