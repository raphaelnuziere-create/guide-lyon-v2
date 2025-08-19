import { useState, useEffect } from 'react'

export function useGeolocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        setError(error.message)
      }
    )
  }, [])

  return { location, error }
}
