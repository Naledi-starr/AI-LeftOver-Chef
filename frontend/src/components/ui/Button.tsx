interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "quiet";
}

export default function Button({ variant = "primary", children, ...props }: ButtonProps) {
  return <button className={`button button-${variant}`} {...props}>{children}</button>;
}