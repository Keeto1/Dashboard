import React, { useState } from 'react'
import './Settings.css'

const Settings = ({ theme, onToggleTheme }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    autoSave: true,
    language: 'en',
    timezone: 'UTC',
  })

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSelect = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveChanges = () => {
    alert('Settings saved successfully!')
    console.log('Saved settings:', settings)
    // TODO: Implement actual save to backend/localStorage
  }

  const handleDeleteAccount = () => {
    const confirmed = confirm('⚠️ WARNING: This will permanently delete your account and all data. This action cannot be undone.\n\nAre you absolutely sure?')
    if (confirmed) {
      const doubleConfirm = confirm('Type DELETE to confirm account deletion')
      if (doubleConfirm) {
        alert('Account deletion initiated. You will be logged out.')
        // TODO: Implement actual account deletion
      }
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your preferences and account settings</p>
        </div>
        <button className="btn btn--primary" onClick={handleSaveChanges}>
          <span>💾</span> Save Changes
        </button>
      </div>

      <div className="settings-grid">
        <div className="settings-section">
          <h2 className="settings-section__title">Notifications</h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-item__info">
                <h3>Push Notifications</h3>
                <p>Receive push notifications for important updates</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={() => handleToggle('notifications')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-item__info">
                <h3>Email Alerts</h3>
                <p>Get email notifications for account activity</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={() => handleToggle('emailAlerts')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="settings-section__title">Appearance</h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-item__info">
                <h3>Dark Mode</h3>
                <p>Switch between light and dark theme</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={theme === 'dark'}
                  onChange={onToggleTheme}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-item__info">
                <h3>Language</h3>
                <p>Choose your preferred language</p>
              </div>
              <select
                className="setting-select"
                value={settings.language}
                onChange={(e) => handleSelect('language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="settings-section__title">Account</h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-item__info">
                <h3>Auto Save</h3>
                <p>Automatically save changes as you work</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={() => handleToggle('autoSave')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-item__info">
                <h3>Timezone</h3>
                <p>Set your local timezone</p>
              </div>
              <select
                className="setting-select"
                value={settings.timezone}
                onChange={(e) => handleSelect('timezone', e.target.value)}
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
                <option value="GMT">GMT</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-section settings-section--danger">
          <h2 className="settings-section__title">Danger Zone</h2>
          <div className="settings-list">
            <div className="danger-item">
              <div>
                <h3>Delete Account</h3>
                <p>Permanently delete your account and all data</p>
              </div>
              <button className="btn btn--danger" onClick={handleDeleteAccount}>
                🗑️ Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
