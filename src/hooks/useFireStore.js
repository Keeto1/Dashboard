import { useState, useEffect } from 'react';
import { users as mockUsers, transactions as mockTransactions, activities as mockActivities } from '../mock/data'

export const useFirestore = (collectionName) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let data = []
    if (collectionName === 'users') data = mockUsers
    else if (collectionName === 'transactions') data = mockTransactions
    else if (collectionName === 'activities') data = mockActivities
    else data = []

    setDocuments(data)
    setLoading(false)
  }, [collectionName])

  const addDocument = async (document) => {
    try {
      const newDoc = { id: String(Date.now()), ...document }
      if (collectionName === 'users') mockUsers.unshift(newDoc)
      else if (collectionName === 'transactions') mockTransactions.unshift(newDoc)
      else if (collectionName === 'activities') mockActivities.unshift(newDoc)
      setDocuments(prev => [newDoc, ...prev])
      return newDoc
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return { documents, loading, error, addDocument };
};