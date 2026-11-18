interface Props {
  size?: number
  face?: boolean
}

// 임시 SVG. Figma에서 쉼표 캐릭터를 export 받으면 public/ 이미지로 교체한다.
export function Mascot({ size = 96, face = true }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="쉼표">
      <circle cx="46" cy="36" r="28" fill="currentColor" />
      <path d="M58 56c12 14 4 30-18 40 10-12 10-22-2-34z" fill="currentColor" />
      {face && (
        <g fill="var(--cream)" stroke="var(--cream)" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="36" cy="34" r="2.6" stroke="none" />
          <circle cx="54" cy="34" r="2.6" stroke="none" />
          <path d="M39 44q7 6 14 0" fill="none" />
        </g>
      )}
    </svg>
  )
}
