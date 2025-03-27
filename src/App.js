import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [user, setUser] = useState(undefined)

  // 1. Parse token from URL if redirected from Google OAuth
  useEffect(() => {
    console.log("🌍 App loaded")
  
  // Always check for existing session after
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log("📦 getSession result:", session, error)
      setUser(session?.user ?? null)
    }
  
    getSession()
  
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("⚡ Auth state change:", event, session)
      setUser(session?.user ?? null)
    })
  
    return () => subscription.unsubscribe()
  }, [])
  
  

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://yeicryumedrvfqhfnspd.supabase.co/auth/v1/callback'
      }
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  
    // Supabase removes the local token, but we also redirect to clear Supabase cookie
    const redirectTo = window.location.origin
  
    window.location.href = `https://yeicryumedrvfqhfnspd.supabase.co/auth/v1/logout?redirect_to=${redirectTo}`
  }
  

  return (
    <div>
      <h1>eSIM Store</h1>

      {user === undefined ? (
        <p>Checking login...</p>
      ) : user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  )
}

export default App
