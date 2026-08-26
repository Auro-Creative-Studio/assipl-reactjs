const variantClasses = {
  primary:
    "bg-primary text-white shadow-sm shadow-slate-950/20 hover:bg-dark active:bg-slate-900 focus-visible:ring-slate-950/20",
  secondary:
    "bg-white text-primary ring-1 ring-inset ring-primary shadow-sm hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-slate-300",
  danger:
    "bg-rose-600 text-white shadow-sm shadow-rose-600/20 hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-500/25",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-300",
  outline:
    "bg-white text-primary ring-1 ring-inset ring-slate-300 hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-slate-400",
  success:
    "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-500/25",
}

const sizeClasses = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-base gap-2.5",
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  isLoading = false,
  disabled = false,
  fullWidth = false,
  icon = null,
  onClick,
  className = "",
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center rounded-lg font-bold
        tracking-tight transition duration-200 ease-out
        cursor-pointer whitespace-nowrap outline-none
        focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-55
        ${variantClasses[variant] ?? variantClasses.primary}
        ${sizeClasses[size] ?? sizeClasses.md}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...rest}
    >
      {isLoading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
      ) : (
        <>
          {icon && <span className="flex items-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
