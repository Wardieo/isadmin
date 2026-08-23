import * as Icons from 'lucide-react'

export type IconName = keyof typeof Icons

export function Icon({ name, size = 18, ...props }: { name: IconName; size?: number; className?: string; 'aria-hidden'?: boolean }) {
  const Component = Icons[name] as React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>
  return Component ? <Component size={size} {...props} /> : null
}
