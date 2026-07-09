import { useState, useEffect } from 'react';
import { Search, Shield, Loader2, Trash2, ChevronDown } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import userService from '../../services/userService';
import type { User } from '../../types';
import useAuthStore from '../../store/useAuthStore';

const ROLE_STYLES: Record<string, string> = {
  Admin: 'bg-red-100 text-red-700',
  Pastor: 'bg-purple-100 text-purple-700',
  Editor: 'bg-blue-100 text-blue-700',
  Member: 'bg-slate-100 text-slate-600',
  Visitor: 'bg-green-100 text-green-700',
};

const ROLES = ['Admin', 'Pastor', 'Editor', 'Member', 'Visitor'];

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user: currentUser } = useAuthStore();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await userService.getAll();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await userService.updateRole(id, role);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: role as User['role'] } : u))
      );
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userService.remove(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const filtered = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      header: 'Member',
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-800">
              {user.firstName} {user.lastName}
              {user._id === currentUser?._id && (
                <span className="ml-2 text-xs text-slate-400">(you)</span>
              )}
            </p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user: User) => (
        <div className="relative inline-block">
          <select
            value={user.role}
            onChange={(e) => handleRoleChange(user._id, e.target.value)}
            disabled={user._id === currentUser?._id}
            className={`text-xs font-bold pl-3 pr-7 py-1.5 rounded-full border-0 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70 ${ROLE_STYLES[user.role] || 'bg-slate-100 text-slate-600'}`}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (user: User) => (
        <span className="text-slate-500">
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: User) => (
        <button
          onClick={() => handleDelete(user._id)}
          disabled={user._id === currentUser?._id}
          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title={user._id === currentUser?._id ? 'Cannot delete your own account' : 'Delete user'}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-800">Manage Members</h2>
          <p className="text-sm text-slate-500">{users.length} total members</p>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-slate-500">Admin Only</span>
        </div>
      </div>

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

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} emptyMessage="No members found." />
      )}
    </div>
  );
};

export default ManageUsers;
