import { useState, useEffect } from 'react'

function useLocalStorage(key, initialValue) {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = window.localStorage.getItem(key)
			return item ? JSON.parse(item) : (typeof initialValue === 'function' ? initialValue() : initialValue)
		} catch (error) {
			// If access to localStorage is blocked, fall back to initial value
			return typeof initialValue === 'function' ? initialValue() : initialValue
		}
	})

	useEffect(() => {
		try {
			window.localStorage.setItem(key, JSON.stringify(storedValue))
		} catch (error) {
			// Ignore write errors (e.g., storage full or disabled)
		}
	}, [key, storedValue])

	return [storedValue, setStoredValue]
}

export { useLocalStorage }
export default useLocalStorage
