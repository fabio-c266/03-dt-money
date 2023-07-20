import { ReactNode, useCallback, useEffect, useState } from 'react'
import { createContext } from 'use-context-selector'
import { api } from '../lib/api'

interface Transaction {
  id: string
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  created_at: string
}

interface CreateTransactionProps {
  description: string
  price: number
  category: string
  type: 'income' | 'outcome'
}

interface TransactionsContextType {
  transactions: Transaction[]
  createTransaction: (data: CreateTransactionProps) => Promise<void>
  fetchTransactions: (query?: string) => Promise<void>
}

export const TransactionsContext = createContext({} as TransactionsContextType)

interface TransactionsProviderProps {
  children: ReactNode
}

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get('/transactions', {
      params: {
        q: query,
      },
    })

    setTransactions(response.data)
  }, [])

  const createTransaction = useCallback(
    async (data: CreateTransactionProps) => {
      const { description, price, category, type } = data

      const response = await api.post('/transactions', {
        description,
        price,
        category,
        type,
        created_at: new Date(),
      })

      setTransactions((prevState) => [response.data, ...prevState])
    },
    [],
  )

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        createTransaction,
        fetchTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
