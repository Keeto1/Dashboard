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
  const [formUser, setFormUser] = useState({
    name: '',
    email: '',
    role: '',
    status: 'active',
    _id: null
  })
  const [toast, setToast] = useState(null)

  const [showConfirm, setShowConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  // Toast helper
  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  // Generate avatar + initials
  const enhanceUser = (user) => {
    const initials = user.name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()

    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`

    return {
      ...user,
      initials,
      avatar: randomColor
    }
  }

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/users')
        const data = await res.json()

        // Add avatar + initials to every user in frontend only
        setUsers(data.map(u => enhanceUser(u)))
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
    setFormUser({
      name: '',
      email: '',
      role: '',
      status: 'active',
      _id: null
    })
    setShowForm(true)
  }

  // Edit User
  const handleEditUser = (user) => {
    setFormMode('edit')
    setFormUser(user)
    setShowForm(true)
  }

  // Delete (open modal)
  const handleDeleteUser = (user) => {
    setUserToDelete(user)
    setShowConfirm(true)
  }

  // Confirm Delete → REAL API call
  const confirmDeleteUser = async () => {
    setLoading(true)
    try {
      await fetch('http://localhost:4000/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userToDelete._id })
      })

      setUsers(prev => prev.filter(u => u._id !== userToDelete._id))

      showToast(`User deleted successfully.`, 'success')
    } catch (e) {
      showToast('Failed to delete user.', 'error')
      console.error('Delete error:', e)
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
    if (!formUser.email || !formUser.name || !formUser.role) {
      showToast('All fields are required.', 'error')
      return
    }

    setLoading(true)
    try {
      if (formMode === 'add') {
        const res = await fetch('http://localhost:4000/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formUser)
        })

        const newUser = await res.json()
        setUsers(prev => [...prev, enhanceUser(newUser)])

        showToast('User added successfully!', 'success')
      } else {
        const res = await fetch('http://localhost:4000/api/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formUser)
        })

        const updated = await res.json()

        setUsers(prev =>
          prev.map(u => (u._id === updated._id ? enhanceUser(updated) : u))
        )

        showToast('User updated successfully!', 'success')
      }

      setShowForm(false)
    } catch (e) {
      showToast('Failed to save user.', 'error')
      console.error('Save error:', e)
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
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {showConfirm && (
        <ConfirmBox
          message={`Are you sure you want to delete ${userToDelete?.name}?`}
          onConfirm={confirmDeleteUser}
          onCancel={cancelDeleteUser}
        />
      )}

      <div className="users-header">
        <div>
          <h1 className="page-title">Users Management</h1>
          <p className="page-subtitle">Manage your team</p>
        </div>

        <button className="btn btn--primary" onClick={handleAddUser}>
          ➕ Add User
        </button>
      </div>

      <div className="users-controls">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input-large"
        />

        <div className="filter-buttons">
          <button className={activeFilter === 'all' ? 'active filter-btn' : 'filter-btn'} onClick={() => setActiveFilter('all')}>
            All ({users.length})
          </button>

          <button className={activeFilter === 'active' ? 'active filter-btn' : 'filter-btn'} onClick={() => setActiveFilter('active')}>
            Active ({users.filter(u => u.status === 'active').length})
          </button>

          <button className={activeFilter === 'inactive' ? 'active filter-btn' : 'filter-btn'} onClick={() => setActiveFilter('inactive')}>
            Inactive ({users.filter(u => u.status === 'inactive').length})
          </button>
        </div>
      </div>

      {/* Form modal */}
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
          <div key={user._id} className="user-card">
            <div className="user-card__header">
              <div
                className="user-card__avatar"
                style={{ backgroundColor: user.avatar }}
              >
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
