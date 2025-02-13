interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'danger'
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded text-white"
  const variantStyles = {
    primary: "bg-green-500 hover:bg-green-600",
    danger: "bg-red-500 hover:bg-red-600"
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {children}
    </button>
  )
}