import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Transactions.css'
import Loading from '../../common/Loading/Loading'

const API_URL = 'http://localhost:4000/api/transactions'

// Toast notification
const Toast = ({ message, type, onClose }) => (
  <AnimatePresence>
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      className={`toast toast--${type}`}
      style={{ position: 'fixed', top: 30, right: 30, zIndex: 9999 }}
    >
      {message}
      <button className="toast__close" onClick={onClose}>×</button>
    </motion.div>
  </AnimatePresence>
)

// ----------- Transaction Details Modal -----------
const TransactionModal = ({ transaction, onClose }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="form-modal"
      style={{ zIndex: 4000 }}
    >
      <div
        className="form-box"
        style={{
          minWidth: 340,
          maxWidth: '95vw',
          padding: '2.4rem 2.2rem',
          boxShadow: '0 2px 32px #0002'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.35rem' }}>
            <span style={{
              background: 'linear-gradient(90deg, #4361ee 60%, #b755f4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Transaction Details
            </span>
          </h2>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '1.7rem',
              color: '#888',
              cursor: 'pointer',
              marginLeft: 12,
              marginTop: -7
            }}
            aria-label="Close"
            title="Close"
          >×</button>
        </div>
        <div style={{
          background: 'var(--bg-secondary, #f8fafc)',
          padding: '1.1rem 1.15rem',
          borderRadius: 12,
          boxShadow: '0 2px 8px #0001',
          marginBottom: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.7rem 3rem' }}>
            <div>
              <div className="label">Transaction ID</div>
              <div className="value" style={{ color: '#4361ee', fontWeight: 800 }}>{transaction.id}</div>
            </div>
            <div>
              <div className="label">Customer</div>
              <div className="value">{transaction.customer}</div>
            </div>
            <div>
              <div className="label">Date & Time</div>
              <div className="value">{transaction.date}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.2rem 3rem' }}>
            <div>
              <div className="label">Amount</div>
              <div className="value" style={{ color: '#22c55e', fontWeight: 800 }}>${Number(transaction.amount).toFixed(2)}</div>
            </div>
            <div>
              <div className="label">Type</div>
              <span className={`type-badge type-badge--${transaction.type}`}>{transaction.type}</span>
            </div>
            <div>
              <div className="label">Status</div>
              <span className={`status-badge status-badge--${transaction.status}`}>{transaction.status}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </AnimatePresence>
)

// Edit Transaction Modal
const EditTransactionModal = ({ txForm, setTxForm, onSave, onCancel }) => {
  if (!txForm) return null; // safety

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Transaction</h2>

        {/* CUSTOMER */}
        <input
          type="text"
          placeholder="Customer"
          value={txForm.customer ?? ""}
          onChange={(e) =>
            setTxForm({ ...txForm, customer: e.target.value })
          }
        />

        {/* AMOUNT */}
        <input
          type="number"
          placeholder="Amount"
          value={txForm.amount ?? ""}
          onChange={(e) =>
            setTxForm({ ...txForm, amount: Number(e.target.value) })
          }
        />

        {/* TYPE */}
        <select
          value={txForm.type ?? "payment"}
          onChange={(e) =>
            setTxForm({ ...txForm, type: e.target.value })
          }
        >
          <option value="payment">Payment</option>
          <option value="refund">Refund</option>
        </select>

        {/* STATUS */}
        <select
          value={txForm.status ?? "pending"}
          onChange={(e) =>
            setTxForm({ ...txForm, status: e.target.value })
          }
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <div className="modal-actions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={() => onSave(txForm)}>Save</button>
        </div>
      </div>
    </div>
  );
};


const AddTransactionModal = ({ txForm, setTxForm, onSave, onCancel }) => (
  <AnimatePresence>
    <motion.div
      initial={{ scale: 0.93, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.93, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 330, damping: 31 }}
      className="form-modal"
    >
      <div className="form-box">
        <h2>Add Transaction</h2>
        <input
          type="text"
          placeholder="Customer"
          value={txForm.customer}
          onChange={e => setTxForm({ ...txForm, customer: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount"
          value={txForm.amount}
          onChange={e => setTxForm({ ...txForm, amount: e.target.value })}
        />
        <select
          value={txForm.type}
          onChange={e => setTxForm({ ...txForm, type: e.target.value })}
        >
          <option value="payment">Payment</option>
          <option value="refund">Refund</option>
        </select>
        <select
          value={txForm.status}
          onChange={e => setTxForm({ ...txForm, status: e.target.value })}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
        <div className="form-actions">
          <button className="btn btn--primary" onClick={onSave}>Save</button>
          <button className="btn" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </motion.div>
  </AnimatePresence>
)

const Transactions = () => {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [toast, setToast] = useState(null)
  const [detailTx, setDetailTx] = useState(null)
  const [showTxForm, setShowTxForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editTxForm, setEditTxForm] = useState(null)
  const [editId, setEditId] = useState(null)

  const [txForm, setTxForm] = useState({
    customer: '',
    amount: '',
    type: 'payment',
    status: 'pending',
  })

  // Toast helper
  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  // Load transactions
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const res = await fetch(API_URL)
        const data = await res.json()
        setTransactions(data)
      } catch (err) {
        showToast('Failed to fetch transactions.', 'error')
        console.error('Failed to fetch transactions:', err)
      } finally {
        setLoading(false)
      }
    }
    loadTransactions()
  }, [])

  if (loading) {
    return (
      <div className="transactions-page">
        <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
          <Loading size={48} />
        </div>
      </div>
    )
  }
  

  //--- Search filter
 const filteredTransactions = searchQuery.trim()
  ? transactions.filter(
      (tx) =>
        tx.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.status?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : transactions;

  // Revenue/pending summary
  const totalRevenue = filteredTransactions
    .filter(t => t.status === 'completed' && t.type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingAmount = filteredTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0)

  // Export to CSV
  const handleExport = () => {
    if (filteredTransactions.length === 0) {
      showToast('No transactions to export.', 'error')
      return
    }
    const csv =
      [
        ['ID', 'Date', 'Customer', 'Amount', 'Type', 'Status'],
        ...filteredTransactions.map(tx =>
          [
            tx.id,
            `"${tx.date}"`,
            `"${tx.customer}"`,
            tx.amount,
            tx.type,
            tx.status
          ]
        )
      ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    showToast('Transactions exported to CSV!', 'success')
  }

  // View transaction details
  const handleViewTransaction = (transaction) => {
    setDetailTx(transaction)
  }

  const closeTxModal = () => setDetailTx(null)

  // Add transaction
  const handleAddTransaction = () => {
    setTxForm({
      customer: '',
      amount: '',
      type: 'payment',
      status: 'pending',
    })
    setShowTxForm(true)
  }

  // Save new transaction
  const saveTransaction = async () => {
    if (!txForm.customer || !txForm.amount || isNaN(Number(txForm.amount))) {
      showToast('Enter customer and valid amount.', 'error')
      return
    }
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: txForm.customer,
          amount: Number(txForm.amount),
          type: txForm.type,
          status: txForm.status
        })
      })
      if (!res.ok) {
        const error = await res.json()
        showToast(error.error || 'Failed to add transaction', 'error')
        return
      }
      const newTx = await res.json()
      setTransactions(prev => [...prev, newTx])
      showToast('Transaction added!', 'success')
      setShowTxForm(false)
    } catch (err) {
      showToast('Failed to add transaction', 'error')
    }
  }

  // Edit transaction: open modal
  const handleEditTransaction = (tx) => {
    setEditTxForm(tx)
    setEditId(tx.id)
  }

  // Save edited transaction
  const saveEditTransaction = async () => {
    if (!editTxForm.customer || !editTxForm.amount || isNaN(Number(editTxForm.amount))) {
      showToast('Enter customer and valid amount.', 'error')
      return
    }
    try {
      const res = await fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: editTxForm.customer,
          amount: Number(editTxForm.amount),
          type: editTxForm.type,
          status: editTxForm.status
        })
      })
      if (!res.ok) {
        const error = await res.json()
        showToast(error.error || 'Failed to edit transaction', 'error')
        return
      }
      const updatedTx = await res.json()
      setTransactions(prev =>
        prev.map(tx => (tx.id === editId ? updatedTx : tx))
      )
      showToast('Transaction updated!', 'success')
      setEditTxForm(null)
      setEditId(null)
    } catch (err) {
      showToast('Failed to edit transaction', 'error')
    }
  }

  const closeEditModal = () => {
    setEditTxForm(null)
    setEditId(null)
  }

  return (
    <div className="transactions-page">
      {/* Search Input */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Search customer, ID, or status..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button className="btn btn--primary" onClick={handleExport}>
          <span>📥</span> Export
        </button>
        <button className="btn btn--success" onClick={handleAddTransaction}>
          <span>➕</span> Add Transaction
        </button>
      </div>

      {/* Toast */}
     {toast?.message && (
  <Toast
    message={toast.message}
    type={toast.type}
    onClose={() => setToast(null)}
  />
)}


      {/* Transaction details modal */}
      <AnimatePresence>
        {detailTx && (
          <TransactionModal transaction={detailTx} onClose={closeTxModal} />
        )}
      </AnimatePresence>

      {/* Add Transaction modal */}
      <AnimatePresence>
        {showTxForm && (
          <AddTransactionModal
            txForm={txForm}
            setTxForm={setTxForm}
            onSave={saveTransaction}
            onCancel={() => setShowTxForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Edit Transaction modal */}
      <AnimatePresence>
        {editTxForm && (
          <EditTransactionModal
            txForm={editTxForm}
            setTxForm={setEditTxForm}
            onSave={saveEditTransaction}
            onCancel={closeEditModal}
          />
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="transactions-stats">
        <div className="stat-box stat-box--primary">
          <div className="stat-box__icon">💰</div>
          <div className="stat-box__info">
            <h3>Total Revenue</h3>
            <p>${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className="stat-box stat-box--warning">
          <div className="stat-box__icon">⏳</div>
          <div className="stat-box__info">
            <h3>Pending</h3>
            <p>${pendingAmount.toFixed(2)}</p>
          </div>
        </div>
        <div className="stat-box stat-box--success">
          <div className="stat-box__icon">✅</div>
          <div className="stat-box__info">
            <h3>Completed</h3>
            <p>{filteredTransactions.filter(t => t.status === 'completed').length}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="transactions-table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date & Time</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td className="transaction-id">{transaction.id}</td>
                <td>{transaction.date}</td>
                <td>{transaction.customer}</td>
                <td className="transaction-amount">
                  ${transaction.amount.toFixed(2)}
                </td>
                <td>
                  <span className={`type-badge type-badge--${transaction.type}`}>
                    {transaction.type}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-badge--${transaction.status}`}>
                    {transaction.status}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="action-btn view-btn" onClick={() => handleViewTransaction(transaction)}>
                      👁️ View
                    </button>
                    <button className="action-btn edit-btn" onClick={() => handleEditTransaction(transaction)}>
                      ✏️ Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Transactions
