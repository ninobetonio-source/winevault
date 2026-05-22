import React, { useEffect, useState } from 'react'
import { listWines } from '../services/wines'

export default function DebugSupabase() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await listWines()
        setData(res)
      } catch (err) {
        setError(err.message || String(err))
      }
    }
    fetchData()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Supabase Connection Debug</h1>
      <p className="mt-3 text-gray-300">This page attempts to fetch `wines` from Supabase using your environment variables.</p>
      <div className="mt-4">
        {error && <div className="text-rose-400">Error: {error}</div>}
        {!error && !data && <div>Loading...</div>}
        {data && (
          <div className="mt-3 bg-surface-900 p-4 rounded-2xl">
            <div className="font-semibold">Returned {data.length} wines</div>
            <pre className="mt-2 text-sm text-gray-300 max-h-64 overflow-auto">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
