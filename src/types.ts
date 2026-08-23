export type BookingStatus = 'pending' | 'confirmed' | 'paid' | 'cancelled'

export interface Booking {
  id: string
  booking_reference?: string
  reference?: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  contact_number?: string
  appointment_date: string
  appointment_time: string
  status: BookingStatus
  total?: number
  total_amount?: number
  notes?: string
  customer_notes?: string
  package?: { id?: string; name?: string; price?: number } | string
  package_snapshot?: { id?: string; name?: string; price?: number }
  addons?: Array<{ id?: string; name?: string; price?: number }>
  add_ons?: Array<{ id?: string; name?: string; price?: number }>
  created_at: string
}

export interface Review {
  id: string
  name?: string
  reviewer_name?: string
  customer_name?: string
  rating: number
  description?: string
  review?: string
  is_public?: boolean
  visible?: boolean
  is_visible?: boolean
  created_at: string
}

export interface CatalogItem {
  id: string
  name: string
  price: number
  description?: string
  active?: boolean
}

export const bookingRef = (booking: Booking) => booking.booking_reference || booking.reference || booking.id.slice(0, 8).toUpperCase()
export const bookingCustomer = (booking: Booking) => booking.customer_name || 'Guest customer'
export const bookingPhone = (booking: Booking) => booking.customer_phone || booking.contact_number || ''
export const bookingTotal = (booking: Booking) => Number(booking.total_amount ?? booking.total ?? 0)
export const bookingPackage = (booking: Booking) => {
  if (booking.package_snapshot?.name) return booking.package_snapshot.name
  if (typeof booking.package === 'object') return booking.package?.name || 'Custom package'
  return booking.package || 'Custom package'
}
export const bookingAddons = (booking: Booking) => booking.addons || booking.add_ons || []

export const peso = (value: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(value)
export const phDate = (value: string | Date, options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }) =>
  new Intl.DateTimeFormat('en-PH', { ...options, timeZone: 'Asia/Manila' }).format(new Date(value))
export const todayPH = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
