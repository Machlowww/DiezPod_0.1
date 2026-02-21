
interface DateDisplayProps {
  onClick: () => void
}

const DateDisplay = ({ onClick }: DateDisplayProps) => {
  const formatDate = () => {
    const now = new Date()
    return now.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long'
    })
  }

  return (
    <div
      onClick={onClick}
      className="absolute bottom-8 left-8 frosted-glass rounded-2xl px-6 py-4 cursor-pointer hover:bg-white/30 transition-all duration-300 select-none"
    >
      <div className="flex items-center space-x-3">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
          <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
          <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
          <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
        </svg>
        <span className="text-white text-lg font-medium">{formatDate()}</span>
      </div>
    </div>
  )
}

export default DateDisplay
