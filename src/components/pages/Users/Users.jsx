import React, { useState, useEffect } from 'react'
import './Users.css'
import Loading from '../../common/Loading/Loading'

// Toast notification component
const Toast = ({ message, type, onClose }) => (
  <div className={`toast toast--${type}`}>
    {message}
    <button className="toast__close" onClick={onClose}>×</button>
  </div>
)

// Confirmation modal
const ConfirmBox = ({ message, onConfirm, onCancel }) => (
  <div className="confirm-modal">
    <div className="confirm-box">
      <p>{message}</p>
      <div className="confirm-actions">
        <button className="btn btn--danger" onClick={onConfirm}>Yes</button>
        <button className="btn" onClick={onCancel}>No</button>
      </div>
    </div>
  </div>
)

const Users = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [formMode, setFormMode] = useState('add')
  const [formUser, setFormUser] = useState({ name: '', email: '', role: '', status: 'active', id: null })
  const [toast, setToast] = useState(null)

  // Confirmation modal state
  const [showConfirm, setShowConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  // Toast helper
  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/users')
        const data = await res.json()
        setUsers(data)
      } catch (err) {
        showToast('Failed to fetch users.', 'error')
        console.error('Failed to fetch users:', err)
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = activeFilter === 'all' || user.status === activeFilter
    return matchesSearch && matchesFilter
  })

  // Add User
  const handleAddUser = () => {
    setFormMode('add')
    setFormUser({ name: '', email: '', role: '', status: 'active', id: null })
    setShowForm(true)
  }

  // Edit User
  const handleEditUser = (user) => {
    setFormMode('edit')
    setFormUser({ ...user })
    setShowForm(true)
  }

  // Open confirmation modal instead of window.confirm
  const handleDeleteUser = (user) => {
    setUserToDelete(user)
    setShowConfirm(true)
  }

  // Confirm Delete (real API call)
  const confirmDeleteUser = async () => {
    setLoading(true)
    try {
      await fetch('http://localhost:4000/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userToDelete.id }),
      })
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id))
      showToast(`User ${userToDelete.name} deleted.`, 'success')
    } catch (e) {
      showToast('Failed to delete user.', 'error')
      console.error('Failed to delete user:', e)
    }
    setLoading(false)
    setShowConfirm(false)
    setUserToDelete(null)
  }

  const cancelDeleteUser = () => {
    setShowConfirm(false)
    setUserToDelete(null)
  }

  // Save/Add/Edit user
  const saveUser = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formUser.email || !emailRegex.test(formUser.email)) {
      showToast('Please enter a valid email address.', 'error')
      return;
    }
    if (!formUser.name || !formUser.role) {
      showToast('Please fill all required fields.', 'error')
      return;
    }

    setLoading(true)
    try {
      if (formMode === 'add') {
        const res = await fetch('http://localhost:4000/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formUser),
        })
        const newUser = await res.json()
        setUsers(prev => [...prev, newUser])
        showToast('User added successfully!', 'success')
      } else { // edit
        const res = await fetch('http://localhost:4000/api/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formUser),
        })
        const updated = await res.json()
        setUsers(prev =>
          prev.map(user => user.id === updated.id ? { ...user, ...updated } : user)
        )
        showToast('User updated successfully!', 'success')
      }
      setShowForm(false)
    } catch (e) {
      showToast('Failed to save user.', 'error')
      console.error('Failed to save user:', e)
    }
    setLoading(false)
  }

  const closeForm = () => setShowForm(false)

  if (loading) {
    return (
      <div className="users-page">
        <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
          <Loading size={48} />
        </div>
      </div>
    )
  }

  return (
    <div className="users-page">
      {/* Toast notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Confirm delete modal */}
      {showConfirm && userToDelete && (
        <ConfirmBox
          message={`Are you sure you want to delete ${userToDelete.name}?`}
          onConfirm={confirmDeleteUser}
          onCancel={cancelDeleteUser}
        />
      )}

      <div className="users-header">
        <div>
          <h1 className="page-title">Users Management</h1>
          <p className="page-subtitle">Manage your team members and their permissions</p>
        </div>
        <button className="btn btn--primary" onClick={handleAddUser}>
          <span>➕</span> Add User
        </button>
      </div>

      <div className="users-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-large"
          />
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All ({users.length})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'active' ? 'active' : ''}`}
            onClick={() => setActiveFilter('active')}
          >
            Active ({users.filter(u => u.status === 'active').length})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'inactive' ? 'active' : ''}`}
            onClick={() => setActiveFilter('inactive')}
          >
            Inactive ({users.filter(u => u.status === 'inactive').length})
          </button>
        </div>
      </div>

      {/* Modal form for Add/Edit */}
      {showForm && (
        <div className="form-modal">
          <div className="form-box">
            <h2>{formMode === 'add' ? 'Add User' : 'Edit User'}</h2>
            <input
              type="text"
              placeholder="Name"
              value={formUser.name}
              onChange={e => setFormUser({ ...formUser, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formUser.email}
              onChange={e => setFormUser({ ...formUser, email: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Role"
              value={formUser.role}
              onChange={e => setFormUser({ ...formUser, role: e.target.value })}
              required
            />
            <select
              value={formUser.status}
              onChange={e => setFormUser({ ...formUser, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="form-actions">
              <button className="btn btn--primary" onClick={saveUser}>Save</button>
              <button className="btn" onClick={closeForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="users-grid">
        {filteredUsers.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-card__header">
              <div className="user-card__avatar" style={{ backgroundColor: user.avatar }}>
                {user.initials}
              </div>
              <span className={`status-badge status-badge--${user.status}`}>
                {user.status}
              </span>
            </div>
            <div className="user-card__body">
              <h3 className="user-card__name">{user.name}</h3>
              <p className="user-card__email">{user.email}</p>
              <p className="user-card__role">{user.role}</p>
            </div>
            <div className="user-card__footer">
              <button className="user-card__btn" onClick={() => handleEditUser(user)}>
                ✏️ Edit
              </button>
              <button className="user-card__btn user-card__btn--danger" onClick={() => handleDeleteUser(user)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Users
