import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { to: '/home',     label: 'Home',     icon: '⌂' },
  { to: '/session',  label: 'Session',  icon: '◎' },
  { to: '/journal',  label: 'Journal',  icon: '◫' },
  { to: '/insights', label: 'Insights', icon: '◈' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
]

export default function Sidebar() {
  const { profile, signOut } = useAuth()
  const nav = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    nav('/')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Mirror</div>

      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
        >
          <span style={{ fontSize: 13, width: 18, textAlign: 'center', display: 'inline-block' }}>
            {link.icon}
          </span>
          {link.label}
        </NavLink>
      ))}

      <div className="sidebar-spacer" />

      <div className="sidebar-bottom">
        {profile?.display_name && (
          <p style={{
            fontSize: '0.75rem', color: 'var(--text-muted)',
            paddingLeft: 4, marginBottom: 8,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {profile.display_name}
          </p>
        )}
        <button
          onClick={handleSignOut}
          className="sidebar-link"
          style={{ width: '100%', color: 'var(--text-muted)', fontSize: '0.82rem' }}
        >
          <span style={{ fontSize: 13 }}>→</span>
          Sign out
        </button>
      </div>
    </aside>
  )
}
