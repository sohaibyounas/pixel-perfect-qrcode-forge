import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';

export type QRCodeType = 
  | 'url' 
  | 'text' 
  | 'email' 
  | 'phone' 
  | 'sms' 
  | 'whatsapp' 
  | 'wifi' 
  | 'vcard' 
  | 'mecard' 
  | 'location' 
  | 'event' 
  | 'crypto';

export type QRShapeType = 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'diamond';
export type QREyeFrameType = 'square' | 'rounded' | 'circle' | 'leaf' | 'diamond';
export type QREyeBallType = 'square' | 'rounded' | 'circle' | 'diamond' | 'leaf';
export type QRFrameType = 'none' | 'bottom-banner' | 'top-banner' | 'phone' | 'card' | 'badge' | 'coupon';

export interface QRCodeData {
  type: QRCodeType;
  value: string;
  error?: string;
}

export interface QRDesign {
  // Colors (Palette #287A74, #55A9A0, #AEEED3, #FFF8B0)
  foregroundColor: string;
  backgroundColor: string;
  isTransparent: boolean;
  useGradient: boolean;
  gradientType: 'linear' | 'radial';
  gradientColor2: string;
  gradientDirection: 'to-r' | 'to-b' | 'to-br' | 'to-tr';
  cornerSquareColor: string;
  cornerDotColor: string;
  
  // Shapes
  shape: QRShapeType;
  eyeFrameShape: QREyeFrameType;
  eyeBallShape: QREyeBallType;
  
  // Logo
  logoImage: string | null;
  logoSize: number; // 10 to 35
  logoPadding: boolean;
  
  // Quality & Frame
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number;
  frameType: QRFrameType;
  frameText: string;
  frameSubtext: string;
  frameColor: string;
  frameTextColor: string;
}

export const DEFAULT_DESIGN: QRDesign = {
  foregroundColor: '#287A74',
  backgroundColor: '#FFFFFF',
  isTransparent: false,
  useGradient: true,
  gradientType: 'linear',
  gradientColor2: '#55A9A0',
  gradientDirection: 'to-br',
  cornerSquareColor: '#287A74',
  cornerDotColor: '#287A74',
  shape: 'rounded',
  eyeFrameShape: 'rounded',
  eyeBallShape: 'rounded',
  logoImage: null,
  logoSize: 24,
  logoPadding: true,
  errorCorrectionLevel: 'Q',
  margin: 4,
  frameType: 'bottom-banner',
  frameText: 'SCAN ME',
  frameSubtext: '',
  frameColor: '#287A74',
  frameTextColor: '#FFFFFF',
};

export const DEFAULT_QR_DATA: QRCodeData = {
  type: 'url',
  value: 'https://example.com',
};

