import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import './App.css'
import './sidebar.css'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import { Login, Unauthorized } from './components/Auth'
import { Layout, type Page } from './components/Layout'
import { ErrorState, LoadingState } from './components/ui'
import { useAdminData } from './hooks/useAdminData'
import { Overview } from './pages/Overview'
import { Bookings } from './pages/Bookings'
import { CalendarPage } from './pages/Calendar'
import { Reviews } from './pages/Reviews'
import { Reports } from './pages/Reports'
import { Settings } from './pages/Settings'

function App() {
  const [session,setSession]=useState<Session|null>(null);const [authLoading,setAuthLoading]=useState(true);const [isAdmin,setIsAdmin]=useState(false);const [page,setPage]=useState<Page>('overview')
  useEffect(()=>{if(!isSupabaseConfigured){setAuthLoading(false);return} supabase.auth.getSession().then(({data})=>{setSession(data.session);setAuthLoading(false)});const {data}=supabase.auth.onAuthStateChange((_event,next)=>setSession(next));return()=>data.subscription.unsubscribe()},[])
  useEffect(()=>{if(!session){setIsAdmin(false);return}setAuthLoading(true);supabase.rpc('is_admin').then(({data,error})=>{setIsAdmin(!error&&data===true);setAuthLoading(false)})},[session])
  if(authLoading)return <LoadingState label="Verifying administrator access…"/>;if(!session)return <Login/>;if(!isAdmin)return <Unauthorized email={session.user.email} logout={()=>supabase.auth.signOut()}/>;return <Dashboard page={page} setPage={setPage} session={session}/>
}

function Dashboard({page,setPage,session}:{page:Page;setPage:(p:Page)=>void;session:Session}){const data=useAdminData();return <Layout page={page} setPage={setPage} user={session.user} onLogout={()=>supabase.auth.signOut()}>{data.loading?<LoadingState/>:data.error?<ErrorState message={data.error} retry={data.reload}/>:<>{page==='overview'&&<Overview bookings={data.bookings} reviews={data.reviews} navigate={setPage}/>} {page==='bookings'&&<Bookings bookings={data.bookings} setBookings={data.setBookings} packages={data.packages}/>} {page==='calendar'&&<CalendarPage bookings={data.bookings}/>} {page==='reviews'&&<Reviews reviews={data.reviews} setReviews={data.setReviews}/>} {page==='reports'&&<Reports bookings={data.bookings}/>} {page==='settings'&&<Settings packages={data.packages} setPackages={data.setPackages} addons={data.addons} setAddons={data.setAddons}/>}</>}</Layout>}

export default App
