import React from 'react'
import './Sidebar.css'

const Sidebar = ({ isOpen, onClose, isMobile, currentPage, onNavigate }) => {
  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Analytics', icon: '📈' },
    { name: 'Users', icon: '👥' },
    { name: 'Transactions', icon: '💳' },
    { name: 'Settings', icon: '⚙️' },
  ]

  const handleClick = (pageName) => {
    onNavigate(pageName)
  }

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          {isMobile && (
            <button className="close-button" onClick={onClose}>
              ✕
            </button>
          )}
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleClick(item.name)}
                  className={`sidebar-link ${currentPage === item.name ? 'sidebar-link--active' : ''}`}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-text">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
