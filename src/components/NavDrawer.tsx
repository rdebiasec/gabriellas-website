import { useEffect } from 'react'
import './NavDrawer.css'

export type NavItem = {
  id: string
  label: string
}

interface NavDrawerProps {
  isOpen: boolean
  onClose: () => void
  navItems: NavItem[]
  activeTab: string
  onNavigate: (id: NavItem['id']) => void
}

function NavDrawer({ isOpen, onClose, navItems, activeTab, onNavigate }: NavDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-panel" role="dialog" aria-modal="true">
        <button className="drawer-close" onClick={onClose} aria-label="Close menu">
          <span />
          <span />
        </button>
        <ul className="drawer-nav">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`drawer-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default NavDrawer


