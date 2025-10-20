import React, { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../config/firebase'

export default function QuickTest() {
  const [text, setText] = useState('')
  const [status, setStatus] = useState(null)

  const handleSave = async () => {
    if (!text.trim()) {
      setStatus('Please type something first')
      return
    }

    setStatus('Saving...')
    try {
      const colRef = collection(db, 'dev_inputs')
      const docRef = await addDoc(colRef, {
        text: text.trim(),
        createdAt: serverTimestamp(),
        source: 'quicktest'
      })
      setStatus(`Saved (id: ${docRef.id})`)
      setText('')
    } catch (err) {
      console.error('QuickTest save error:', err)
      setStatus(`Error: ${err.message || err}`)
    }
  }

  return (
    <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 12 }}>
      <h3 style={{ margin: '0 0 8px 0' }}>Quick test: write to Firestore</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
        placeholder="Type something and click Save"
      />
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <button onClick={handleSave}>Save</button>
        <button onClick={() => { setText(''); setStatus(null) }}>Clear</button>
        <div style={{ marginLeft: 'auto', alignSelf: 'center' }}>{status}</div>
      </div>
    </div>
  )
}
