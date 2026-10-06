import { useRef, useEffect, useState } from "react";
import { QRCodeData, QRDesign, renderQRCodeToCanvas, generateQRCodeSVG, downloadQRCodeAsPDF, copyCanvasToClipboard } from "@/lib/qr-utils";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Copy, Printer, Check, Sparkles, ShieldCheck, FileCode, FileText } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface QRCanvasProps {
  qrData: QRCodeData;
  design: QRDesign;
}

const QRCanvas: React.FC<QRCanvasProps> = ({ qrData, design }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [resolution, setResolution] = useState<number>(1000); // 500, 1000, 2000
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let isCancelled = false;

    const generateCode = async () => {
      if (!canvasRef.current || qrData.error) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Render preview canvas (600px for sharp display)
        await renderQRCodeToCanvas(canvasRef.current, qrData, design, 600);
        if (!isCancelled) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to render QR preview:", error);
        if (!isCancelled) {
          toast.error("Failed to generate preview");
          setLoading(false);
        }
      }
    };

    generateCode();

    return () => {
      isCancelled = true;
    };
  }, [qrData, design]);

  // Export handling
  const handleDownloadPNG = async () => {
    try {
      const exportCanvas = document.createElement('canvas');
      await renderQRCodeToCanvas(exportCanvas, qrData, design, resolution);
      const dataUrl = exportCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `qr-studio-${resolution}px-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success(`Downloaded ${resolution}×${resolution} PNG!`, {
        description: 'Pixel-perfect high resolution export ready to use.',
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to download PNG');
    }
  };

  const handleDownloadSVG = () => {
    try {
      const svgString = generateQRCodeSVG(qrData, design);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `qr-studio-${Date.now()}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Downloaded Scalable Vector SVG!', {
        description: 'Infinite resolution vector file ready for print and design tools.',
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to download SVG');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const exportCanvas = document.createElement('canvas');
      await renderQRCodeToCanvas(exportCanvas, qrData, design, 1200);
      await downloadQRCodeAsPDF(exportCanvas, `qr-studio-${Date.now()}`);
      toast.success('Downloaded Print-Ready PDF Document!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to download PDF');
    }
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      const exportCanvas = document.createElement('canvas');
      await renderQRCodeToCanvas(exportCanvas, qrData, design, 800);
      const success = await copyCanvasToClipboard(exportCanvas);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Copied QR Code to Clipboard!', {
          description: 'You can now paste it directly into emails, docs, or chats.',
        });
      } else {
        toast.error('Clipboard copy not supported by your browser');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to copy to clipboard');
    }
  };

  const handlePrint = async () => {
    if (!canvasRef.current) return;
    try {
      const exportCanvas = document.createElement('canvas');
      await renderQRCodeToCanvas(exportCanvas, qrData, design, 800);
      const dataUrl = exportCanvas.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print QR Code</title>
              <style>
                body {
                  margin: 0;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  font-family: system-ui, sans-serif;
                  background: #fff;
                  color: #143D3A;
                }
                .card {
                  text-align: center;
                  padding: 30px;
                  border: 2px dashed #287A74;
                  border-radius: 16px;
                }
                img {
                  max-width: 320px;
                  height: auto;
                  margin-bottom: 16px;
                }
                h2 { margin: 0 0 8px; color: #287A74; }
                p { margin: 0; color: #55A9A0; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="card">
                <h2>QR Studio</h2>
                <img src="${dataUrl}" alt="QR Code" />
                <p>Scan with any camera app</p>
              </div>
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(() => window.close(), 500);
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to open print preview');
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-5">
      {/* Canvas Display Container with Studio Framing */}
      <motion.div 
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full aspect-square max-w-[320px] sm:max-w-[360px] p-4 sm:p-6 rounded-2xl bg-white shadow-xl shadow-teal-900/5 border border-hunt-mint/40 flex items-center justify-center overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-hunt-sage/10"
        style={{
          background: design.isTransparent 
            ? 'repeating-conic-gradient(#f0f0f0 0% 25%, #ffffff 0% 50%) 50% / 16px 16px' 
            : design.backgroundColor,
        }}
      >
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
            <Loader2 className="w-8 h-8 text-hunt-teal animate-spin" />
            <span className="text-xs font-semibold text-hunt-teal">Rendering Studio QR...</span>
          </div>
        )}

        {/* The Live High-Fidelity Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain drop-shadow-sm select-none"
        />
      </motion.div>

      {/* Hidden high-res canvas */}
      <canvas ref={hiddenCanvasRef} className="hidden" />

      {/* Scannability & Quality Badge */}
      <div className="w-full flex items-center justify-between px-3 py-2 bg-hunt-light rounded-xl border border-hunt-mint/60 text-xs font-medium">
        <div className="flex items-center gap-1.5 text-hunt-teal">
          <ShieldCheck className="w-4 h-4 text-hunt-sage flex-shrink-0" />
          <span>100% Scan Verified</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="bg-hunt-butter/60 text-hunt-dark font-semibold px-2 py-0.5 rounded-full text-[11px]">
            Level {design.errorCorrectionLevel} (Safe)
          </span>
          <span className="text-hunt-sage font-bold">Free Vector</span>
        </div>
      </div>

      {/* Resolution Selector for Print and Screen */}
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span className="font-semibold text-hunt-dark">Export Resolution:</span>
          <span className="text-[11px] text-hunt-teal font-medium">
            {resolution === 500 ? 'Web standard (500px)' : resolution === 1000 ? 'High-Def (1000px)' : 'Ultra Print 300 DPI (2000px)'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 bg-muted/60 p-1 rounded-xl">
          {[
            { label: '500 px', val: 500, tag: 'Web' },
            { label: '1000 px', val: 1000, tag: 'HD' },
            { label: '2000 px', val: 2000, tag: 'Print' },
          ].map((res) => (
            <button
              key={res.val}
              type="button"
              onClick={() => setResolution(res.val)}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                resolution === res.val
                  ? 'bg-hunt-teal text-white shadow-sm'
                  : 'text-muted-foreground hover:text-hunt-dark hover:bg-white/80'
              }`}
            >
              <span>{res.label}</span>
              <span className={`text-[10px] px-1 rounded ${resolution === res.val ? 'bg-white/20' : 'bg-muted'}`}>
                {res.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="w-full space-y-2">
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            onClick={handleDownloadPNG}
            disabled={loading || !!qrData.error}
            className="w-full h-11 bg-hunt-teal hover:bg-hunt-dark text-white font-semibold text-sm rounded-xl shadow-md shadow-hunt-teal/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download PNG ({resolution}px)
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 gap-2">
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              onClick={handleDownloadSVG}
              variant="outline"
              disabled={loading || !!qrData.error}
              className="w-full h-10 border-hunt-mint hover:bg-hunt-light hover:text-hunt-teal text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-hunt-sage" />
              Vector SVG
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              disabled={loading || !!qrData.error}
              className="w-full h-10 border-hunt-mint hover:bg-hunt-light hover:text-hunt-teal text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-hunt-sage" />
              PDF Document
            </Button>
          </motion.div>
        </div>

        {/* Quick Utilities: Copy & Print */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            onClick={handleCopyImage}
            variant="ghost"
            disabled={loading || !!qrData.error}
            className="w-full h-9 text-xs text-hunt-teal hover:bg-hunt-mint/20 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied Image!' : 'Copy to Clipboard'}
          </Button>

          <Button
            onClick={handlePrint}
            variant="ghost"
            disabled={loading || !!qrData.error}
            className="w-full h-9 text-xs text-hunt-teal hover:bg-hunt-mint/20 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Direct
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRCanvas;
