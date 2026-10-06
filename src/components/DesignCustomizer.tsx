import { useState, useRef } from 'react';
import { 
  QRDesign, 
  QRShapeType, 
  QREyeFrameType, 
  QREyeBallType, 
  QRFrameType, 
  SAMPLE_TEMPLATES, 
  PRESET_LOGOS, 
  getPresetLogoDataUrl 
} from '@/lib/qr-utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Paintbrush, 
  Image as ImageIcon, 
  Shapes, 
  SquareAsterisk, 
  Sparkles, 
  Upload, 
  Trash2, 
  Sliders, 
  CheckCircle2,
  Palette
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface DesignCustomizerProps {
  design: QRDesign;
  onDesignChange: (design: QRDesign) => void;
}

// Preset color swatches matching the Color Hunt palette and modern classics
const SWATCHES = [
  { name: 'Pine Teal', color: '#287A74' },
  { name: 'Sage Aqua', color: '#55A9A0' },
  { name: 'Mint Accent', color: '#AEEED3' },
  { name: 'Butter Gold', color: '#FFF8B0' },
  { name: 'Charcoal Dark', color: '#143D3A' },
  { name: 'Classic Black', color: '#000000' },
  { name: 'Deep Indigo', color: '#1E3A8A' },
  { name: 'Coral Red', color: '#E11D48' },
];

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

    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image is too large. Maximum size is 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        handleDesignChange({ 
          logoImage: event.target.result as string,
          errorCorrectionLevel: 'Q', // Automatically bump error correction for reliable scans
        });
        toast.success('Custom logo uploaded & scan protection enabled!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetLogo = (svg: string, name: string) => {
    const dataUrl = getPresetLogoDataUrl(svg);
    handleDesignChange({ 
      logoImage: dataUrl,
      errorCorrectionLevel: 'Q',
    });
    toast.success(`Applied ${name} logo badge`);
  };

  const handleTemplateSelect = (templateIndex: number) => {
    const template = SAMPLE_TEMPLATES[templateIndex];
    handleDesignChange(template.design);
    toast.success(`Applied "${template.name}" template`);
  };

  return (
    <Card className="border border-hunt-mint/50 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardContent className="p-4 sm:p-6">
        <Tabs defaultValue="colors" className="space-y-5">
          {/* Studio Navigation Tabs */}
          <TabsList className="grid grid-cols-5 w-full bg-hunt-light/70 p-1 rounded-xl border border-hunt-mint/40">
            <TabsTrigger 
              value="colors" 
              className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-hunt-teal data-[state=active]:shadow-sm rounded-lg flex items-center justify-center gap-1.5 py-2 cursor-pointer"
            >
              <Paintbrush className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Colors</span>
            </TabsTrigger>
            <TabsTrigger 
              value="shapes" 
              className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-hunt-teal data-[state=active]:shadow-sm rounded-lg flex items-center justify-center gap-1.5 py-2 cursor-pointer"
            >
              <Shapes className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Shapes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="logo" 
              className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-hunt-teal data-[state=active]:shadow-sm rounded-lg flex items-center justify-center gap-1.5 py-2 cursor-pointer"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logo</span>
            </TabsTrigger>
            <TabsTrigger 
              value="frames" 
              className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-hunt-teal data-[state=active]:shadow-sm rounded-lg flex items-center justify-center gap-1.5 py-2 cursor-pointer"
            >
              <SquareAsterisk className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Frames</span>
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-hunt-teal data-[state=active]:shadow-sm rounded-lg flex items-center justify-center gap-1.5 py-2 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-hunt-sage" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
          </TabsList>

          {/* 1. COLORS & GRADIENTS */}
          <TabsContent value="colors" className="space-y-5 pt-1">
            <div className="space-y-4">
              {/* Single vs Gradient Toggle */}
              <div className="flex items-center justify-between p-3 bg-hunt-light rounded-xl border border-hunt-mint/40">
                <div>
                  <Label className="text-sm font-semibold text-hunt-dark">Color Mode</Label>
                  <p className="text-xs text-muted-foreground">Apply modern linear gradient across the QR code matrix</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${!localDesign.useGradient ? 'text-hunt-teal' : 'text-muted-foreground'}`}>Single</span>
                  <Switch
                    checked={localDesign.useGradient}
                    onCheckedChange={(checked) => handleDesignChange({ useGradient: checked })}
                  />
                  <span className={`text-xs font-semibold ${localDesign.useGradient ? 'text-hunt-teal' : 'text-muted-foreground'}`}>Gradient</span>
                </div>
              </div>

              {/* Foreground & Gradient Color Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fg-color" className="text-xs font-bold text-hunt-teal uppercase tracking-wider">
                    {localDesign.useGradient ? 'Gradient Start Color' : 'Foreground Color'}
                  </Label>
                  <div className="flex items-center gap-2.5">
                    <input
                      id="fg-color"
                      type="color"
                      value={localDesign.foregroundColor}
                      onChange={(e) => handleDesignChange({ foregroundColor: e.target.value })}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-hunt-mint/80 p-0.5 bg-white"
                    />
                    <Input
                      type="text"
                      value={localDesign.foregroundColor}
                      onChange={(e) => handleDesignChange({ foregroundColor: e.target.value })}
                      className="font-mono text-xs uppercase h-10 rounded-xl border-hunt-mint/80"
                    />
                  </div>
                </div>

                {localDesign.useGradient ? (
                  <div className="space-y-2">
                    <Label htmlFor="grad-color" className="text-xs font-bold text-hunt-teal uppercase tracking-wider">
                      Gradient End Color
                    </Label>
                    <div className="flex items-center gap-2.5">
                      <input
                        id="grad-color"
                        type="color"
                        value={localDesign.gradientColor2}
                        onChange={(e) => handleDesignChange({ gradientColor2: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-hunt-mint/80 p-0.5 bg-white"
                      />
                      <Input
                        type="text"
                        value={localDesign.gradientColor2}
                        onChange={(e) => handleDesignChange({ gradientColor2: e.target.value })}
                        className="font-mono text-xs uppercase h-10 rounded-xl border-hunt-mint/80"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="bg-color" className="text-xs font-bold text-hunt-teal uppercase tracking-wider">
                      Background Color
                    </Label>
                    <div className="flex items-center gap-2.5">
                      <input
                        id="bg-color"
                        type="color"
                        disabled={localDesign.isTransparent}
                        value={localDesign.backgroundColor}
                        onChange={(e) => handleDesignChange({ backgroundColor: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-hunt-mint/80 p-0.5 bg-white disabled:opacity-40"
                      />
                      <Input
                        type="text"
                        disabled={localDesign.isTransparent}
                        value={localDesign.backgroundColor}
                        onChange={(e) => handleDesignChange({ backgroundColor: e.target.value })}
                        className="font-mono text-xs uppercase h-10 rounded-xl border-hunt-mint/80 disabled:opacity-40"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Gradient Direction Option */}
              {localDesign.useGradient && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bg-color-alt" className="text-xs font-bold text-hunt-teal uppercase tracking-wider">
                      Background Color
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="bg-color-alt"
                        type="color"
                        disabled={localDesign.isTransparent}
                        value={localDesign.backgroundColor}
                        onChange={(e) => handleDesignChange({ backgroundColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-hunt-mint/80 p-0.5 bg-white disabled:opacity-40"
                      />
                      <span className="text-xs text-muted-foreground font-mono">{localDesign.backgroundColor}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <Label className="text-xs font-semibold text-hunt-dark">Gradient Angle / Direction</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'Diagonal ↘', dir: 'to-br' },
                        { label: 'Horizontal →', dir: 'to-r' },
                        { label: 'Vertical ↓', dir: 'to-b' },
                        { label: 'Diagonal ↗', dir: 'to-tr' },
                      ].map((d) => (
                        <button
                          key={d.dir}
                          type="button"
                          onClick={() => handleDesignChange({ gradientDirection: d.dir as any })}
                          className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                            localDesign.gradientDirection === d.dir
                              ? 'bg-hunt-teal text-white border-hunt-teal shadow-xs'
                              : 'bg-white hover:bg-muted/50 border-border text-hunt-dark'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Transparent Background Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-hunt-mint/40 bg-hunt-light/40">
                <div>
                  <Label className="text-xs font-semibold text-hunt-dark">Transparent Background</Label>
                  <p className="text-[11px] text-muted-foreground">Export PNG without background for design layering</p>
                </div>
                <Switch
                  checked={localDesign.isTransparent}
                  onCheckedChange={(checked) => handleDesignChange({ isTransparent: checked })}
                />
              </div>

              {/* Custom Eye Colors */}
              <div className="pt-2 border-t border-border">
                <Label className="text-xs font-bold text-hunt-teal uppercase tracking-wider block mb-3">
                  Corner Eye Finder Colors
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-hunt-dark">Outer Eye Frame Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={localDesign.cornerSquareColor}
                        onChange={(e) => handleDesignChange({ cornerSquareColor: e.target.value })}
                        className="w-9 h-9 rounded-lg border border-hunt-mint/80 p-0.5 cursor-pointer bg-white"
                      />
                      <Input
                        type="text"
                        value={localDesign.cornerSquareColor}
                        onChange={(e) => handleDesignChange({ cornerSquareColor: e.target.value })}
                        className="font-mono text-xs uppercase h-9 rounded-xl border-hunt-mint/80"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-hunt-dark">Inner Eye Dot Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={localDesign.cornerDotColor}
                        onChange={(e) => handleDesignChange({ cornerDotColor: e.target.value })}
                        className="w-9 h-9 rounded-lg border border-hunt-mint/80 p-0.5 cursor-pointer bg-white"
                      />
                      <Input
                        type="text"
                        value={localDesign.cornerDotColor}
                        onChange={(e) => handleDesignChange({ cornerDotColor: e.target.value })}
                        className="font-mono text-xs uppercase h-9 rounded-xl border-hunt-mint/80"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Palette Quick Swatches */}
              <div className="pt-2">
                <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Palette Swatches (Color Hunt Curated)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {SWATCHES.map((swatch) => (
                    <button
                      key={swatch.name}
                      type="button"
                      onClick={() => handleDesignChange({ foregroundColor: swatch.color })}
                      className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-white hover:bg-muted/30 text-xs transition-all"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border shadow-xs" style={{ backgroundColor: swatch.color }} />
                      <span className="text-[11px] text-hunt-dark">{swatch.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 2. SHAPES & BODY PATTERNS */}
          <TabsContent value="shapes" className="space-y-5 pt-1">
            {/* Body Shapes */}
            <div className="space-y-2.5">
              <Label className="text-xs font-bold text-hunt-teal uppercase tracking-wider">
                1. Body Module Patterns
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {[
                  { id: 'square', label: 'Classic Square', icon: '■' },
                  { id: 'rounded', label: 'Rounded Dots', icon: '▢' },
                  { id: 'dots', label: 'Circular Dots', icon: '●' },
                  { id: 'classy', label: 'Classy Diamond', icon: '◆' },
                  { id: 'classy-rounded', label: 'Curved Diamond', icon: '✦' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleDesignChange({ shape: s.id as QRShapeType })}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      localDesign.shape === s.id
                        ? 'bg-hunt-teal text-white border-hunt-teal shadow-md shadow-hunt-teal/20'
                        : 'bg-white hover:bg-hunt-light border-hunt-mint/40 text-hunt-dark'
                    }`}
                  >
                    <span className="text-2xl leading-none">{s.icon}</span>
                    <span className="text-xs font-semibold">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Corner Outer Eye Frame */}
            <div className="space-y-2.5 pt-2 border-t border-border">
              <Label className="text-xs font-bold text-hunt-teal uppercase tracking-wider">
                2. Eye Frame (Outer Square)
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { id: 'square', label: 'Square' },
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'circle', label: 'Circle' },
                  { id: 'leaf', label: 'Teardrop' },
                  { id: 'diamond', label: 'Diamond' },
                ].map((ef) => (
                  <button
                    key={ef.id}
                    type="button"
                    onClick={() => handleDesignChange({ eyeFrameShape: ef.id as QREyeFrameType })}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      localDesign.eyeFrameShape === ef.id
                        ? 'bg-hunt-teal text-white border-hunt-teal shadow-xs font-semibold'
                        : 'bg-white hover:bg-hunt-light border-hunt-mint/40 text-hunt-dark'
                    }`}
                  >
                    <span className="text-xs">{ef.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Corner Inner Eye Ball */}
            <div className="space-y-2.5 pt-2 border-t border-border">
              <Label className="text-xs font-bold text-hunt-teal uppercase tracking-wider">
                3. Eye Ball (Center Dot)
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { id: 'square', label: 'Square' },
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'circle', label: 'Circle' },
                  { id: 'diamond', label: 'Diamond' },
                  { id: 'leaf', label: 'Leaf' },
                ].map((eb) => (
                  <button
                    key={eb.id}
                    type="button"
                    onClick={() => handleDesignChange({ eyeBallShape: eb.id as QREyeBallType })}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      localDesign.eyeBallShape === eb.id
                        ? 'bg-hunt-teal text-white border-hunt-teal shadow-xs font-semibold'
                        : 'bg-white hover:bg-hunt-light border-hunt-mint/40 text-hunt-dark'
                    }`}
                  >
                    <span className="text-xs">{eb.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* 3. LOGO & BRANDING */}
          <TabsContent value="logo" className="space-y-5 pt-1">
            {/* Custom Logo Upload Box */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-hunt-teal uppercase tracking-wider">
                Upload Custom Logo or Brand Icon
              </Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-hunt-mint hover:border-hunt-teal hover:bg-hunt-light/40 transition-all rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer text-center bg-white"
              >
                {localDesign.logoImage ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative p-2 bg-white rounded-xl shadow-md border border-hunt-mint/40">
                      <img
                        src={localDesign.logoImage}
                        alt="Logo Preview"
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-hunt-teal">Logo Active</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDesignChange({ logoImage: null });
                          toast.info('Logo removed');
                        }}
                        className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 ml-2 underline"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-hunt-light flex items-center justify-center text-hunt-teal mb-2">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-hunt-dark">Click to upload brand logo</span>
                    <span className="text-xs text-muted-foreground mt-0.5">PNG, SVG, JPG, or WebP (up to 3MB)</span>
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

            {/* Popular Logo Presets */}
            <div className="space-y-2.5">
              <Label className="text-xs font-bold text-hunt-teal uppercase tracking-wider">
                Or Select From Popular Badge Presets
              </Label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {PRESET_LOGOS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectPresetLogo(item.svg, item.name)}
                    className="p-2 rounded-xl border border-hunt-mint/40 hover:border-hunt-teal hover:bg-hunt-light flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group bg-white"
                  >
                    <div
                      className="w-7 h-7 flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: item.svg }}
                    />
                    <span className="text-[10px] font-medium text-hunt-dark truncate max-w-full">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Settings */}
            {localDesign.logoImage && (
              <div className="space-y-4 pt-2 border-t border-border">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <Label className="font-semibold text-hunt-dark">Logo Scale in Center</Label>
                    <span className="text-hunt-teal font-bold">{localDesign.logoSize}%</span>
                  </div>
                  <Slider
                    min={12}
                    max={32}
                    step={1}
                    value={[localDesign.logoSize]}
                    onValueChange={(val) => handleDesignChange({ logoSize: val[0] })}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Kept safely between 12% and 32% to maintain 100% camera scan compatibility.
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-hunt-mint/40 bg-hunt-light/40">
                  <div>
                    <Label className="text-xs font-semibold text-hunt-dark">Protective Cutout Backing</Label>
                    <p className="text-[11px] text-muted-foreground">Clears QR modules behind logo for crisp presentation</p>
                  </div>
                  <Switch
                    checked={localDesign.logoPadding}
                    onCheckedChange={(checked) => handleDesignChange({ logoPadding: checked })}
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {/* 4. FRAMES & CALL TO ACTION */}
          <TabsContent value="frames" className="space-y-5 pt-1">
            <div className="space-y-3">
              <Label className="text-xs font-bold text-hunt-teal uppercase tracking-wider">
                Select Frame & Call-To-Action Style
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'none', label: 'No Frame', desc: 'Minimal clean QR code' },
                  { id: 'bottom-banner', label: 'Bottom Banner', desc: 'Sleek "SCAN ME" pill' },
                  { id: 'top-banner', label: 'Top Banner', desc: 'Prominent header banner' },
                  { id: 'phone', label: 'Phone Mockup', desc: 'Smartphone bezel frame' },
                  { id: 'card', label: 'Card Badge', desc: 'Elegant card outline' },
                  { id: 'badge', label: 'Voucher Badge', desc: 'Ticket/voucher frame' },
                ].map((fr) => (
                  <button
                    key={fr.id}
                    type="button"
                    onClick={() => handleDesignChange({ frameType: fr.id as QRFrameType })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      localDesign.frameType === fr.id
                        ? 'bg-hunt-teal text-white border-hunt-teal shadow-md shadow-hunt-teal/20'
                        : 'bg-white hover:bg-hunt-light border-hunt-mint/40 text-hunt-dark'
                    }`}
                  >
                    <div className="text-xs font-bold">{fr.label}</div>
                    <div className={`text-[11px] mt-0.5 ${localDesign.frameType === fr.id ? 'text-hunt-butter' : 'text-muted-foreground'}`}>
                      {fr.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {localDesign.frameType !== 'none' && (
              <div className="space-y-3.5 pt-2 border-t border-border">
                <div className="space-y-1.5">
                  <Label htmlFor="fr-text" className="text-xs font-semibold text-hunt-dark">
                    Call to Action Text
                  </Label>
                  <Input
                    id="fr-text"
                    value={localDesign.frameText}
                    onChange={(e) => handleDesignChange({ frameText: e.target.value })}
                    placeholder="SCAN ME / VISIT US / JOIN WIFI"
                    maxLength={24}
                    className="h-10 rounded-xl border-hunt-mint/80 font-bold uppercase tracking-wider text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-hunt-dark">Frame Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={localDesign.frameColor}
                        onChange={(e) => handleDesignChange({ frameColor: e.target.value })}
                        className="w-9 h-9 rounded-lg border border-hunt-mint/80 p-0.5 bg-white cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={localDesign.frameColor}
                        onChange={(e) => handleDesignChange({ frameColor: e.target.value })}
                        className="font-mono text-xs uppercase h-9 rounded-xl border-hunt-mint/80"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-hunt-dark">Frame Text Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={localDesign.frameTextColor}
                        onChange={(e) => handleDesignChange({ frameTextColor: e.target.value })}
                        className="w-9 h-9 rounded-lg border border-hunt-mint/80 p-0.5 bg-white cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={localDesign.frameTextColor}
                        onChange={(e) => handleDesignChange({ frameTextColor: e.target.value })}
                        className="font-mono text-xs uppercase h-9 rounded-xl border-hunt-mint/80"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* 5. DESIGNER TEMPLATES */}
          <TabsContent value="templates" className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {SAMPLE_TEMPLATES.map((tmpl, idx) => (
                <motion.div
                  key={tmpl.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTemplateSelect(idx)}
                  className="p-4 rounded-xl border border-hunt-mint/40 hover:border-hunt-teal bg-white hover:bg-hunt-light/40 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl p-2 rounded-xl bg-hunt-light border border-hunt-mint/40">
                      {tmpl.thumbnail}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-hunt-dark">{tmpl.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{tmpl.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-hunt-mint/20 flex items-center justify-between text-[11px] text-hunt-teal font-semibold">
                    <span>1-Click Apply</span>
                    <Sparkles className="w-3.5 h-3.5 text-hunt-sage" />
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DesignCustomizer;
