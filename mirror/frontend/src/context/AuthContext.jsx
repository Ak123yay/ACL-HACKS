import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

const getEmailRedirectTo = () => {
  if (typeof window === 'undefined') return undefined
  return `${window.location.origin}/auth`
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
    return data
  }

  useEffect(() => {
    let active = true

    const bootstrap = async () => {
      try {
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href)
          const authCode = url.searchParams.get('code')
          if (authCode) {
            await supabase.auth.exchangeCodeForSession(authCode)
            url.searchParams.delete('code')
            url.searchParams.delete('type')
            window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`)
          }
        }

        const { data: { session } } = await supabase.auth.getSession()
        if (!active) return

        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    bootstrap()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return
      setUser(session?.user ?? null)
      if (session?.user) await fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = (email, password, displayName) =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: getEmailRedirectTo(),
      },
    })

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = () => user ? fetchProfile(user.id) : Promise.resolve()

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
