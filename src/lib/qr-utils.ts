
import QRCode from 'qrcode';

export type QRCodeType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard';

export type QRShapeType = 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded';

export type QRCodeData = {
  type: QRCodeType;
  value: string;
  error?: string;
};

export type QRDesign = {
  foregroundColor: string;
  backgroundColor: string;
  cornerSquareColor: string;
  cornerDotColor: string;
  shape: QRShapeType;
  logoImage: string | null;
  logoSize: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number;
  frameText: string;
  frameColor: string;
  frameShape: 'none' | 'square' | 'rounded';
};

export const DEFAULT_DESIGN: QRDesign = {
  foregroundColor: '#000000',
  backgroundColor: '#FFFFFF',
  cornerSquareColor: '#000000',
  cornerDotColor: '#000000',
  shape: 'square',
  logoImage: null,
  logoSize: 30,
  errorCorrectionLevel: 'M',
  margin: 5,
  frameText: '',
  frameColor: '#000000',
  frameShape: 'none',
};

export const DEFAULT_QR_DATA: QRCodeData = {
  type: 'url',
  value: 'https://example.com',
};

export const SAMPLE_TEMPLATES = [
  {
    name: 'Classic Black',
    design: {
      ...DEFAULT_DESIGN,
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
    },
    thumbnail: '🖤'
  },
  {
    name: 'Blue Ocean',
    design: {
      ...DEFAULT_DESIGN,
      foregroundColor: '#3B82F6',
      backgroundColor: '#EFF6FF',
      cornerSquareColor: '#1E3A8A',
      shape: 'rounded',
    },
    thumbnail: '💙'
  },
  {
    name: 'Forest Green',
    design: {
      ...DEFAULT_DESIGN,
      foregroundColor: '#10B981',
      backgroundColor: '#ECFDF5',
      cornerSquareColor: '#065F46',
      shape: 'classy',
    },
    thumbnail: '💚'
  },
  {
    name: 'Royal Purple',
    design: {
      ...DEFAULT_DESIGN,
      foregroundColor: '#8B5CF6',
      backgroundColor: '#F5F3FF',
      cornerSquareColor: '#5B21B6',
      cornerDotColor: '#7C3AED',
      shape: 'dots',
    },
    thumbnail: '💜'
  },
  {
    name: 'Sunset Orange',
    design: {
      ...DEFAULT_DESIGN,
      foregroundColor: '#F97316',
      backgroundColor: '#FFF7ED',
      cornerSquareColor: '#C2410C',
      cornerDotColor: '#EA580C',
      shape: 'classy-rounded',
    },
    thumbnail: '🧡'
  },
];

// Format QR code data based on type
export const formatQRData = (data: QRCodeData): string => {
  switch (data.type) {
    case 'url':
      // Check if URL has http/https, if not, add https://
      if (!data.value.match(/^https?:\/\//i) && data.value.trim() !== '') {
        return `https://${data.value}`;
      }
      return data.value;
    case 'email':
      return `mailto:${data.value}`;
    case 'phone':
      return `tel:${data.value}`;
    case 'sms':
      return `sms:${data.value}`;
    case 'wifi':
      try {
        const wifiData = JSON.parse(data.value);
        return `WIFI:S:${wifiData.ssid};T:${wifiData.encryption};P:${wifiData.password};;`;
      } catch (e) {
        return data.value;
      }
    case 'vcard':
      try {
        const vcardData = JSON.parse(data.value);
        return `BEGIN:VCARD
VERSION:3.0
N:${vcardData.lastName};${vcardData.firstName};;;
FN:${vcardData.firstName} ${vcardData.lastName}
TEL;TYPE=CELL:${vcardData.phone}
EMAIL:${vcardData.email}
ORG:${vcardData.organization}
TITLE:${vcardData.title}
ADR;TYPE=WORK:;;${vcardData.address};;;;
END:VCARD`;
      } catch (e) {
        return data.value;
      }
    default:
      return data.value;
  }
};

// Generate QR code data URL
export const generateQRCode = async (
  data: QRCodeData,
  design: QRDesign
): Promise<string> => {
  try {
    const formattedData = formatQRData(data);
    
    const options = {
      errorCorrectionLevel: design.errorCorrectionLevel,
      margin: design.margin,
      color: {
        dark: design.foregroundColor,
        light: design.backgroundColor,
      },
    };

    return await QRCode.toDataURL(formattedData, options);
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

// Validate QR code data
export const validateQRData = (data: QRCodeData): QRCodeData => {
  const { type, value } = data;
  let error = '';

  if (!value.trim()) {
    error = 'Value cannot be empty';
    return { ...data, error };
  }

  switch (type) {
    case 'url':
      // Simple URL validation
      if (!value.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)) {
        error = 'Please enter a valid URL';
      }
      break;
    case 'email':
      // Simple email validation
      if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        error = 'Please enter a valid email address';
      }
      break;
    case 'phone':
      // Simple phone validation
      if (!value.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)) {
        error = 'Please enter a valid phone number';
      }
      break;
    default:
      break;
  }

  return { ...data, error };
};

// Function to download QR code
export const downloadQRCode = (dataUrl: string, format: 'png' | 'svg' | 'pdf', fileName: string) => {
  // For now, we only implement PNG download
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${fileName}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
