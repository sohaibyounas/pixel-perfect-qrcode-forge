
import { useState, useRef } from 'react';
import { QRDesign, QRShapeType, SAMPLE_TEMPLATES } from '@/lib/qr-utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Paintbrush, Image, QrCode, Shapes, SquareAsterisk, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface DesignCustomizerProps {
  design: QRDesign;
  onDesignChange: (design: QRDesign) => void;
}

const DesignCustomizer: React.FC<DesignCustomizerProps> = ({ design, onDesignChange }) => {
  const [localDesign, setLocalDesign] = useState<QRDesign>(design);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDesignChange = (updates: Partial<QRDesign>) => {
    const newDesign = { ...localDesign, ...updates };
    setLocalDesign(newDesign);
    onDesignChange(newDesign);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image is too large. Maximum size is 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        handleDesignChange({ logoImage: event.target.result as string });
        toast.success('Logo uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleShapeChange = (shape: QRShapeType) => {
    handleDesignChange({ shape });
  };

  const handleTemplateSelect = (templateIndex: number) => {
    const template = SAMPLE_TEMPLATES[templateIndex];
    handleDesignChange(template.design);
    toast.success(`Applied "${template.name}" template`);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="colors">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="colors" className="flex items-center gap-1.5">
              <Paintbrush className="h-4 w-4" />
              <span className="hidden sm:inline">Colors</span>
            </TabsTrigger>
            <TabsTrigger value="shapes" className="flex items-center gap-1.5">
              <Shapes className="h-4 w-4" />
              <span className="hidden sm:inline">Shapes</span>
            </TabsTrigger>
            <TabsTrigger value="logo" className="flex items-center gap-1.5">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Logo</span>
            </TabsTrigger>
            <TabsTrigger value="frames" className="flex items-center gap-1.5">
              <SquareAsterisk className="h-4 w-4" />
              <span className="hidden sm:inline">Frames</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-1.5">
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4">
            <Accordion type="single" collapsible defaultValue="colors">
              <AccordionItem value="colors">
                <AccordionTrigger>Colors</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="foreground-color">Foreground Color</Label>
                      <div className="flex gap-2">
                        <div
                          className="w-10 h-10 rounded-md border"
                          style={{ backgroundColor: localDesign.foregroundColor }}
                        />
                        <Input
                          id="foreground-color"
                          type="color"
                          value={localDesign.foregroundColor}
                          onChange={(e) => handleDesignChange({ foregroundColor: e.target.value })}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="background-color">Background Color</Label>
                      <div className="flex gap-2">
                        <div
                          className="w-10 h-10 rounded-md border"
                          style={{ backgroundColor: localDesign.backgroundColor }}
                        />
                        <Input
                          id="background-color"
                          type="color"
                          value={localDesign.backgroundColor}
                          onChange={(e) => handleDesignChange({ backgroundColor: e.target.value })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="corner-square-color">Corner Square Color</Label>
                      <div className="flex gap-2">
                        <div
                          className="w-10 h-10 rounded-md border"
                          style={{ backgroundColor: localDesign.cornerSquareColor }}
                        />
                        <Input
                          id="corner-square-color"
                          type="color"
                          value={localDesign.cornerSquareColor}
                          onChange={(e) => handleDesignChange({ cornerSquareColor: e.target.value })}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="corner-dot-color">Corner Dot Color</Label>
                      <div className="flex gap-2">
                        <div
                          className="w-10 h-10 rounded-md border"
                          style={{ backgroundColor: localDesign.cornerDotColor }}
                        />
                        <Input
                          id="corner-dot-color"
                          type="color"
                          value={localDesign.cornerDotColor}
                          onChange={(e) => handleDesignChange({ cornerDotColor: e.target.value })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="shapes" className="space-y-4">
            <div className="space-y-4">
              <Label>QR Code Shape</Label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                <div
                  className={`qr-item p-3 flex flex-col items-center ${
                    localDesign.shape === 'square' ? 'bg-accent/10 ring-1 ring-accent' : ''
                  }`}
                  onClick={() => handleShapeChange('square')}
                >
                  <div className="w-16 h-16 grid grid-cols-3 gap-1 p-2">
                    <div className="qr-dot" />
                    <div className="qr-dot" />
                    <div className="qr-dot" />
                    <div className="qr-dot" />
                    <div className="qr-dot" />
                    <div className="qr-dot" />
                    <div className="qr-dot" />
                    <div className="qr-dot" />
                    <div className="qr-dot" />
                  </div>
                  <span className="text-sm mt-2">Square</span>
                </div>
                
                <div
                  className={`qr-item p-3 flex flex-col items-center ${
                    localDesign.shape === 'rounded' ? 'bg-accent/10 ring-1 ring-accent' : ''
                  }`}
                  onClick={() => handleShapeChange('rounded')}
                >
                  <div className="w-16 h-16 grid grid-cols-3 gap-1 p-2">
                    <div className="qr-dot rounded-sm" />
                    <div className="qr-dot rounded-sm" />
                    <div className="qr-dot rounded-sm" />
                    <div className="qr-dot rounded-sm" />
                    <div className="qr-dot rounded-sm" />
                    <div className="qr-dot rounded-sm" />
                    <div className="qr-dot rounded-sm" />
                    <div className="qr-dot rounded-sm" />
                    <div className="qr-dot rounded-sm" />
                  </div>
                  <span className="text-sm mt-2">Rounded</span>
                </div>
                
                <div
                  className={`qr-item p-3 flex flex-col items-center ${
                    localDesign.shape === 'dots' ? 'bg-accent/10 ring-1 ring-accent' : ''
                  }`}
                  onClick={() => handleShapeChange('dots')}
                >
                  <div className="w-16 h-16 grid grid-cols-3 gap-1 p-2">
                    <div className="qr-dot-round" />
                    <div className="qr-dot-round" />
                    <div className="qr-dot-round" />
                    <div className="qr-dot-round" />
                    <div className="qr-dot-round" />
                    <div className="qr-dot-round" />
                    <div className="qr-dot-round" />
                    <div className="qr-dot-round" />
                    <div className="qr-dot-round" />
                  </div>
                  <span className="text-sm mt-2">Dots</span>
                </div>
                
                <div
                  className={`qr-item p-3 flex flex-col items-center ${
                    localDesign.shape === 'classy' ? 'bg-accent/10 ring-1 ring-accent' : ''
                  }`}
                  onClick={() => handleShapeChange('classy')}
                >
                  <div className="w-16 h-16 grid grid-cols-3 gap-1 p-2">
                    <div className="qr-dot" />
                    <div className="qr-dot" />
                    <div className="qr-dot" />
                    <div className="qr-dot" />
                    <div className="qr-dot opacity-0" />
                    <div className="qr-dot" />
                    <div className="qr-dot" />
                    <div className="qr-dot" />
                    <div className="qr-dot" />
                  </div>
                  <span className="text-sm mt-2">Classy</span>
                </div>
                
                <div
                  className={`qr-item p-3 flex flex-col items-center ${
                    localDesign.shape === 'classy-rounded' ? 'bg-accent/10 ring-1 ring-accent' : ''
                  }`}
                  onClick={() => handleShapeChange('classy-rounded')}
                >
                  <div className="w-16 h-16 grid grid-cols-3 gap-1 p-2">
                    <div className="qr-dot-round" />
                    <div className="qr-dot-round" />
                    <div className="qr-dot-round" />
                    <div className="qr-dot-round" />
                    <div className="qr-dot-round opacity-0" />
                    <div className="qr-dot-round" />
                    <div className="qr-dot-round" />
                    <div className="qr-dot-round" />
                    <div className="qr-dot-round" />
                  </div>
                  <span className="text-sm mt-2">Classy Rounded</span>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="error-correction">Error Correction Level</Label>
                    <span className="text-xs text-muted-foreground">
                      {localDesign.errorCorrectionLevel === 'L' ? 'Low (7%)' : 
                       localDesign.errorCorrectionLevel === 'M' ? 'Medium (15%)' : 
                       localDesign.errorCorrectionLevel === 'Q' ? 'Quartile (25%)' : 'High (30%)'}
                    </span>
                  </div>
                  <RadioGroup
                    value={localDesign.errorCorrectionLevel}
                    onValueChange={(value) => handleDesignChange({ 
                      errorCorrectionLevel: value as 'L' | 'M' | 'Q' | 'H' 
                    })}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="L" id="error-L" />
                      <Label htmlFor="error-L">L</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="M" id="error-M" />
                      <Label htmlFor="error-M">M</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Q" id="error-Q" />
                      <Label htmlFor="error-Q">Q</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="H" id="error-H" />
                      <Label htmlFor="error-H">H</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="margin">Margin Size</Label>
                    <span className="text-xs text-muted-foreground">{localDesign.margin} blocks</span>
                  </div>
                  <Slider
                    id="margin"
                    min={0}
                    max={10}
                    step={1}
                    value={[localDesign.margin]}
                    onValueChange={(value) => handleDesignChange({ margin: value[0] })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logo" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Logo Image</Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed p-6 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {localDesign.logoImage ? (
                    <div className="relative">
                      <img 
                        src={localDesign.logoImage} 
                        alt="Logo" 
                        className="max-w-[150px] max-h-[150px] object-contain mb-4" 
                      />
                      <button
                        className="absolute -top-3 -right-3 bg-destructive text-white rounded-full p-1 hover:bg-destructive/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDesignChange({ logoImage: null });
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18"></path>
                          <path d="m6 6 12 12"></path>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload logo (max 2MB)</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="logo-size">Logo Size</Label>
                  <span className="text-xs text-muted-foreground">{localDesign.logoSize}%</span>
                </div>
                <Slider
                  id="logo-size"
                  min={10}
                  max={50}
                  step={1}
                  value={[localDesign.logoSize]}
                  onValueChange={(value) => handleDesignChange({ logoSize: value[0] })}
                  disabled={!localDesign.logoImage}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="frames" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Frame Shape</Label>
                <RadioGroup
                  value={localDesign.frameShape}
                  onValueChange={(value) => handleDesignChange({ 
                    frameShape: value as 'none' | 'square' | 'rounded' 
                  })}
                >
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`qr-item p-3 flex flex-col items-center ${
                        localDesign.frameShape === 'none' ? 'bg-accent/10 ring-1 ring-accent' : ''
                      }`}
                      onClick={() => handleDesignChange({ frameShape: 'none' })}
                    >
                      <div className="w-16 h-16 flex items-center justify-center">
                        <div className="w-12 h-12 bg-gray-500/20 flex items-center justify-center">
                          <span className="text-2xl">🚫</span>
                        </div>
                      </div>
                      <span className="text-sm mt-2">No Frame</span>
                    </div>
                    
                    <div
                      className={`qr-item p-3 flex flex-col items-center ${
                        localDesign.frameShape === 'square' ? 'bg-accent/10 ring-1 ring-accent' : ''
                      }`}
                      onClick={() => handleDesignChange({ frameShape: 'square' })}
                    >
                      <div className="w-16 h-16 border-4 border-gray-800 flex items-center justify-center p-1">
                        <div className="w-full h-full bg-gray-500/20"></div>
                      </div>
                      <span className="text-sm mt-2">Square</span>
                    </div>
                    
                    <div
                      className={`qr-item p-3 flex flex-col items-center ${
                        localDesign.frameShape === 'rounded' ? 'bg-accent/10 ring-1 ring-accent' : ''
                      }`}
                      onClick={() => handleDesignChange({ frameShape: 'rounded' })}
                    >
                      <div className="w-16 h-16 border-4 border-gray-800 rounded-xl flex items-center justify-center p-1">
                        <div className="w-full h-full bg-gray-500/20 rounded-lg"></div>
                      </div>
                      <span className="text-sm mt-2">Rounded</span>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frame-text">Frame Text</Label>
                <Input
                  id="frame-text"
                  value={localDesign.frameText}
                  onChange={(e) => handleDesignChange({ frameText: e.target.value })}
                  placeholder="Scan me"
                  maxLength={20}
                  disabled={localDesign.frameShape === 'none'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frame-color">Frame Color</Label>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 rounded-md border"
                    style={{ backgroundColor: localDesign.frameColor }}
                  />
                  <Input
                    id="frame-color"
                    type="color"
                    value={localDesign.frameColor}
                    onChange={(e) => handleDesignChange({ frameColor: e.target.value })}
                    className="w-full"
                    disabled={localDesign.frameShape === 'none'}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SAMPLE_TEMPLATES.map((template, index) => (
                <div
                  key={template.name}
                  className={`qr-item border rounded-lg p-4 text-center cursor-pointer hover-scale ${
                    JSON.stringify(localDesign) === JSON.stringify(template.design)
                      ? 'ring-2 ring-primary bg-primary/5'
                      : ''
                  }`}
                  onClick={() => handleTemplateSelect(index)}
                >
                  <div className="text-4xl mb-2">{template.thumbnail}</div>
                  <h3 className="text-sm font-medium">{template.name}</h3>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DesignCustomizer;