// Curated Designer Templates matching Color Hunt: #287A74, #55A9A0, #AEEED3, #FFF8B0
export const SAMPLE_TEMPLATES = [
  {
    name: 'Teal Studio Pro',
    description: 'Signature brand palette with smooth gradient and modern badge',
    design: {
      ...DEFAULT_DESIGN,
      foregroundColor: '#287A74',
      gradientColor2: '#55A9A0',
      backgroundColor: '#FFFFFF',
      cornerSquareColor: '#287A74',
      cornerDotColor: '#55A9A0',
      shape: 'rounded' as QRShapeType,
      eyeFrameShape: 'rounded' as QREyeFrameType,
      eyeBallShape: 'rounded' as QREyeBallType,
      frameType: 'bottom-banner' as QRFrameType,
      frameText: 'SCAN ME',
      frameColor: '#287A74',
      frameTextColor: '#FFFFFF',
    },
    thumbnail: '🌿',
  },
  {
    name: 'Butter Mint Warm',
    description: 'Playful warm butter yellow background with deep teal dots',
    design: {
      ...DEFAULT_DESIGN,
      foregroundColor: '#287A74',
      gradientColor2: '#287A74',
      useGradient: false,
      backgroundColor: '#FFF8B0',
      cornerSquareColor: '#287A74',
      cornerDotColor: '#55A9A0',
      shape: 'classy' as QRShapeType,
      eyeFrameShape: 'leaf' as QREyeFrameType,
      eyeBallShape: 'diamond' as QREyeBallType,
      frameType: 'card' as QRFrameType,
      frameText: 'CONNECT NOW',
      frameColor: '#287A74',
      frameTextColor: '#FFFFFF',
    },
    thumbnail: '✨',
  },
  {
    name: 'Mint Minimalist',
    description: 'Soft pale mint accents with circular dot matrix, no frame',
    design: {
      ...DEFAULT_DESIGN,
      foregroundColor: '#287A74',
      gradientColor2: '#55A9A0',
      useGradient: true,
      backgroundColor: '#FFFFFF',
      cornerSquareColor: '#287A74',
      cornerDotColor: '#287A74',
      shape: 'dots' as QRShapeType,
      eyeFrameShape: 'circle' as QREyeFrameType,
      eyeBallShape: 'circle' as QREyeBallType,
      frameType: 'none' as QRFrameType,
    },
    thumbnail: '⚪',
  },
  {
    name: 'Pine Deep Luxury',
    description: 'Deep pine dark mode with glowing mint eyes and gold text',
    design: {
      ...DEFAULT_DESIGN,
      foregroundColor: '#AEEED3',
      gradientColor2: '#FFF8B0',
      useGradient: true,
      backgroundColor: '#143D3A',
      cornerSquareColor: '#AEEED3',
      cornerDotColor: '#FFF8B0',
      shape: 'rounded' as QRShapeType,
      eyeFrameShape: 'rounded' as QREyeFrameType,
      eyeBallShape: 'circle' as QREyeBallType,
      frameType: 'badge' as QRFrameType,
      frameText: 'VIP ACCESS',
      frameColor: '#AEEED3',
      frameTextColor: '#143D3A',
    },
    thumbnail: '🌲',
  },
  {
    name: 'Aqua Clean Tech',
    description: 'Crisp square geometry with dual teal gradient for tech brands',
    design: {
      ...DEFAULT_DESIGN,
      foregroundColor: '#55A9A0',
      gradientColor2: '#287A74',
      useGradient: true,
      backgroundColor: '#FFFFFF',
      cornerSquareColor: '#287A74',
      cornerDotColor: '#287A74',
      shape: 'square' as QRShapeType,
      eyeFrameShape: 'square' as QREyeFrameType,
      eyeBallShape: 'square' as QREyeBallType,
      frameType: 'top-banner' as QRFrameType,
      frameText: 'VIEW MENU',
      frameColor: '#55A9A0',
      frameTextColor: '#FFFFFF',
    },
    thumbnail: '📱',
  },
  {
    name: 'Smartphone Showcase',
    description: 'Realistic modern mobile phone bezel frame with quick scan',
    design: {
      ...DEFAULT_DESIGN,
      foregroundColor: '#287A74',
      gradientColor2: '#55A9A0',
      useGradient: true,
      backgroundColor: '#FFFFFF',
      cornerSquareColor: '#287A74',
      cornerDotColor: '#55A9A0',
      shape: 'classy-rounded' as QRShapeType,
      eyeFrameShape: 'rounded' as QREyeFrameType,
      eyeBallShape: 'rounded' as QREyeBallType,
      frameType: 'phone' as QRFrameType,
      frameText: 'DOWNLOAD APP',
      frameColor: '#287A74',
      frameTextColor: '#FFFFFF',
    },
    thumbnail: '📲',
  },
];

