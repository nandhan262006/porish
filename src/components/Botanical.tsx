export default function Botanical({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 160"
      fill="none"
      aria-hidden
      className={`botanical ${className}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M60 158 C 58 120, 56 90, 60 60 C 62 40, 66 24, 74 12"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M60 118 C 48 112, 38 100, 36 86 C 48 88, 58 100, 60 118 Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M58 96 C 70 92, 78 82, 80 70 C 68 72, 60 82, 58 96 Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M62 64 C 52 58, 46 48, 45 36 C 56 38, 62 50, 62 64 Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M66 40 C 74 34, 78 26, 78 16 C 68 20, 64 28, 66 40 Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="80" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
