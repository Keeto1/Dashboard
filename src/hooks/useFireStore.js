import { useState, useEffect } from 'react'
import { getUsers, createUser } from '../services/users'
import { getTransactions, createTransaction } from '../services/transactions'
import { getActivities } from '../services/dashboard'

// Lightweight hook to fetch collections from backend.
// Note: addDocument will call the create* service when available.
export const useFirestore = (collectionName) => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      try {
        let data = []
        if (collectionName === 'users') data = await getUsers()
        else if (collectionName === 'transactions') data = await getTransactions()
        else if (collectionName === 'activities') data = await getActivities()
        else data = []

        if (!mounted) return
        setDocuments(data || [])
      } catch (err) {
        console.error('useFirestore load error:', err)
        if (!mounted) return
        setError(err.message || 'Failed to load')
        setDocuments([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [collectionName])

  const addDocument = async (document) => {
    try {
      let newDoc = null
      if (collectionName === 'users') newDoc = await createUser(document)
      else if (collectionName === 'transactions') newDoc = await createTransaction(document)
      else throw new Error('Add not implemented for this collection')

      setDocuments(prev => [newDoc, ...prev])
      return newDoc
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return { documents, loading, error, addDocument }
}