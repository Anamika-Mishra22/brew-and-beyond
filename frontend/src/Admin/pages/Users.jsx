import React, { useState, useEffect } from 'react';
import { FaTrash, FaUsers, FaSync, FaShieldAlt } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Users List
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Network Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Delete User Handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          alert('User removed successfully!');
          fetchUsers(); // Refresh list after deletion
        } else {
          alert(data.message || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans text-[#3a200a] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#c4a98a]/60 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#4a2c11] text-[#f7ebd9] flex items-center justify-center text-xl shadow-md border border-[#c4a98a]/40">
            <FaUsers />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-[#2e1806] font-normal tracking-wide">
              User Management 
            </h1>
            <p className="text-xs sm:text-sm text-[#52371e] mt-0.5">
              Brew & Beyond registered users and administrators
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] px-4 py-2.5 rounded-lg text-xs font-medium transition-all shadow-md flex items-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <FaSync className={loading ? 'animate-spin' : ''} /> Refresh List
          </button>
          
          <div className="bg-[#e4cfb6] border border-[#c4a98a] text-[#2e1806] px-4 py-2.5 rounded-lg text-xs font-bold shadow-sm">
            Total Users: {users.length}
          </div>
        </div>
      </div>

      {/* Table UI */}
      {loading ? (
        <div className="text-center py-24 text-[#613e1c] font-serif text-sm animate-pulse">
          Loading Users data...
        </div>
      ) : (
        <div className="bg-[#e4cfb6] border border-[#c4a98a] rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#d8c3ab] text-[#2e1806] text-xs uppercase font-serif font-bold border-b border-[#c4a98a]">
                <th className="p-4">Users Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c4a98a]/40 text-xs sm:text-sm text-[#3a200a]">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-[#52371e] font-serif">
                    No Users registered yet.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-[#f0e2d1]/60 transition-all">
                    <td className="p-4 font-bold font-serif text-[#2e1806]">{user.name || 'N/A'}</td>
                    <td className="p-4 text-[#52371e]">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-900 border-purple-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        {user.role || 'Users'}
                      </span>
                    </td>
                    <td className="p-4 text-[#613e1c] text-xs">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1 shadow-sm"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;