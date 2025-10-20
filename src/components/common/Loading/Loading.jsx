import React from 'react'

const Loading = ({ size = 40 }) => {
  const style = {
    width: size,
    height: size,
    borderRadius: '50%',
    border: '4px solid rgba(0,0,0,0.08)',
    borderTopColor: 'rgba(0,0,0,0.6)',
    animation: 'spin 1s linear infinite',
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={style} aria-label="Loading" />
      <style>{`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
    </div>
  )
}

export default Loading
