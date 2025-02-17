interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'danger'
  disabled?: boolean // ✅ 新增 disabled 屬性
}

export function Button({ onClick, children, variant = 'primary', disabled }: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded text-white font-bold"
  const variantStyles = {
    primary: "bg-green-500 hover:bg-green-600",
    danger: "bg-red-500 hover:bg-red-600"
  }
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "" // ✅ 加入 disabled 樣式

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles}`}
      disabled={disabled} // ✅ 套用 disabled 屬性
    >
      {children}
    </button>
  )
}
