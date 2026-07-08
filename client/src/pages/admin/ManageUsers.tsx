import { useState } from 'react';
import { Search, MoreHorizontal, Shield } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';

// Placeholder users — will be replaced with API data
const PLACEHOLDER_USERS = [
  { _id: '1', firstName: 'Joel', lastName: 'Tamon', email: 'joel@lrt.church', role: 'Admin', createdAt: '2025-01-15' },
  { _id: '2', firstName: 'Grace', lastName: 'Munyoh', email: 'grace@lrt.church', role: 'Pastor', createdAt: '2025-02-10' },
  { _id: '3', firstName: 'Michael', lastName: 'Ndi', email: 'michael@lrt.church', role: 'Editor', createdAt: '2025-03-20' },
  { _id: '4', firstName: 'Sarah', lastName: 'Fon', email: 'sarah@lrt.church', role: 'Member', createdAt: '2025-04-05' },
  { _id: '5', firstName: 'Daniel', lastName: 'Nji', email: 'daniel@lrt.church', role: 'Member', createdAt: '2025-05-12' },
  { _id: '6', firstName: 'Esther', lastName: 'Che', email: 'esther@lrt.church', role: 'Member', createdAt: '2025-06-01' },
];

const ROLE_STYLES: Record<string, string> = {
  Admin: 'bg-red-100 text-red-700',
  Pastor: 'bg-purple-100 text-purple-700',
  Editor: 'bg-blue-100 text-blue-700',
  Member: 'bg-slate-100 text-slate-600',
};

const ManageUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = PLACEHOLDER_USERS.filter(
    (u) =>
      u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      header: 'Member',
      render: (user: typeof PLACEHOLDER_USERS[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user: typeof PLACEHOLDER_USERS[0]) => (
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${ROLE_STYLES[user.role]}`}>
          {user.role}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (user: typeof PLACEHOLDER_USERS[0]) => (
        <span className="text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-800">Manage Members</h2>
          <p className="text-sm text-slate-500">{PLACEHOLDER_USERS.length} total members</p>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-slate-500">Admin Only</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search members by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
        />
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filteredUsers} emptyMessage="No members found." />
    </div>
  );
};

export default ManageUsers;
