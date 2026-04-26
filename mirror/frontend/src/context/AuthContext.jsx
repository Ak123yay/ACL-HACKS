import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)
const SESSION_TIMEOUT_MS = 8000

const withTimeout = (promise, timeoutMs) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Session check timed out')), timeoutMs)
    }),
  ])

const getEmailRedirectTo = () => {
  if (typeof window === 'undefined') return undefined
  return `${window.location.origin}/auth`
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (error) {
      console.warn('[Mirror] Unable to fetch profile:', error.message)
      setProfile(null)
      return null
    }
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
            await withTimeout(supabase.auth.exchangeCodeForSession(authCode), SESSION_TIMEOUT_MS)
            url.searchParams.delete('code')
            url.searchParams.delete('type')
            window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`)
          }
        }

        const { data: { session } } = await withTimeout(supabase.auth.getSession(), SESSION_TIMEOUT_MS)
        if (!active) return

        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
      } catch (error) {
        if (!active) return
        console.warn('[Mirror] Session bootstrap failed:', error?.message || error)
        setUser(null)
        setProfile(null)
      } finally {
        if (active) setLoading(false)
      }
    }

    bootstrap()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return
      setUser(session?.user ?? null)
      try {
        if (session?.user) await fetchProfile(session.user.id)
        else setProfile(null)
      } catch (error) {
        console.warn('[Mirror] Auth state update failed:', error?.message || error)
        setProfile(null)
      }
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
