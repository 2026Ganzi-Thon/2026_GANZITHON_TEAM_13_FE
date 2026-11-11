interface Props {
  checked: boolean
  label: string
  onChange: (next: boolean) => void
}

export function Toggle({ checked, label, onChange }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="toggle"
      onClick={() => onChange(!checked)}
    />
  )
}
