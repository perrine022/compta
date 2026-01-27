import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { OfferStatus } from '@/lib/mock-data'

interface StatusBadgeProps {
  status: OfferStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    BOOKABLE: {
      label: 'Disponible',
      className: 'bg-green-600 text-white hover:bg-green-700',
    },
    ON_REQUEST: {
      label: 'Sur demande',
      className: 'bg-amber-500 text-white hover:bg-amber-600',
    },
    SHOWCASE: {
      label: 'Sur demande',
      className: 'bg-gray-500 text-white hover:bg-gray-600',
    },
  }

  const variant = variants[status]

  return (
    <Badge className={cn(variant.className, className)}>
      {variant.label}
    </Badge>
  )
}
