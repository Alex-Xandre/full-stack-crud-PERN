import React from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { User } from '../types';
import { ChevronDown, ChevronsUpDown, ChevronUp, Edit2Icon, TrashIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/user-store';

export function Table({ data }: { data: User[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState('');
  const [entriesPerPage, setEntriesPerPage] = React.useState(10);

  const nav = useNavigate();
  const { deleteUser } = useUserStore();
  const columns = React.useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'photo_url',
        header: 'PHOTO',
        cell: (info) => (
          <img
            src={
              (info.getValue() as string) ||
              'https://res.cloudinary.com/dgb3br9x6/image/upload/v1745497170/wew_sigtr3.png'
            }
            alt='User Photo'
            className='h-24'
          />
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => {
          const { firstname, lastname } = info.row.original;

          return `${firstname} ${lastname}`;
        },
      },
      {
        accessorKey: 'username',
        header: 'Username',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'country',
        header: 'Country',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => info.getValue(),
      },

      {
        accessorKey: 'type',
        header: 'Type',
        cell: (info) => info.getValue(),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className='flex gap-2'>
            <button
              className='px-1 py-2 bg-yellow-500 text-white rounded'
              onClick={() => nav(`/new?id=${info.row.original.id}`)}
            >
              <Edit2Icon className='h-3' />
            </button>
            <button
              className='px-1 py-2 bg-red-500 text-white rounded'
              onClick={async () => {
                const confirmed = window.confirm('Are you sure you want to delete this user?');
                if (confirmed) {
                  try {
                    await deleteUser(info.row.original.id as number);
                    alert('User deleted successfully!');
                  } catch (err) {
                    console.error('Save failed:', err);
                    alert('Error deleting user.');
                  }
                }
              }}
            >
              <TrashIcon className='h-3' />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const filteredData = React.useMemo(() => {
    if (!search) return data;
    return data.filter((row) => {
      return Object.values(row).some((value) => String(value).toLowerCase().includes(search.toLowerCase()));
    });
  }, [data, search]);

  const table = useReactTable({
    columns,
    data: filteredData,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className='p-4 border border-gray-200 shadow mt-3 rounded-sm wfull'>
      <div className='flex justify-between items-center mb-4'>
        <div className='inline-flex items-center gap-3 text-sm'>
          <p> Show</p>
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className='p-1 border border-gray-300 rounded'
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>{' '}
          <p> Entries</p>
        </div>

        <div>
          <label className='text-sm'>Search: </label>
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='border border-gray-300 focus:outline-0 text-sm rounded py-1 px-2 shadow-sm'
          />
        </div>
      </div>
      <table className='w-full'>
        <thead className='border-t border-t-black shadow sticky top-0'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  <span
                    className={`${
                      header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                    }  p-2  justify-between flex-shrink border border-gray-200 flex items-center uppercase text-xs`}
                    onClick={header.column.getToggleSortingHandler()}
                    title={
                      header.column.getCanSort()
                        ? header.column.getNextSortingOrder() === 'asc'
                          ? 'Sort ascending'
                          : 'Sort descending'
                        : undefined
                    }
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === 'desc' ? (
                        <ChevronUp className='h-4' />
                      ) : (
                        <ChevronDown className='h-4' />
                      )
                    ) : (
                      <ChevronsUpDown className='h-4' />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table
            .getRowModel()
            .rows.slice(0, entriesPerPage)
            .map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className='p-2 border border-gray-200'
                    style={{ verticalAlign: 'top' }}
                  >
                    <span className=''>{flexRender(cell.column.columnDef.cell, cell.getContext())}</span>
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
