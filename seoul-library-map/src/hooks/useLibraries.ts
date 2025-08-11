import { useEffect, useMemo, useState } from 'react'

export type Library = {
  id: string
  name: string
  district: string
  lat: number
  lng: number
  categories: Array<{ name: string; count: number }>
}

export function useLibraries() {
  const [libraries, setLibraries] = useState<Library[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch('/data/libraries.sample.json')
      .then((r) => r.json())
      .then((data: Library[]) => setLibraries(data))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  const idToLibrary = useMemo(() => {
    const map = new Map<string, Library>()
    libraries.forEach((l) => map.set(l.id, l))
    return map
  }, [libraries])

  return { libraries, idToLibrary, loading, error }
}

export default useLibraries