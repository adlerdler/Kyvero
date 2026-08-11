// High quality custom SVG data URIs for anime-line-art styled visuals

export const DEFAULT_AVATAR_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
  <rect width="300" height="300" fill="#0F172A"/>
  <!-- Manga halftone background dots -->
  <pattern id="dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="1.5" fill="#1E293B"/>
  </pattern>
  <rect width="300" height="300" fill="url(#dots)"/>
  
  <!-- Speed lines background -->
  <path d="M 150 150 L 0 0 M 150 150 L 300 0 M 150 150 L 0 300 M 150 150 L 300 300 M 150 150 L 150 0 M 150 150 L 0 150 M 150 150 L 300 150 M 150 150 L 150 300" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4"/>
  
  <!-- Sharp Mecha Hair Back -->
  <path d="M 50 160 C 40 90 80 30 150 25 C 220 30 260 90 250 160 Z" fill="#020617" stroke="#38BDF8" stroke-width="3"/>
  
  <!-- Face base (Sharp angular jaw) -->
  <polygon points="85,100 215,100 195,190 150,230 105,190" fill="#1E293B" stroke="#F8FAFC" stroke-width="4" stroke-linejoin="round"/>
  
  <!-- Cyber HUD Visor / Goggles (A1L Cyber Visor) -->
  <polygon points="80,120 220,120 210,158 90,158" fill="#0EA5E9" stroke="#F8FAFC" stroke-width="3.5"/>
  <line x1="80" y1="139" x2="220" y2="139" stroke="#F8FAFC" stroke-width="2"/>
  <text x="132" y="146" font-family="monospace" font-size="12" font-weight="900" fill="#FFFFFF">A1L-v2</text>
  
  <!-- Tactical Nose & Mouth (Sharp Mecha Manga Lines) -->
  <path d="M 148 172 L 152 178" stroke="#38BDF8" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M 132 195 L 168 195" fill="none" stroke="#F8FAFC" stroke-width="3.5" stroke-linecap="round"/>
  
  <!-- Angular Spiky Anime Bangs -->
  <path d="M 60 100 Q 100 130 125 100 Q 150 150 175 98 Q 200 130 240 95 Q 210 50 150 40 Q 90 50 60 100 Z" fill="#020617" stroke="#38BDF8" stroke-width="2.5"/>
  <path d="M 95 65 L 110 90 M 135 55 L 145 88 M 180 58 L 170 88" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/>
  
  <!-- Tactical Collar & Armor Vest -->
  <polygon points="70,220 150,255 230,220 250,295 50,295" fill="#0F172A" stroke="#F8FAFC" stroke-width="4"/>
  <path d="M 110 238 L 110 285 M 190 238 L 190 285" stroke="#38BDF8" stroke-width="3" stroke-dasharray="4 4"/>
  
  <!-- Mecha Tech Badges -->
  <polygon points="250,50 260,65 275,70 260,75 250,90 240,75 225,70 240,65" fill="#F59E0B" stroke="#F8FAFC" stroke-width="2"/>
  <polygon points="35,130 40,140 50,145 40,150 35,160 30,150 20,145 30,140" fill="#0EA5E9" stroke="#F8FAFC" stroke-width="2"/>
</svg>
`)}`;

export const PROJECT_1_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="100%" height="100%">
  <rect width="600" height="380" fill="#FAFAFA"/>
  <pattern id="grid1" width="20" height="20" patternUnits="userSpaceOnUse">
    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#F1F5F9" stroke-width="1.5"/>
  </pattern>
  <rect width="600" height="380" fill="url(#grid1)"/>
  
  <!-- Anime Manga Panel Box -->
  <rect x="20" y="20" width="560" height="340" fill="#FFFFFF" stroke="#111827" stroke-width="4" rx="4"/>
  <rect x="35" y="35" width="530" height="40" fill="#FEF08A" stroke="#111827" stroke-width="3"/>
  <text x="50" y="61" font-family="monospace" font-size="18" font-weight="900" fill="#111827">⚡ SYSTEM://NEO_GENAI_STUDIO v3.0</text>
  
  <!-- Line Art Interface Wireframe -->
  <rect x="35" y="90" width="160" height="250" fill="#F8FAFC" stroke="#111827" stroke-width="3"/>
  <rect x="210" y="90" width="355" height="150" fill="#E0F2FE" stroke="#111827" stroke-width="3"/>
  <rect x="210" y="255" width="355" height="85" fill="#FFE4E6" stroke="#111827" stroke-width="3"/>
  
  <!-- Waveform line art -->
  <path d="M 225 165 Q 260 110 300 165 T 380 165 T 460 165 T 540 165" fill="none" stroke="#111827" stroke-width="4"/>
  <path d="M 225 165 Q 260 130 300 165 T 380 165 T 460 165 T 540 165" fill="none" stroke="#2563EB" stroke-width="2" stroke-dasharray="4 4"/>
  
  <!-- Manga FX Badge -->
  <polygon points="500,40 550,20 540,60 580,70 535,85 545,115 510,95 490,120 485,85 450,75 485,60" fill="#111827"/>
  <text x="495" y="73" font-family="sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF">CRAZY!</text>