// Popular preset logos as lightweight high-res inline SVGs
export const PRESET_LOGOS = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    color: '#25D366',
    svg: `<svg viewBox="0 0 24 24" fill="#25D366"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.44 19.65L5.27 16.61L5.09 16.31C4.28 15.03 3.81 13.5 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.2 6.94C9 6.94 8.67 7.04 8.44 7.33C8.2 7.63 7.57 8.21 7.57 9.42C7.57 10.63 8.46 11.79 8.58 11.96C8.7 12.12 10.3 14.75 12.83 15.75C14.86 16.55 15.28 16.39 15.73 16.35C16.18 16.31 17.18 15.75 17.38 15.17C17.58 14.59 17.58 14.1 17.52 14C17.47 13.9 17.33 13.85 17.11 13.73C16.89 13.62 15.82 13.09 15.62 13.02C15.42 12.95 15.28 12.91 15.14 13.12C15 13.33 14.58 13.85 14.45 14C14.32 14.15 14.2 14.17 13.98 14.06C13.76 13.95 13.06 13.72 12.22 12.97C11.57 12.39 11.13 11.67 11.01 11.46C10.89 11.25 11 11.14 11.11 11.03C11.21 10.93 11.33 10.77 11.45 10.63C11.57 10.49 11.61 10.38 11.69 10.22C11.77 10.06 11.73 9.92 11.67 9.81C11.61 9.7 11.16 8.59 10.97 8.14C10.78 7.7 10.6 7.76 10.45 7.75C10.32 7.75 10.16 7.74 10 7.74C9.84 7.74 9.58 7.8 9.38 8.02"/></svg>`,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#E4405F',
    svg: `<svg viewBox="0 0 24 24" fill="#E4405F"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    color: '#000000',
    svg: `<svg viewBox="0 0 24 24" fill="#000000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  },
  {
    id: 'wifi',
    name: 'WiFi',
    color: '#287A74',
    svg: `<svg viewBox="0 0 24 24" fill="#287A74"><path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21L24 8.98C20.93 5.9 16.69 4 12 4M12 7.07C15.34 7.07 18.36 8.35 20.65 10.45L12 19.12L3.35 10.45C5.64 8.35 8.66 7.07 12 7.07M12 10.15C13.88 10.15 15.6 10.87 16.92 12.06L12 17L7.08 12.06C8.4 10.87 10.12 10.15 12 10.15Z"/></svg>`,
  },
  {
    id: 'location',
    name: 'Location',
    color: '#EA4335',
    svg: `<svg viewBox="0 0 24 24" fill="#EA4335"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    svg: `<svg viewBox="0 0 24 24" fill="#0A66C2"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z"/></svg>`,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    svg: `<svg viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  },
  {
    id: 'web',
    name: 'Website',
    color: '#287A74',
    svg: `<svg viewBox="0 0 24 24" fill="#287A74"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
  },
];

export const getPresetLogoDataUrl = (svgString: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

// Format QR code payload
export const formatQRData = (data: QRCodeData): string => {
  switch (data.type) {
    case 'url': {
      const val = data.value.trim();
      if (!val) return 'https://example.com';
      if (!val.match(/^https?:\/\//i)) {
        return `https://${val}`;
      }
      return val;
    }
    case 'text':
      return data.value;
    case 'email': {
      try {
        const parsed = JSON.parse(data.value || '{}');
        const email = parsed.email || '';
        const subject = encodeURIComponent(parsed.subject || '');
        const body = encodeURIComponent(parsed.body || '');
        let mailto = `mailto:${email}`;
        const params: string[] = [];
        if (subject) params.push(`subject=${subject}`);
        if (body) params.push(`body=${body}`);
        if (params.length > 0) mailto += `?${params.join('&')}`;
        return mailto;
      } catch {
        return `mailto:${data.value}`;
      }
    }
    case 'phone':
      return `tel:${data.value.replace(/\s+/g, '')}`;
    case 'sms': {
      try {
        const parsed = JSON.parse(data.value || '{}');
        const phone = (parsed.phone || '').replace(/\s+/g, '');
        const message = encodeURIComponent(parsed.message || '');
        return `smsto:${phone}:${parsed.message || ''}`;
      } catch {
        return `smsto:${data.value}:`;
      }
    }
    case 'whatsapp': {
      try {
        const parsed = JSON.parse(data.value || '{}');
        const phone = (parsed.phone || '').replace(/[^\d]/g, '');
        const text = encodeURIComponent(parsed.message || '');
        return text ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/${phone}`;
      } catch {
        const phone = data.value.replace(/[^\d]/g, '');
        return `https://wa.me/${phone}`;
      }
    }
    case 'wifi': {
      try {
        const wifiData = JSON.parse(data.value || '{}');
        const ssid = wifiData.ssid || '';
        const enc = wifiData.encryption || 'WPA';
        const pwd = wifiData.password || '';
        const hidden = wifiData.hidden ? 'true' : 'false';
        return `WIFI:S:${ssid};T:${enc};P:${pwd};H:${hidden};;`;
      } catch {
        return data.value;
      }
    }
    case 'vcard': {
      try {
        const v = JSON.parse(data.value || '{}');
        return `BEGIN:VCARD
VERSION:3.0
N:${v.lastName || ''};${v.firstName || ''};;;
FN:${[v.firstName, v.lastName].filter(Boolean).join(' ')}
ORG:${v.organization || ''}
TITLE:${v.title || ''}
TEL;TYPE=CELL:${v.phone || ''}
TEL;TYPE=WORK:${v.workPhone || ''}
EMAIL;TYPE=INTERNET:${v.email || ''}
URL:${v.website || ''}
ADR;TYPE=WORK:;;${v.address || ''};${v.city || ''};${v.state || ''};${v.zip || ''};${v.country || ''}
NOTE:${v.note || ''}
END:VCARD`;
      } catch {
        return data.value;
      }
    }
    case 'mecard': {
      try {
        const v = JSON.parse(data.value || '{}');
        return `MECARD:N:${v.lastName || ''},${v.firstName || ''};TEL:${v.phone || ''};EMAIL:${v.email || ''};URL:${v.website || ''};NOTE:${v.note || ''};;`;
      } catch {
        return data.value;
      }
    }
    case 'location': {
      try {
        const loc = JSON.parse(data.value || '{}');
        const lat = loc.latitude || '0';
        const lng = loc.longitude || '0';
        return `https://maps.google.com/local?q=${lat},${lng}`;
      } catch {
        return data.value;
      }
    }
    case 'event': {
      try {
        const ev = JSON.parse(data.value || '{}');
        const formatDT = (dStr: string) => (dStr ? dStr.replace(/[-:]/g, '') : '20261015T100000Z');
        return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${ev.title || 'Event'}
LOCATION:${ev.location || ''}
DESCRIPTION:${ev.description || ''}
DTSTART:${formatDT(ev.start)}
DTEND:${formatDT(ev.end)}
END:VEVENT
END:VCALENDAR`;
      } catch {
        return data.value;
      }
    }
    case 'crypto': {
      try {
        const c = JSON.parse(data.value || '{}');
        const coin = c.coin || 'bitcoin';
        const addr = c.address || '';
        const amt = c.amount ? `?amount=${c.amount}` : '';
        return `${coin}:${addr}${amt}`;
      } catch {
        return `bitcoin:${data.value}`;
      }
    }
    default:
      return data.value;
  }
};

// Validate QR code data
export const validateQRData = (data: QRCodeData): QRCodeData => {
  const { type, value } = data;
  let error = '';

  // Do not flag an empty string as an aggressive error while user is editing
  if (!value || !value.trim()) {
    return { ...data, error: '' };
  }

  try {
    switch (type) {
      case 'url': {
        const val = value.trim();
        // Check for invalid spaces or obvious malformed strings
        if (val.includes(' ')) {
          error = 'URLs cannot contain spaces. Use a valid domain or web link.';
        } else if (!val.match(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/i)) {
          if (!val.match(/^https?:\/\//i) && !val.includes('.')) {
            error = 'Please enter a valid web domain or URL (e.g. example.com)';
          }
        }
        break;
      }
      case 'email':
        try {
          const parsed = JSON.parse(value);
          if (parsed.email && !parsed.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            error = 'Please check the recipient email address format';
          }
        } catch {
          if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            error = 'Please check the recipient email address format';
          }
        }
        break;
      case 'phone':
        if (value.length > 4 && !value.match(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3,}[-\s.]?[0-9]{3,}$/)) {
          error = 'Please enter a valid phone number (include country code)';
        }
        break;
      case 'wifi':
        try {
          const parsed = JSON.parse(value);
          if (!parsed.ssid || !parsed.ssid.trim()) {
            error = 'WiFi Network Name (SSID) is required';
          }
        } catch {
          error = '';
        }
        break;
      default:
        break;
    }
  } catch {
    // Keep clean
  }

  return { ...data, error };
};

// Helper to check if a module (row, col) is part of finder patterns
export const isFinderPattern = (row: number, col: number, size: number): boolean => {
  // Top-left
  if (row < 7 && col < 7) return true;
  // Top-right
  if (row < 7 && col >= size - 7) return true;
  // Bottom-left
  if (row >= size - 7 && col < 7) return true;
  return false;
};

// Draw custom finder outer eye frame
const drawEyeFrame = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  shape: QREyeFrameType,
  color: string
) => {
  ctx.save();
  ctx.fillStyle = color;
  const strokeW = size / 7; // 1 module thickness
  
  if (shape === 'rounded') {
    const rOuter = size * 0.28;
    const rInner = size * 0.16;
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, rOuter);
    ctx.roundRect(x + strokeW, y + strokeW, size - strokeW * 2, size - strokeW * 2, rInner);
    ctx.fill('evenodd');
  } else if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.arc(x + size / 2, y + size / 2, size / 2 - strokeW, 0, Math.PI * 2, true);
    ctx.fill('evenodd');
  } else if (shape === 'leaf') {
    // Teardrop / Leaf: rounded top-left and bottom-right, sharp others
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, [size * 0.45, size * 0.05, size * 0.45, size * 0.05]);
    ctx.roundRect(
      x + strokeW,
      y + strokeW,
      size - strokeW * 2,
      size - strokeW * 2,
      [size * 0.3, size * 0.02, size * 0.3, size * 0.02]
    );
    ctx.fill('evenodd');
  } else if (shape === 'diamond') {
    const cx = x + size / 2;
    const cy = y + size / 2;
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.lineTo(x + size, cy);
    ctx.lineTo(cx, y + size);
    ctx.lineTo(x, cy);
    ctx.closePath();
    ctx.fill();
    // Hollow out inner
    const inSize = size - strokeW * 2;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.moveTo(cx, cy - inSize / 2);
    ctx.lineTo(cx + inSize / 2, cy);
    ctx.lineTo(cx, cy + inSize / 2);
    ctx.lineTo(cx - inSize / 2, cy);
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  } else {
    // Standard Square
    ctx.fillRect(x, y, size, size);
    ctx.clearRect(x + strokeW, y + strokeW, size - strokeW * 2, size - strokeW * 2);
  }
  ctx.restore();
};

// Draw custom finder inner eye ball
const drawEyeBall = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  shape: QREyeBallType,
  color: string
) => {
  ctx.save();
  ctx.fillStyle = color;
  const offset = (size / 7) * 2; // centered 3x3 modules
  const ballSize = (size / 7) * 3;
  const bx = x + offset;
  const by = y + offset;

  if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(bx + ballSize / 2, by + ballSize / 2, ballSize / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === 'rounded') {
    ctx.beginPath();
    ctx.roundRect(bx, by, ballSize, ballSize, ballSize * 0.35);
    ctx.fill();
  } else if (shape === 'leaf') {
    ctx.beginPath();
    ctx.roundRect(bx, by, ballSize, ballSize, [ballSize * 0.45, 0, ballSize * 0.45, 0]);
    ctx.fill();
  } else if (shape === 'diamond') {
    const cx = bx + ballSize / 2;
    const cy = by + ballSize / 2;
    ctx.beginPath();
    ctx.moveTo(cx, by);
    ctx.lineTo(bx + ballSize, cy);
    ctx.lineTo(cx, by + ballSize);
    ctx.lineTo(bx, cy);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillRect(bx, by, ballSize, ballSize);
  }
  ctx.restore();
};

// Draw a single QR body module
const drawBodyModule = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  shape: QRShapeType
) => {
  if (shape === 'dots') {
    const radius = size * 0.45;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, radius, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === 'rounded') {
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, size * 0.35);
    ctx.fill();
  } else if (shape === 'classy') {
    // Diamond
    const cx = x + size / 2;
    const cy = y + size / 2;
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.lineTo(x + size, cy);
    ctx.lineTo(cx, y + size);
    ctx.lineTo(x, cy);
    ctx.closePath();
    ctx.fill();
  } else if (shape === 'classy-rounded') {
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, [size * 0.45, size * 0.05, size * 0.45, size * 0.05]);
    ctx.fill();
  } else if (shape === 'diamond') {
    const cx = x + size / 2;
    const cy = y + size / 2;
    ctx.beginPath();
    ctx.moveTo(cx, y + size * 0.1);
    ctx.lineTo(x + size * 0.9, cy);
    ctx.lineTo(cx, y + size * 0.9);
    ctx.lineTo(x + size * 0.1, cy);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillRect(x, y, size, size);
  }
};

// Main function to draw QR code on Canvas with all studio customizations
export const renderQRCodeToCanvas = async (
  canvas: HTMLCanvasElement,
  data: QRCodeData,
  design: QRDesign,
  targetWidth: number = 1000
): Promise<void> => {
  const formatted = formatQRData(data);
  const qr = QRCode.create(formatted, {
    errorCorrectionLevel: design.errorCorrectionLevel,
  });

  const matrixSize = qr.modules.size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Layout sizing
  const hasFrame = design.frameType !== 'none';
  const frameText = design.frameText || 'SCAN ME';
  
  // Extra space for frames
  let topExtra = 0;
  let bottomExtra = 0;
  let horizontalExtra = 0;

  if (design.frameType === 'top-banner') {
    topExtra = targetWidth * 0.18;
  } else if (design.frameType === 'bottom-banner') {
    bottomExtra = targetWidth * 0.18;
  } else if (design.frameType === 'phone') {
    topExtra = targetWidth * 0.16;
    bottomExtra = targetWidth * 0.22;
    horizontalExtra = targetWidth * 0.08;
  } else if (design.frameType === 'card') {
    topExtra = targetWidth * 0.1;
    bottomExtra = targetWidth * 0.24;
    horizontalExtra = targetWidth * 0.06;
  } else if (design.frameType === 'badge') {
    topExtra = targetWidth * 0.12;
    bottomExtra = targetWidth * 0.2;
    horizontalExtra = targetWidth * 0.06;
  }

  const canvasWidth = targetWidth + horizontalExtra * 2;
  const canvasHeight = targetWidth + topExtra + bottomExtra;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Background
  if (!design.isTransparent) {
    ctx.fillStyle = design.backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  } else {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  }

  // QR rendering coordinate box
  const qrX = horizontalExtra;
  const qrY = topExtra;
  const qrSize = targetWidth;

  const marginBlocks = design.margin;
  const totalBlocks = matrixSize + marginBlocks * 2;
  const blockSize = qrSize / totalBlocks;
  const originX = qrX + marginBlocks * blockSize;
  const originY = qrY + marginBlocks * blockSize;

  // Frame Background / Accents
  if (hasFrame) {
    ctx.save();
    ctx.fillStyle = design.frameColor;

    if (design.frameType === 'bottom-banner') {
      const bannerH = bottomExtra * 0.65;
      const bannerY = qrY + qrSize - blockSize * marginBlocks * 0.3;
      const bannerW = qrSize * 0.72;
      const bannerX = qrX + (qrSize - bannerW) / 2;

      ctx.beginPath();
      ctx.roundRect(bannerX, bannerY, bannerW, bannerH, bannerH / 2);
      ctx.fill();

      // Text
      ctx.fillStyle = design.frameTextColor;
      ctx.font = `bold ${Math.round(bannerH * 0.44)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(frameText.toUpperCase(), bannerX + bannerW / 2, bannerY + bannerH / 2 + 1);
    } else if (design.frameType === 'top-banner') {
      const bannerH = topExtra * 0.65;
      const bannerY = qrY - topExtra * 0.8;
      const bannerW = qrSize * 0.72;
      const bannerX = qrX + (qrSize - bannerW) / 2;

      ctx.beginPath();
      ctx.roundRect(bannerX, bannerY, bannerW, bannerH, bannerH / 2);
      ctx.fill();

      ctx.fillStyle = design.frameTextColor;
      ctx.font = `bold ${Math.round(bannerH * 0.44)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(frameText.toUpperCase(), bannerX + bannerW / 2, bannerY + bannerH / 2 + 1);
    } else if (design.frameType === 'phone') {
      // Smartphone bezel outline
      ctx.strokeStyle = design.frameColor;
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.roundRect(horizontalExtra * 0.5, 12, canvasWidth - horizontalExtra, canvasHeight - 24, 48);
      ctx.stroke();

      // Top speaker notch
      ctx.fillStyle = design.frameColor;
      ctx.beginPath();
      ctx.roundRect(canvasWidth / 2 - 50, 24, 100, 10, 5);
      ctx.fill();

      // Bottom bar
      const bottomBarW = canvasWidth * 0.35;
      ctx.beginPath();
      ctx.roundRect((canvasWidth - bottomBarW) / 2, canvasHeight - 32, bottomBarW, 8, 4);
      ctx.fill();

      // Text below QR
      ctx.font = `bold 28px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(frameText.toUpperCase(), canvasWidth / 2, canvasHeight - 56);
    } else if (design.frameType === 'card' || design.frameType === 'badge') {
      // Subtle card frame outline
      ctx.strokeStyle = design.frameColor;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(16, 16, canvasWidth - 32, canvasHeight - 32, 24);
      ctx.stroke();

      // Bottom banner text pill
      const pillH = 46;
      const pillW = canvasWidth * 0.65;
      ctx.fillStyle = design.frameColor;
      ctx.beginPath();
      ctx.roundRect((canvasWidth - pillW) / 2, canvasHeight - 74, pillW, pillH, pillH / 2);
      ctx.fill();

      ctx.fillStyle = design.frameTextColor;
      ctx.font = `bold 22px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(frameText.toUpperCase(), canvasWidth / 2, canvasHeight - 74 + pillH / 2);
    }
    ctx.restore();
  }

  // Gradient preparation for QR body
  let bodyFillStyle: string | CanvasGradient = design.foregroundColor;
  if (design.useGradient) {
    let grad: CanvasGradient;
    if (design.gradientDirection === 'to-r') {
      grad = ctx.createLinearGradient(originX, originY, originX + matrixSize * blockSize, originY);
    } else if (design.gradientDirection === 'to-b') {
      grad = ctx.createLinearGradient(originX, originY, originX, originY + matrixSize * blockSize);
    } else if (design.gradientDirection === 'to-tr') {
      grad = ctx.createLinearGradient(originX, originY + matrixSize * blockSize, originX + matrixSize * blockSize, originY);
    } else {
      // to-br
      grad = ctx.createLinearGradient(originX, originY, originX + matrixSize * blockSize, originY + matrixSize * blockSize);
    }
    grad.addColorStop(0, design.foregroundColor);
    grad.addColorStop(1, design.gradientColor2);
    bodyFillStyle = grad;
  }

  // Logo bounding box check
  let logoMinRow = -1;
  let logoMaxRow = -1;
  let logoMinCol = -1;
  let logoMaxCol = -1;

  if (design.logoImage && design.logoPadding) {
    const center = Math.floor(matrixSize / 2);
    const radius = Math.ceil((matrixSize * (design.logoSize / 100)) / 2) + 1;
    logoMinRow = center - radius;
    logoMaxRow = center + radius;
    logoMinCol = center - radius;
    logoMaxCol = center + radius;
  }

  // Draw Body Modules
  ctx.save();
  ctx.fillStyle = bodyFillStyle;

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Skip finder pattern areas (will be drawn with custom eye shapes)
      if (isFinderPattern(r, c, matrixSize)) continue;

      // Skip logo area for clean cutout
      if (design.logoImage && design.logoPadding) {
        if (r >= logoMinRow && r <= logoMaxRow && c >= logoMinCol && c <= logoMaxCol) {
          continue;
        }
      }

      if (qr.modules.get(r, c)) {
        const bx = originX + c * blockSize;
        const by = originY + r * blockSize;
        drawBodyModule(ctx, bx, by, blockSize, design.shape);
      }
    }
  }
  ctx.restore();

  // Draw Finder Patterns (3 corners)
  const finderPositions = [
    { r: 0, c: 0 },
    { r: 0, c: matrixSize - 7 },
    { r: matrixSize - 7, c: 0 },
  ];

  const eyeSize = 7 * blockSize;

  for (const pos of finderPositions) {
    const fx = originX + pos.c * blockSize;
    const fy = originY + pos.r * blockSize;

    // Draw outer eye frame
    drawEyeFrame(ctx, fx, fy, eyeSize, design.eyeFrameShape, design.cornerSquareColor);

    // Draw inner eye ball
    drawEyeBall(ctx, fx, fy, eyeSize, design.eyeBallShape, design.cornerDotColor);
  }

  // Draw Logo in center if present
  if (design.logoImage) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const centerX = originX + (matrixSize * blockSize) / 2;
        const centerY = originY + (matrixSize * blockSize) / 2;
        const maxLogoDim = matrixSize * blockSize * (design.logoSize / 100);

        // Aspect ratio calculation
        const aspect = img.width / img.height;
        let lw = maxLogoDim;
        let lh = maxLogoDim;
        if (aspect > 1) {
          lh = maxLogoDim / aspect;
        } else {
          lw = maxLogoDim * aspect;
        }

        const lx = centerX - lw / 2;
        const ly = centerY - lh / 2;

        // Draw protective background badge
        const pad = maxLogoDim * 0.18;
        ctx.save();
        ctx.fillStyle = design.backgroundColor || '#FFFFFF';
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        ctx.beginPath();
        ctx.roundRect(lx - pad, ly - pad, lw + pad * 2, lh + pad * 2, (maxLogoDim + pad * 2) * 0.25);
        ctx.fill();
        ctx.restore();

        // Draw image
        ctx.drawImage(img, lx, ly, lw, lh);
        resolve();
      };
      img.onerror = () => {
        resolve();
      };
      img.src = design.logoImage;
    });
  }
};

// Generate pure SVG string
export const generateQRCodeSVG = (data: QRCodeData, design: QRDesign): string => {
  const formatted = formatQRData(data);
  const qr = QRCode.create(formatted, {
    errorCorrectionLevel: design.errorCorrectionLevel,
  });

  const matrixSize = qr.modules.size;
  const margin = design.margin;
  const total = matrixSize + margin * 2;
  const modSize = 10;
  const svgSize = total * modSize;

  let rects = '';
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (qr.modules.get(r, c)) {
        const x = (c + margin) * modSize;
        const y = (r + margin) * modSize;
        rects += `<rect x="${x}" y="${y}" width="${modSize}" height="${modSize}" rx="${design.shape === 'rounded' ? 3 : 0}" fill="${design.foregroundColor}" />\n`;
      }
    }
  }

  const bgRect = design.isTransparent ? '' : `<rect width="100%" height="100%" fill="${design.backgroundColor}" />\n`;

  return `<?xml version="1.0" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}">
  ${bgRect}
  ${rects}
</svg>`;
};

// Download as PDF using jsPDF
export const downloadQRCodeAsPDF = async (canvas: HTMLCanvasElement, fileName: string = 'qr-studio'): Promise<void> => {
  const dataUrl = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Header Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(40, 122, 116); // #287A74
  pdf.text('QR Studio', pageWidth / 2, 28, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(100, 110, 115);
  pdf.text('Pixel-Perfect High Resolution QR Code • 100% Free', pageWidth / 2, 36, { align: 'center' });

  // QR Image centered
  const qrSide = 120; // 120mm
  const qrX = (pageWidth - qrSide) / 2;
  const qrY = 48;
  pdf.addImage(dataUrl, 'PNG', qrX, qrY, qrSide, qrSide);

  // Divider
  pdf.setDrawColor(174, 238, 211); // #AEEED3
  pdf.setLineWidth(0.5);
  pdf.line(qrX, qrY + qrSide + 12, qrX + qrSide, qrY + qrSide + 12);

  // Footer instructions
  pdf.setFontSize(10);
  pdf.setTextColor(85, 169, 160); // #55A9A0
  pdf.text('Ready to print or scan directly with any modern smartphone camera.', pageWidth / 2, qrY + qrSide + 22, { align: 'center' });

  pdf.save(`${fileName}.pdf`);
};

// Copy QR Code image directly to Clipboard
export const copyCanvasToClipboard = async (canvas: HTMLCanvasElement): Promise<boolean> => {
  try {
    return await new Promise<boolean>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        navigator.clipboard
          .write([new ClipboardItem({ 'image/png': blob })])
          .then(() => resolve(true))
          .catch(() => resolve(false));
      }, 'image/png');
    });
  } catch {
    return false;
  }
};
