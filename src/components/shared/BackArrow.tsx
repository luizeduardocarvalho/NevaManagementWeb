import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface BackArrowProps {
  to?: string
  label?: string
}

export function BackArrow({ to, label = 'Back' }: BackArrowProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (to) {
      navigate(to)
    } else {
      navigate(-1)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className="flex items-center gap-2 mb-4"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  )
}
