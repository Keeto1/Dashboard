// EXAMPLE: Users page using Firebase
// Replace your current Users.jsx with this to use Firebase

import React, { useState, useEffect } from 'react'
import './Users.css'
import Loading from '../../common/Loading/Loading'
import { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  subscribeToUsers 
} from '../../../services/firestore/users'

const UsersFirebase = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  // Load users from Firebase on mount
  useEffect(() => {
    loadUsers()
  }, [])

  // Option 1: Load once (when page loads)
  const loadUsers = async () => {
    try {
      setLoading(true)
      const usersData = await getUsers()
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading users:', error)
      alert('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  // Option 2: Real-time updates (automatically refreshes)
  // Uncomment this to use real-time instead of loadUsers
  /*
  useEffect(() => {
    setLoading(true)
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToUsers((usersData) => {
      setUsers(usersData)
      setLoading(false)
    })
    
    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])
  */

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = activeFilter === 'all' || user.status === activeFilter
    
    return matchesSearch && matchesFilter
  })

  // ADD USER - Sends to Firebase
  const handleAddUser = async () => {
    const name = prompt('Enter user name:')
    const email = prompt('Enter user email:')
    const role = prompt('Enter user role:')
    
    if (!name || !email || !role) {
      alert('All fields required')
      return
    }

    try {
      const newUser = {
        name,
        email,
        role,
        status: 'active',
        initials: name.split(' ').map(n => n[0]).join('').toUpperCase(),
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
      }

      // 🔥 Send to Firebase!
      await createUser(newUser)
      
      alert('User created successfully!')
      
      // Reload users
      loadUsers()
      
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Failed to create user: ' + error.message)
    }
  }

  // EDIT USER - Updates in Firebase
  const handleEditUser = async (user) => {
    const name = prompt('Enter new name:', user.name)
    const role = prompt('Enter new role:', user.role)
    
    if (!name || !role) return

    try {
      // 🔥 Update in Firebase!
      await updateUser(user.id, {
        name,
        role
      })
      
      alert('User updated successfully!')
      loadUsers()
      
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Failed to update user: ' + error.message)
    }
  }

  // DELETE USER - Removes from Firebase
  const handleDeleteUser = async (user) => {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return

    try {
      // 🔥 Delete from Firebase!
      await deleteUser(user.id)
      
      alert('User deleted successfully!')
      loadUsers()
      
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user: ' + error.message)
    }
  }

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
      <div className="users-header">
        <div>
          <h1 className="page-title">Users Management</h1>
          <p className="page-subtitle">Manage your team members (Firebase)</p>
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

      <div className="users-grid">
        {filteredUsers.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
            <p>No users found. Click "Add User" to create one!</p>
          </div>
        ) : (
          filteredUsers.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-card__header">
                <div className="user-card__avatar" style={{ backgroundColor: user.color || '#4361ee' }}>
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
          ))
        )}
      </div>
    </div>
  )
}

export default UsersFirebase