</svg>
`)}`;

export const PROJECT_2_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="100%" height="100%">
  <rect width="600" height="380" fill="#FAFAFA"/>
  <pattern id="mangaDots2" width="10" height="10" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="1.5" fill="#E2E8F0"/>
  </pattern>
  <rect width="600" height="380" fill="url(#mangaDots2)"/>
  
  <rect x="20" y="20" width="560" height="340" fill="#FFFFFF" stroke="#111827" stroke-width="4"/>
  
  <!-- Diagonal Manga split panel -->
  <polygon points="30,30 400,30 220,350 30,350" fill="#F3E8FF" stroke="#111827" stroke-width="3"/>
  <polygon points="415,30 570,30 570,350 235,350" fill="#FFFFFF" stroke="#111827" stroke-width="3"/>
  
  <!-- Line art cyber brain / node web -->
  <circle cx="210" cy="180" r="45" fill="#FEF08A" stroke="#111827" stroke-width="3.5"/>
  <circle cx="100" cy="100" r="25" fill="#FFFFFF" stroke="#111827" stroke-width="3"/>
  <circle cx="110" cy="270" r="30" fill="#FFFFFF" stroke="#111827" stroke-width="3"/>
  <circle cx="420" cy="120" r="35" fill="#E0F2FE" stroke="#111827" stroke-width="3"/>
  <circle cx="480" cy="260" r="28" fill="#FFE4E6" stroke="#111827" stroke-width="3"/>
  
  <line x1="125" y1="100" x2="170" y2="155" stroke="#111827" stroke-width="3"/>
  <line x1="135" y1="250" x2="175" y2="205" stroke="#111827" stroke-width="3"/>
  <line x1="255" y1="180" x2="385" y2="130" stroke="#111827" stroke-width="3"/>
  <line x1="250" y1="200" x2="452" y2="250" stroke="#111827" stroke-width="3"/>

  <text x="50" y="70" font-family="monospace" font-size="20" font-weight="900" fill="#111827">🌐 AGENT_CANVAS</text>
  <rect x="50" y="85" width="120" height="24" fill="#111827" rx="3"/>
  <text x="58" y="101" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">MULTI-AGENT UI</text>
</svg>
`)}`;

export const PROJECT_3_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="100%" height="100%">
  <rect width="600" height="380" fill="#FAFAFA"/>
  <rect x="20" y="20" width="560" height="340" fill="#FFFFFF" stroke="#111827" stroke-width="4"/>
  
  <!-- Speed lines background -->
  <g stroke="#E2E8F0" stroke-width="2">
    <line x1="300" y1="190" x2="0" y2="0"/>
    <line x1="300" y1="190" x2="600" y2="0"/>
    <line x1="300" y1="190" x2="0" y2="380"/>
    <line x1="300" y1="190" x2="600" y2="380"/>
    <line x1="300" y1="190" x2="300" y2="0"/>
    <line x1="300" y1="190" x2="300" y2="380"/>
  </g>
  
  <!-- Anime Isometric Terminal Box -->
  <polygon points="120,130 300,50 480,130 300,210" fill="#E0F2FE" stroke="#111827" stroke-width="4"/>
  <polygon points="120,130 300,210 300,320 120,240" fill="#FEF08A" stroke="#111827" stroke-width="4"/>
  <polygon points="480,130 300,210 300,320 480,240" fill="#FFE4E6" stroke="#111827" stroke-width="4"/>
  
  <text x="180" y="125" font-family="monospace" font-size="16" font-weight="bold" fill="#111827">CLI_SPEED_KIT</text>
</svg>
`)}`;
