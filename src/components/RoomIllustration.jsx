// Small flat illustrations for the room gallery (drawn in SVG with the brand palette).
import { BRAND } from '../data/palette.js'

const { ivory, cream, rose, sage, burgundy, walnut, charcoal } = BRAND

function Shell({ wall, floor, children }) {
  return (
    <svg viewBox="0 0 320 240" role="img" aria-hidden="true" className="illus">
      <rect width="320" height="240" fill={wall} />
      <polygon points="0,168 320,168 320,240 0,240" fill={floor} />
      <rect y="162" width="320" height="8" fill={ivory} opacity="0.7" />
      {children}
    </svg>
  )
}

const Window = ({ x = 214, y = 40 }) => (
  <g>
    <rect x={x} y={y} width="70" height="82" fill="#E7EEF0" stroke={ivory} strokeWidth="5" />
    <path d={`M${x + 35} ${y}v82M${x} ${y + 41}h70`} stroke={ivory} strokeWidth="3" />
  </g>
)
const Plant = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-10 0h20l-4 22h-12z" fill="#B9775A" />
    <ellipse cx="0" cy="-14" rx="14" ry="22" fill="#7F9172" />
    <ellipse cx="-12" cy="-4" rx="9" ry="16" fill="#5F7655" transform="rotate(-24 -12 -4)" />
    <ellipse cx="12" cy="-6" rx="9" ry="16" fill="#7F9172" transform="rotate(24 12 -6)" />
  </g>
)

