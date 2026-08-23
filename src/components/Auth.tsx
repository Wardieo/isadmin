import { useState, type FormEvent } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Button, Field } from './ui'
import { Icon } from './Icon'
import logo from '../assets/logo.png'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true); setError('')
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) setError(signInError.message)
    setLoading(false)
  }
  return <div className="auth-page"><div className="auth-art"><div className="auth-art__content"><span>ISORA STUDIO</span><h1>A quieter way to run your studio.</h1><p>Bookings, schedules, reviews, and revenue—thoughtfully brought together.</p></div></div><div className="auth-panel"><form className="auth-card" onSubmit={submit}><div className="auth-logo"><img src={logo} alt="Isora Studio" /></div><div className="auth-heading"><span>Welcome back</span><h2>Sign in to your workspace</h2><p>Use your authorized administrator account.</p></div>{!isSupabaseConfigured && <div className="config-notice"><Icon name="Info" size={17}/><span>Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env</code> to connect.</span></div>}{error && <div className="form-error"><Icon name="CircleAlert" size={17}/>{error}</div>}<Field label="Email address"><div className="input-with-icon"><Icon name="Mail" size={17}/><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@isorastudio.com" autoComplete="email" required /></div></Field><Field label="Password"><div className="input-with-icon"><Icon name="LockKeyhole" size={17}/><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required /></div></Field><Button type="submit" disabled={loading || !isSupabaseConfigured}>{loading ? 'Signing in…' : 'Sign in'}<Icon name="ArrowRight" size={16}/></Button><p className="auth-help">Access is restricted to approved studio administrators.</p></form></div></div>
}

export function Unauthorized({ email, logout }: { email?: string; logout: () => void }) {
  return <div className="center-state"><div className="state-icon"><Icon name="ShieldX" size={28}/></div><span>Restricted access</span><h1>This account isn’t an administrator</h1><p><strong>{email}</strong> is authenticated, but it is not listed in <code>admin_users</code>. Ask an existing administrator to grant access.</p><Button onClick={logout} icon="LogOut">Sign out</Button></div>
}
