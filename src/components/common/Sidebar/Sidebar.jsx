import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { name: 'Analytics', icon: '📈', path: '/analytics' },
    { name: 'Users', icon: '👥', path: '/users' },
    { name: 'Transactions', icon: '💳', path: '/transactions' },
    { name: 'Settings', icon: '⚙️', path: '/settings' },
  ]

  const handleClick = (path) => {
    navigate(path)

    // auto-close sidebar on mobile
    if (isMobile) onClose()
  }

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar-header">
        <h2>Menu</h2>
        {isMobile && (
          <button className="close-button" onClick={onClose}>✕</button>
        )}
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path

            return (
              <li key={index}>
                <button
                  onClick={() => handleClick(item.path)}
                  className={`sidebar-link ${
                    isActive ? 'sidebar-link--active' : ''
                  }`}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-text">{item.name}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