const ART = {
  bedroom: (
    <Shell wall="#EADFCF" floor="#C99F70">
      <Window />
      <rect x="62" y="40" width="46" height="60" rx="3" fill={cream} stroke={walnut} strokeWidth="4" />
      <path d="M70 92v-26a15 15 0 0130 0v26z" fill={rose} />
      <rect x="40" y="118" width="130" height="50" rx="4" fill={walnut} />
      <rect x="40" y="96" width="130" height="34" rx="8" fill={ivory} />
      <rect x="40" y="118" width="130" height="30" rx="6" fill={rose} />
      <rect x="48" y="102" width="40" height="16" rx="6" fill={cream} />
      <rect x="182" y="132" width="26" height="34" rx="2" fill={walnut} />
      <rect x="188" y="110" width="14" height="22" fill={sage} />
      <Plant x="290" y="164" />
    </Shell>
  ),
  'living-room': (
    <Shell wall="#E3BFBA" floor="#8B674D">
      <rect x="40" y="38" width="80" height="54" fill={cream} stroke={charcoal} strokeWidth="4" />
      <path d="M48 84l24-24 18 14 20-20 4 30z" fill={sage} />
      <rect x="150" y="116" width="150" height="50" rx="10" fill={burgundy} />
      <rect x="146" y="98" width="158" height="30" rx="12" fill="#7A4D58" />
      <rect x="160" y="108" width="34" height="24" rx="6" fill={rose} />
      <ellipse cx="110" cy="192" rx="60" ry="14" fill={cream} />
      <rect x="82" y="160" width="56" height="12" rx="3" fill={walnut} />
      <Plant x="32" y="164" s="1.1" />
    </Shell>
  ),
  'study-room': (
    <Shell wall="#AEBBA0" floor="#E0CBA6">
      <rect x="40" y="30" width="62" height="136" fill={walnut} />
      {[44, 76, 108, 140].map((y, i) => (
        <g key={y}>
          <rect x="44" y={y} width="54" height="3" fill="#6B4D38" />
          <rect x="48" y={y - 22} width="10" height="22" fill={[rose, burgundy, cream, ivory][i]} />
          <rect x="62" y={y - 18} width="9" height="18" fill={[ivory, sage, rose, burgundy][i]} />
          <rect x="76" y={y - 24} width="11" height="24" fill={[burgundy, cream, ivory, rose][i]} />
        </g>
      ))}
      <rect x="150" y="124" width="140" height="10" fill={cream} />
      <rect x="156" y="134" width="8" height="34" fill={walnut} />
      <rect x="276" y="134" width="8" height="34" fill={walnut} />
      <rect x="196" y="86" width="52" height="36" rx="3" fill={charcoal} />
      <rect x="219" y="122" width="6" height="4" fill={charcoal} />
      <path d="M270 124l12-34 8 2-8 32z" fill={rose} />
      <rect x="172" y="146" width="40" height="22" rx="8" fill={burgundy} />
    </Shell>
  ),
  kitchen: (
    <Shell wall="#F3EEE6" floor="#C99F70">
      <rect x="30" y="34" width="120" height="44" fill={sage} />
      <path d="M90 34v44" stroke={ivory} strokeWidth="2" />
      <rect x="30" y="112" width="190" height="56" fill={sage} />
      <rect x="26" y="106" width="198" height="10" fill={cream} />
      <path d="M92 112v56M158 112v56" stroke={ivory} strokeWidth="2" />
      <rect x="244" y="40" width="46" height="60" rx="3" fill="#E7EEF0" stroke={ivory} strokeWidth="5" />
      <circle cx="258" cy="136" r="9" fill={walnut} />
      <rect x="254" y="144" width="8" height="22" fill={walnut} />
      <circle cx="284" cy="136" r="9" fill={walnut} />
      <rect x="280" y="144" width="8" height="22" fill={walnut} />
      <ellipse cx="60" cy="98" rx="14" ry="8" fill={rose} />
    </Shell>
  ),
  'dressing-room': (
    <Shell wall="#EDE4D8" floor="#8B674D">
      <rect x="30" y="34" width="86" height="132" rx="8" fill={sage} />
      <path d="M73 40v120" stroke={ivory} strokeWidth="2" />
      <circle cx="66" cy="102" r="3" fill="#B89A6A" />
      <circle cx="80" cy="102" r="3" fill="#B89A6A" />
      <ellipse cx="200" cy="82" rx="34" ry="46" fill="#DCE5E8" stroke={walnut} strokeWidth="6" />
      <rect x="150" y="124" width="100" height="10" fill={walnut} />
      <rect x="156" y="134" width="8" height="32" fill={walnut} />
      <rect x="236" y="134" width="8" height="32" fill={walnut} />
      <rect x="170" y="112" width="12" height="12" fill={rose} />
      <rect x="190" y="116" width="16" height="8" fill={burgundy} />
      <rect x="268" y="146" width="34" height="22" rx="10" fill={rose} />
    </Shell>
  ),
  balcony: (
    <svg viewBox="0 0 320 240" aria-hidden="true" className="illus">
      <rect width="320" height="240" fill="#F2C99B" />
      <circle cx="240" cy="74" r="30" fill="#F7E3B8" />
      <rect y="150" width="320" height="90" fill="#B8A58C" />
      <path d="M0 150h320" stroke={ivory} strokeWidth="6" />
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={10 + i * 23} y="96" width="4" height="54" fill={charcoal} opacity="0.85" />
      ))}
      <rect y="92" width="320" height="6" fill={charcoal} opacity="0.85" />
      <ellipse cx="150" cy="212" rx="70" ry="14" fill={sage} />
      <rect x="110" y="168" width="80" height="12" rx="5" fill={burgundy} />
      <rect x="116" y="180" width="6" height="24" fill={walnut} />
      <rect x="178" y="180" width="6" height="24" fill={walnut} />
      <Plant x="38" y="196" s="1.2" />
      <rect x="258" y="170" width="22" height="30" rx="6" fill={rose} />
      <path d="M269 170v-12" stroke={charcoal} strokeWidth="3" />
      <rect x="262" y="146" width="14" height="14" rx="3" fill="#F7E3B8" />
    </svg>
  ),
}

export default function RoomIllustration({ roomId }) {
  return <div className="illus-wrap">{ART[roomId]}</div>
}
