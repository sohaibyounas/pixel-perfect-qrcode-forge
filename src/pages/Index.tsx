
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_DESIGN, DEFAULT_QR_DATA, QRCodeData, QRDesign } from "@/lib/qr-utils";
import QRCanvas from "@/components/QRCanvas";
import DataInput from "@/components/DataInput";
import DesignCustomizer from "@/components/DesignCustomizer";
import { Toaster } from "sonner";
import { QrCode, Palette, Sparkles } from "lucide-react";

const Index = () => {
  const [qrData, setQrData] = useState<QRCodeData>(DEFAULT_QR_DATA);
  const [design, setDesign] = useState<QRDesign>(DEFAULT_DESIGN);

  const handleDataChange = (newData: QRCodeData) => {
    setQrData(newData);
  };

  const handleDesignChange = (newDesign: QRDesign) => {
    setDesign(newDesign);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="h-6 w-6 text-primary animate-spin-slow" />
            <h1 className="text-xl font-bold text-gray-900">QRCreate.com</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>Premium Features, Zero Cost</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Code Preview */}
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              QR Code Preview
            </h2>
            
            <QRCanvas qrData={qrData} design={design} />
          </div>

          {/* Customization Panel */}
          <div className="animate-fade-in">
            <Tabs defaultValue="data" className="space-y-4">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="data" className="flex items-center justify-center gap-2">
                  <QrCode className="h-4 w-4" />
                  <span>Data</span>
                </TabsTrigger>
                <TabsTrigger value="design" className="flex items-center justify-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span>Design</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="data" className="mt-6 space-y-4">
                <DataInput data={qrData} onDataChange={handleDataChange} />
              </TabsContent>

              <TabsContent value="design" className="mt-6 space-y-4">
                <DesignCustomizer design={design} onDesignChange={handleDesignChange} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Premium Features, All Free
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover-scale">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="text-lg font-semibold mb-2">Custom Styling</h3>
                <p className="text-muted-foreground">Customize colors, shapes, and patterns to match your brand identity.</p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">🖼️</div>
                <h3 className="text-lg font-semibold mb-2">Logo Integration</h3>
                <p className="text-muted-foreground">Add your logo or any image to the center of your QR code.</p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="text-lg font-semibold mb-2">Multiple Formats</h3>
                <p className="text-muted-foreground">Create QR codes for URLs, text, email, WiFi, vCard and more.</p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">⬇️</div>
                <h3 className="text-lg font-semibold mb-2">Multiple Export Options</h3>
                <p className="text-muted-foreground">Download your QR codes in PNG, SVG, or PDF formats for any use case.</p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">🖼️</div>
                <h3 className="text-lg font-semibold mb-2">Frames & Templates</h3>
                <p className="text-muted-foreground">Add frames with custom text or choose from pre-designed templates.</p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">✨</div>
                <h3 className="text-lg font-semibold mb-2">High Quality</h3>
                <p className="text-muted-foreground">Create high resolution QR codes with error correction for reliable scanning.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>QRCreate.com - All premium features, completely free.</p>
          <p className="mt-2">© {new Date().getFullYear()} - Designed with ❤️</p>
        </div>
      </footer>
      
      <Toaster position="top-right" />
    </div>
  );
};

export default Index;
