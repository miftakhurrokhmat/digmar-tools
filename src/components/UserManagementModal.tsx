'use client';

import { useState, useEffect } from 'react';
import { X, Trash2, Pencil, UserPlus, Shield, User } from 'lucide-react';

interface AccountUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UserManagementModal({
  isOpen,
  onClose,
  currentUserId,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}) {
  const [users, setUsers] = useState<AccountUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [editUser, setEditUser] = useState<AccountUser | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MARKETING');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setEditUser(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('MARKETING');
    setErrorMsg('');
  };

  const handleEditClick = (u: AccountUser) => {
    setEditUser(u);
    setName(u.name);
    setEmail(u.email);
    setPassword('');
    setRole(u.role);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const url = editUser ? `/api/users/${editUser.id}` : '/api/users';
    const method = editUser ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();
    if (res.ok) {
      fetchUsers();
      resetForm();
    } else {
      setErrorMsg(data.error || 'Gagal menyimpan user');
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Hapus akun ${userName}?`)) return;

    const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok) {
      fetchUsers();
    } else {
      alert(data.error || 'Gagal menghapus');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Kelola Akun (Admin & Marketing)
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-6">
          <form
            onSubmit={handleSubmit}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-1.5">
              {editUser ? <Pencil className="w-3.5 h-3.5 text-blue-500" /> : <UserPlus className="w-3.5 h-3.5 text-emerald-500" />}
              {editUser ? 'Ubah Data Akun' : 'Tambah Akun Baru'}
            </h3>

            {errorMsg && <p className="text-xs text-red-500 mb-2 font-medium">{errorMsg}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-medium text-slate-500">Nama Lengkap</label>
                <input
                  required
                  placeholder="Nama Lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 border p-2 rounded text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-500">Email Login</label>
                <input
                  required
                  type="email"
                  placeholder="nama@digmar.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 border p-2 rounded text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-500">
                  {editUser ? 'Password Baru (Kosongkan jika tidak diubah)' : 'Password'}
                </label>
                <input
                  required={!editUser}
                  type="password"
                  placeholder={editUser ? '••••••••' : 'Minimal 6 karakter'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 border p-2 rounded text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-500">Role Akses</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full mt-1 border p-2 rounded text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                >
                  <option value="MARKETING">MARKETING</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-3">
              {editUser && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 dark:text-slate-300 rounded"
                >
                  Batal Ubah
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
              >
                {editUser ? 'Simpan Perubahan' : 'Buat Akun'}
              </button>
            </div>
          </form>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 mb-2">
              Daftar Pengguna Aktif ({users.length})
            </h3>

            {loading ? (
              <p className="text-xs text-slate-400 py-4 text-center">Memuat daftar akun...</p>
            ) : (
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {u.name}{' '}
                          {u.id === currentUserId && (
                            <span className="text-[10px] text-blue-500 font-normal">(Anda)</span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {u.role}
                      </span>

                      <button
                        onClick={() => handleEditClick(u)}
                        className="p-1 text-slate-400 hover:text-blue-600 transition"
                        title="Edit Akun"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {u.id !== currentUserId && (
                        <button
                          onClick={() => handleDelete(u.id, u.name)}
                          className="p-1 text-slate-400 hover:text-red-600 transition"
                          title="Hapus Akun"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
