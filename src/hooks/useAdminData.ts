import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Booking, Review, CatalogItem } from '../types'

export function useAdminData() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [packages, setPackages] = useState<CatalogItem[]>([])
  const [addons, setAddons] = useState<CatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const load = useCallback(async () => {
    setLoading(true); setError('')
    const [bookingResult, reviewResult, packageResult, addonResult] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*').order('created_at', { ascending: false }),
      supabase.from('packages').select('*').order('name'),
      supabase.from('addons').select('*').order('name'),
    ])
    const requiredError = bookingResult.error || reviewResult.error
    if (requiredError) {
      const permissionDenied = requiredError.code === '42501' || /permission denied|row-level security/i.test(requiredError.message)
      setError(permissionDenied
        ? 'Your account is signed in, but the database has not granted administrators access to dashboard tables. Apply the admin RLS migration and try again.'
        : requiredError.message)
    }
    setBookings((bookingResult.data || []) as Booking[])
    setReviews((reviewResult.data || []) as Review[])
    // Catalog tables may not exist in older projects; bookings/reviews remain available.
    setPackages((packageResult.data || []) as CatalogItem[])
    setAddons((addonResult.data || []) as CatalogItem[])
    setLoading(false)
  }, [])
  useEffect(() => { void load() }, [load])
  return { bookings, setBookings, reviews, setReviews, packages, setPackages, addons, setAddons, loading, error, reload: load }
}
