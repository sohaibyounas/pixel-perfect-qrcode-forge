
import { useRef, useEffect, useState } from "react";
import { QRCodeData, QRDesign, generateQRCode } from "@/lib/qr-utils";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { toast } from "sonner";

interface QRCanvasProps {
  qrData: QRCodeData;
  design: QRDesign;
}

const QRCanvas: React.FC<QRCanvasProps> = ({ qrData, design }) => {
  const [qrCodeSrc, setQrCodeSrc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateCode = async () => {
      if (qrData.error) {
        return;
      }
      
      try {
        setLoading(true);
        const dataUrl = await generateQRCode(qrData, design);
        setQrCodeSrc(dataUrl);
      } catch (error) {
        console.error("Failed to generate QR code:", error);
        toast.error("Failed to generate QR code");
      } finally {
        setLoading(false);
      }
    };

    generateCode();
  }, [qrData, design]);

  const handleDownload = async (format: 'png' | 'svg' | 'pdf') => {
    if (!canvasRef.current) return;

    try {
      let fileName = `qrcode-${Date.now()}`;

      if (format === 'png') {
        const dataUrl = await htmlToImage.toPng(canvasRef.current);
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = dataUrl;
        link.click();
        toast.success("QR code downloaded as PNG");
      } 
      else if (format === 'svg') {
        const dataUrl = await htmlToImage.toSvg(canvasRef.current);
        const link = document.createElement('a');
        link.download = `${fileName}.svg`;
        link.href = dataUrl;
        link.click();
        toast.success("QR code downloaded as SVG");
      }
      else if (format === 'pdf') {
        const dataUrl = await htmlToImage.toPng(canvasRef.current);
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${fileName}.pdf`);
        toast.success("QR code downloaded as PDF");
      }
    } catch (error) {
      console.error("Failed to download QR code:", error);
      toast.error("Failed to download QR code");
    }
  };

  const renderQRCode = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      );
    }

    // QR code with frames and styling
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {design.frameShape !== 'none' && (
          <div 
            className={`absolute inset-0 flex items-center justify-center ${design.frameShape === 'rounded' ? 'rounded-2xl' : ''}`} 
            style={{ 
              border: `8px solid ${design.frameColor}`,
              padding: '24px',
            }}
          >
            {design.frameText && (
              <div 
                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-1 text-sm font-bold"
                style={{ 
                  backgroundColor: design.frameColor,
                  color: design.backgroundColor,
                }}
              >
                {design.frameText}
              </div>
            )}
          </div>
        )}

        <div className="relative">
          <img 
            src={qrCodeSrc} 
            alt="QR Code" 
            className="w-64 h-64 object-contain"
          />
          
          {design.logoImage && (
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md overflow-hidden bg-white p-1"
              style={{ 
                width: `${design.logoSize}%`, 
                height: `${design.logoSize}%`,
                maxWidth: '30%',
                maxHeight: '30%',
              }}
            >
              <img 
                src={design.logoImage} 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div 
        ref={canvasRef}
        className="w-full max-w-sm aspect-square bg-white rounded-lg shadow-md flex items-center justify-center p-4 overflow-hidden"
        style={{ backgroundColor: design.backgroundColor }}
      >
        {renderQRCode()}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button 
          onClick={() => handleDownload('png')} 
          className="flex items-center gap-2"
          disabled={loading || !!qrData.error}
        >
          <Download className="w-4 h-4" />
          PNG
        </Button>
        <Button 
          onClick={() => handleDownload('svg')} 
          className="flex items-center gap-2"
          variant="outline"
          disabled={loading || !!qrData.error}
        >
          <Download className="w-4 h-4" />
          SVG
        </Button>
        <Button 
          onClick={() => handleDownload('pdf')} 
          className="flex items-center gap-2"
          variant="outline"
          disabled={loading || !!qrData.error}
        >
          <Download className="w-4 h-4" />
          PDF
        </Button>
      </div>
    </div>
  );
};

export default QRCanvas;
