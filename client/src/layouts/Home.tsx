import { useEffect } from 'react';
import { useUserStore } from '../store/user-store';
import { Table } from './Table';
import { PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { fetchUsers, users } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const navigate = useNavigate();
  return (
    <div className='w-screen overflow-hidden  p-12 flex flex-col'>
      <h1 className='border-b w-full border-gray-100'>
        Employee:<span className='text-blue-500'>Records</span>
      </h1>
      <button
        className='mt-2 bg-sky-600 uppercase p-2 w-fit items-center gap-2 rounded-sm self-end inline-flex'
        onClick={() => navigate('new')}
      >
        <span className='!bg-white p-h-fit flex rounded-xs '>
          <PlusIcon className='h-3 w-3' />
        </span>
        <span className='text-white text-xs'> Add Employee</span>
      </button>
      <Table data={users} />
    </div>
  );
};
export default Home;
