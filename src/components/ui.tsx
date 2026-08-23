import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import type { BookingStatus } from '../types'

export function Button({ children, variant = 'primary', icon, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; icon?: IconName }) {
  return <button className={`button button--${variant} ${className}`} {...props}>{icon && <Icon name={icon} size={16} aria-hidden />}{children}</button>
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`badge badge--${status}`}><span className="badge__dot" />{status}</span>
}

export function EmptyState({ icon = 'Inbox', title, description }: { icon?: IconName; title: string; description: string }) {
  return <div className="empty-state"><span className="empty-state__icon"><Icon name={icon} size={22} /></span><h3>{title}</h3><p>{description}</p></div>
}

export function LoadingState({ label = 'Loading dashboard…' }: { label?: string }) {
  return <div className="loading-state" role="status"><span className="spinner" />{label}</div>
}

export function ErrorState({ message, retry }: { message: string; retry?: () => void }) {
  return <div className="error-state" role="alert"><Icon name="CircleAlert" /><div><strong>Something went wrong</strong><p>{message}</p></div>{retry && <Button variant="secondary" onClick={retry}>Try again</Button>}</div>
}

export function Modal({ title, children, onClose, footer, wide = false }: { title: string; children: ReactNode; onClose: () => void; footer?: ReactNode; wide?: boolean }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className={`modal ${wide ? 'modal--wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title"><header><h2 id="modal-title">{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close dialog"><Icon name="X" /></button></header><div className="modal__body">{children}</div>{footer && <footer>{footer}</footer>}</div></div>
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>
}
