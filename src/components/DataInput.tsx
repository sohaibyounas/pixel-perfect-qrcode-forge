import { useState } from "react";
import { QRCodeData, QRCodeType, validateQRData } from "@/lib/qr-utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Globe, 
  FileText, 
  Mail, 
  Phone, 
  MessageSquare, 
  MessageCircle, 
  Wifi, 
  Contact, 
  MapPin, 
  Calendar, 
  Coins, 
  AlertCircle,
  Sparkles,
  Clipboard,
  X,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface DataInputProps {
  data: QRCodeData;
  onDataChange: (data: QRCodeData) => void;
}

const DATA_TYPES: { type: QRCodeType; label: string; icon: any; badge?: string }[] = [
  { type: 'url', label: 'Website / URL', icon: Globe },
  { type: 'text', label: 'Plain Text', icon: FileText },
  { type: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, badge: 'Popular' },
  { type: 'wifi', label: 'WiFi Network', icon: Wifi },
  { type: 'vcard', label: 'vCard Contact', icon: Contact },
  { type: 'email', label: 'Email Draft', icon: Mail },
  { type: 'phone', label: 'Call Phone', icon: Phone },
  { type: 'sms', label: 'SMS Message', icon: MessageSquare },
  { type: 'location', label: 'Google Maps', icon: MapPin },
  { type: 'event', label: 'Event / Calendar', icon: Calendar },
  { type: 'crypto', label: 'Crypto Wallet', icon: Coins },
];

const DataInput: React.FC<DataInputProps> = ({ data, onDataChange }) => {
  const [localData, setLocalData] = useState<QRCodeData>(data);

  const handleValueChange = (value: string) => {
    const newData = { ...localData, value };
    const validatedData = validateQRData(newData);
    setLocalData(validatedData);
    onDataChange(validatedData);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleValueChange(text);
        toast.success('Pasted from clipboard!');
      }
    } catch {
      toast.info('Please paste using Ctrl+V / Cmd+V');
    }
  };

  const handleTypeChange = (type: QRCodeType) => {
    let initialValue = '';
    if (type === 'url') initialValue = 'https://example.com';
    else if (type === 'text') initialValue = 'Scan to view our special announcement & offer!';
    else if (type === 'whatsapp') initialValue = JSON.stringify({ phone: '+14155552671', message: 'Hello! I scanned your QR code.' });
    else if (type === 'wifi') initialValue = JSON.stringify({ ssid: 'Guest-WiFi', encryption: 'WPA', password: '', hidden: false });
    else if (type === 'vcard') initialValue = JSON.stringify({ firstName: 'Alex', lastName: 'Morgan', organization: 'Studio Design', title: 'Creative Lead', phone: '+1 555-0199', email: 'alex@example.com', website: 'https://alexdesign.com', address: 'San Francisco, CA' });
    else if (type === 'email') initialValue = JSON.stringify({ email: 'hello@example.com', subject: 'Inquiry', body: 'Hi, I would like to learn more.' });
    else if (type === 'location') initialValue = JSON.stringify({ latitude: '37.7749', longitude: '-122.4194' });
    else if (type === 'event') initialValue = JSON.stringify({ title: 'Product Launch Meetup', location: 'Tech Hub', start: '2026-10-15T18:00', end: '2026-10-15T21:00', description: 'Join us for refreshments and live demos!' });
    else if (type === 'crypto') initialValue = JSON.stringify({ coin: 'bitcoin', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', amount: '0.01' });

    const newData: QRCodeData = { type, value: initialValue, error: '' };
    setLocalData(newData);
    onDataChange(newData);
  };

  const renderInputField = () => {
    switch (localData.type) {
      case 'url':
        return (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="url-input" className="text-sm font-semibold text-hunt-dark">
                Website or Link URL
              </Label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="text-[11px] font-semibold text-hunt-teal hover:text-hunt-dark flex items-center gap-1 bg-hunt-light px-2 py-0.5 rounded-md border border-hunt-mint/60 cursor-pointer"
                >
                  <Clipboard className="w-3 h-3" /> Paste
                </button>
                {localData.value && (
                  <button
                    type="button"
                    onClick={() => handleValueChange('')}
                    className="text-[11px] text-muted-foreground hover:text-red-600 flex items-center gap-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <Input
                id="url-input"
                type="url"
                placeholder="https://yourwebsite.com or myportfolio.design"
                value={localData.value}
                onChange={(e) => handleValueChange(e.target.value)}
                className="h-11 border-hunt-mint/80 focus-visible:ring-hunt-teal text-sm rounded-xl pr-8"
              />
            </div>

            {/* Quick URL Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-muted-foreground mr-1">Quick samples:</span>
              {[
                { label: 'Website', val: 'https://example.com' },
                { label: 'Instagram', val: 'https://instagram.com/yourbrand' },
                { label: 'YouTube', val: 'https://youtube.com/@channel' },
                { label: 'LinkedIn', val: 'https://linkedin.com/in/profile' },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => handleValueChange(s.val)}
                  className="text-[10px] font-semibold text-hunt-teal bg-white hover:bg-hunt-light border border-hunt-mint/50 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="text-input" className="text-sm font-semibold text-hunt-dark">
                Text Message or Memo
              </Label>
              {localData.value && (
                <button
                  type="button"
                  onClick={() => handleValueChange('')}
                  className="text-[11px] text-muted-foreground hover:text-red-600 flex items-center gap-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
            <Textarea
              id="text-input"
              placeholder="Type any custom text, coupon code, instructions, or secret note..."
              value={localData.value}
              onChange={(e) => handleValueChange(e.target.value)}
              className="min-h-[120px] border-hunt-mint/80 focus-visible:ring-hunt-teal text-sm rounded-xl resize-y"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Plain text will display immediately on the scanner's screen.</span>
              <span>{localData.value.length} characters</span>
            </div>
          </div>
        );

      case 'whatsapp': {
        const wa = localData.value ? JSON.parse(localData.value || '{}') : { phone: '', message: '' };
        return (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="wa-phone" className="text-sm font-semibold text-hunt-dark">
                  WhatsApp Phone Number
                </Label>
                <Input
                  id="wa-phone"
                  placeholder="+1 555 123 4567"
                  value={wa.phone || ''}
                  onChange={(e) => {
                    const updated = { ...wa, phone: e.target.value };
                    handleValueChange(JSON.stringify(updated));
                  }}
                  className="h-11 border-hunt-mint/80 focus-visible:ring-hunt-teal rounded-xl"
                />
                <span className="text-[11px] text-muted-foreground">Include country code (e.g. +1 or +44).</span>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wa-msg" className="text-sm font-semibold text-hunt-dark">
                  Pre-filled Message
                </Label>
                <Input
                  id="wa-msg"
                  placeholder="Hi! I saw your QR code and want to connect."
                  value={wa.message || ''}
                  onChange={(e) => {
                    const updated = { ...wa, message: e.target.value };
                    handleValueChange(JSON.stringify(updated));
                  }}
                  className="h-11 border-hunt-mint/80 focus-visible:ring-hunt-teal rounded-xl"
                />
                <span className="text-[11px] text-muted-foreground">Opens chat window ready to send.</span>
              </div>
            </div>
          </div>
        );
      }

      case 'wifi': {
        const wifi = localData.value ? JSON.parse(localData.value || '{}') : { ssid: '', encryption: 'WPA', password: '', hidden: false };
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="wifi-ssid" className="text-sm font-semibold text-hunt-dark">
                  Network Name (SSID)
                </Label>
                <Input
                  id="wifi-ssid"
                  placeholder="e.g. Office-Guest or CoffeeShop-WiFi"
                  value={wifi.ssid || ''}
                  onChange={(e) => {
                    const updated = { ...wifi, ssid: e.target.value };
                    handleValueChange(JSON.stringify(updated));
                  }}
                  className="h-11 border-hunt-mint/80 focus-visible:ring-hunt-teal rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="wifi-pass" className="text-sm font-semibold text-hunt-dark">
                  WiFi Password
                </Label>
                <Input
                  id="wifi-pass"
                  type="text"
                  placeholder="Leave empty if open network"
                  value={wifi.password || ''}
                  onChange={(e) => {
                    const updated = { ...wifi, password: e.target.value };
                    handleValueChange(JSON.stringify(updated));
                  }}
                  className="h-11 border-hunt-mint/80 focus-visible:ring-hunt-teal rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Encryption Type
              </Label>
              <RadioGroup
                value={wifi.encryption || 'WPA'}
                onValueChange={(val) => {
                  const updated = { ...wifi, encryption: val };
                  handleValueChange(JSON.stringify(updated));
                }}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="WPA" id="enc-wpa" className="text-hunt-teal" />
                  <Label htmlFor="enc-wpa" className="text-sm cursor-pointer font-medium">WPA / WPA2 / WPA3 (Standard)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="WEP" id="enc-wep" className="text-hunt-teal" />
                  <Label htmlFor="enc-wep" className="text-sm cursor-pointer">WEP</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nopass" id="enc-none" className="text-hunt-teal" />
                  <Label htmlFor="enc-none" className="text-sm cursor-pointer">No Password (Open)</Label>
                </div>
              </RadioGroup>
            </div>
            <p className="text-xs text-hunt-sage bg-hunt-light p-2.5 rounded-lg border border-hunt-mint/40">
              ⚡ Smartphones will prompt users to "Join Network" immediately without typing any password!
            </p>
          </div>
        );
      }

      case 'vcard': {
        const v = localData.value ? JSON.parse(localData.value || '{}') : {};
        const updateVCard = (field: string, val: string) => {
          const updated = { ...v, [field]: val };
          handleValueChange(JSON.stringify(updated));
        };

        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="vc-first" className="text-xs font-semibold text-hunt-dark">First Name</Label>
                <Input
                  id="vc-first"
                  placeholder="e.g. Sarah"
                  value={v.firstName || ''}
                  onChange={(e) => updateVCard('firstName', e.target.value)}
                  className="h-10 border-hunt-mint/80 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="vc-last" className="text-xs font-semibold text-hunt-dark">Last Name</Label>
                <Input
                  id="vc-last"
                  placeholder="e.g. Jenkins"
                  value={v.lastName || ''}
                  onChange={(e) => updateVCard('lastName', e.target.value)}
                  className="h-10 border-hunt-mint/80 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="vc-org" className="text-xs font-semibold text-hunt-dark">Company / Organization</Label>
                <Input
                  id="vc-org"
                  placeholder="Acme Studio Corp"
                  value={v.organization || ''}
                  onChange={(e) => updateVCard('organization', e.target.value)}
                  className="h-10 border-hunt-mint/80 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="vc-title" className="text-xs font-semibold text-hunt-dark">Job Title</Label>
                <Input
                  id="vc-title"
                  placeholder="Managing Director"
                  value={v.title || ''}
                  onChange={(e) => updateVCard('title', e.target.value)}
                  className="h-10 border-hunt-mint/80 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="vc-phone" className="text-xs font-semibold text-hunt-dark">Mobile Phone</Label>
                <Input
                  id="vc-phone"
                  placeholder="+1 (555) 234-5678"
                  value={v.phone || ''}
                  onChange={(e) => updateVCard('phone', e.target.value)}
                  className="h-10 border-hunt-mint/80 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="vc-email" className="text-xs font-semibold text-hunt-dark">Email Address</Label>
                <Input
                  id="vc-email"
                  type="email"
                  placeholder="sarah@example.com"
                  value={v.email || ''}
                  onChange={(e) => updateVCard('email', e.target.value)}
                  className="h-10 border-hunt-mint/80 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="vc-web" className="text-xs font-semibold text-hunt-dark">Website</Label>
                <Input
                  id="vc-web"
                  placeholder="https://sarahjenkins.com"
                  value={v.website || ''}
                  onChange={(e) => updateVCard('website', e.target.value)}
                  className="h-10 border-hunt-mint/80 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="vc-addr" className="text-xs font-semibold text-hunt-dark">Location / Address</Label>
                <Input
                  id="vc-addr"
                  placeholder="San Francisco, CA"
                  value={v.address || ''}
                  onChange={(e) => updateVCard('address', e.target.value)}
                  className="h-10 border-hunt-mint/80 rounded-xl"
                />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Scanning saves directly into iPhone Contacts & Android Address Book with one tap.
            </p>
          </div>
        );
      }

      case 'email': {
        const em = localData.value ? JSON.parse(localData.value || '{}') : {};
        return (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="em-to" className="text-xs font-semibold text-hunt-dark">Recipient Email Address</Label>
              <Input
                id="em-to"
                type="email"
                placeholder="contact@company.com"
                value={em.email || ''}
                onChange={(e) => handleValueChange(JSON.stringify({ ...em, email: e.target.value }))}
                className="h-10 border-hunt-mint/80 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="em-sub" className="text-xs font-semibold text-hunt-dark">Subject Line</Label>
              <Input
                id="em-sub"
                placeholder="Project inquiry / Booking request"
                value={em.subject || ''}
                onChange={(e) => handleValueChange(JSON.stringify({ ...em, subject: e.target.value }))}
                className="h-10 border-hunt-mint/80 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="em-body" className="text-xs font-semibold text-hunt-dark">Pre-written Body Text</Label>
              <Textarea
                id="em-body"
                placeholder="Hello, I would like to schedule a consultation..."
                value={em.body || ''}
                onChange={(e) => handleValueChange(JSON.stringify({ ...em, body: e.target.value }))}
                className="min-h-[80px] border-hunt-mint/80 rounded-xl resize-y"
              />
            </div>
          </div>
        );
      }

      case 'phone':
        return (
          <div className="space-y-2">
            <Label htmlFor="phone-input" className="text-sm font-semibold text-hunt-dark">
              Direct Phone Number
            </Label>
            <Input
              id="phone-input"
              type="tel"
              placeholder="+1 (800) 555-0199"
              value={localData.value}
              onChange={(e) => handleValueChange(e.target.value)}
              className="h-11 border-hunt-mint/80 focus-visible:ring-hunt-teal rounded-xl"
            />
            <p className="text-[12px] text-muted-foreground">
              When scanned, smartphones automatically open the phone dialer ready to call.
            </p>
          </div>
        );

      case 'sms': {
        const sms = localData.value ? JSON.parse(localData.value || '{}') : {};
        return (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="sms-phone" className="text-xs font-semibold text-hunt-dark">Recipient Phone Number</Label>
              <Input
                id="sms-phone"
                type="tel"
                placeholder="+1 555 333 4444"
                value={sms.phone || ''}
                onChange={(e) => handleValueChange(JSON.stringify({ ...sms, phone: e.target.value }))}
                className="h-10 border-hunt-mint/80 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sms-msg" className="text-xs font-semibold text-hunt-dark">Pre-filled SMS Message</Label>
              <Textarea
                id="sms-msg"
                placeholder="DISCOUNT20 please send coupon"
                value={sms.message || ''}
                onChange={(e) => handleValueChange(JSON.stringify({ ...sms, message: e.target.value }))}
                className="min-h-[80px] border-hunt-mint/80 rounded-xl resize-y"
              />
            </div>
          </div>
        );
      }

      case 'location': {
        const loc = localData.value ? JSON.parse(localData.value || '{}') : {};
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="loc-lat" className="text-xs font-semibold text-hunt-dark">Latitude</Label>
                <Input
                  id="loc-lat"
                  placeholder="37.7749"
                  value={loc.latitude || ''}
                  onChange={(e) => handleValueChange(JSON.stringify({ ...loc, latitude: e.target.value }))}
                  className="h-10 border-hunt-mint/80 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="loc-lng" className="text-xs font-semibold text-hunt-dark">Longitude</Label>
                <Input
                  id="loc-lng"
                  placeholder="-122.4194"
                  value={loc.longitude || ''}
                  onChange={(e) => handleValueChange(JSON.stringify({ ...loc, longitude: e.target.value }))}
                  className="h-10 border-hunt-mint/80 rounded-xl"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        handleValueChange(
                          JSON.stringify({
                            latitude: pos.coords.latitude.toFixed(6),
                            longitude: pos.coords.longitude.toFixed(6),
                          })
                        );
                        toast.success('Location updated from device GPS!');
                      },
                      () => {
                        toast.error('Could not detect location. Please type manually.');
                      }
                    );
                  }
                }}
                className="text-xs font-semibold text-hunt-teal bg-hunt-light hover:bg-hunt-mint/30 px-3 py-1.5 rounded-lg border border-hunt-mint/60 transition-colors cursor-pointer"
              >
                📍 Use My Current Location
              </button>
            </div>
          </div>
        );
      }

      case 'event': {
        const ev = localData.value ? JSON.parse(localData.value || '{}') : {};
        return (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="ev-title" className="text-xs font-semibold text-hunt-dark">Event Title</Label>
              <Input
                id="ev-title"
                placeholder="Product Launch & Gala"
                value={ev.title || ''}
                onChange={(e) => handleValueChange(JSON.stringify({ ...ev, title: e.target.value }))}
                className="h-10 border-hunt-mint/80 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="ev-start" className="text-xs font-semibold text-hunt-dark">Start Date & Time</Label>
                <Input
                  id="ev-start"
                  type="datetime-local"
                  value={ev.start || ''}
                  onChange={(e) => handleValueChange(JSON.stringify({ ...ev, start: e.target.value }))}
                  className="h-10 border-hunt-mint/80 rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ev-end" className="text-xs font-semibold text-hunt-dark">End Date & Time</Label>
                <Input
                  id="ev-end"
                  type="datetime-local"
                  value={ev.end || ''}
                  onChange={(e) => handleValueChange(JSON.stringify({ ...ev, end: e.target.value }))}
                  className="h-10 border-hunt-mint/80 rounded-xl text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="ev-loc" className="text-xs font-semibold text-hunt-dark">Location / Venue</Label>
              <Input
                id="ev-loc"
                placeholder="Convention Center Hall B, or Zoom Link"
                value={ev.location || ''}
                onChange={(e) => handleValueChange(JSON.stringify({ ...ev, location: e.target.value }))}
                className="h-10 border-hunt-mint/80 rounded-xl"
              />
            </div>
          </div>
        );
      }

      case 'crypto': {
        const cry = localData.value ? JSON.parse(localData.value || '{}') : {};
        return (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-hunt-dark">Cryptocurrency</Label>
              <div className="grid grid-cols-3 gap-2">
                {['bitcoin', 'ethereum', 'tether'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleValueChange(JSON.stringify({ ...cry, coin: c }))}
                    className={`py-1.5 text-xs font-semibold rounded-lg capitalize border transition-all ${
                      (cry.coin || 'bitcoin') === c
                        ? 'bg-hunt-teal text-white border-hunt-teal'
                        : 'bg-muted/40 hover:bg-muted text-hunt-dark border-border'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="cry-addr" className="text-xs font-semibold text-hunt-dark">Wallet Public Address</Label>
              <Input
                id="cry-addr"
                placeholder="e.g. 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                value={cry.address || ''}
                onChange={(e) => handleValueChange(JSON.stringify({ ...cry, address: e.target.value }))}
                className="h-10 font-mono text-xs border-hunt-mint/80 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cry-amt" className="text-xs font-semibold text-hunt-dark">Amount (Optional)</Label>
              <Input
                id="cry-amt"
                type="number"
                step="any"
                placeholder="0.05"
                value={cry.amount || ''}
                onChange={(e) => handleValueChange(JSON.stringify({ ...cry, amount: e.target.value }))}
                className="h-10 border-hunt-mint/80 rounded-xl"
              />
            </div>
          </div>
        );
      }

      default:
        return (
          <Input
            value={localData.value}
            onChange={(e) => handleValueChange(e.target.value)}
            className="h-11 rounded-xl"
          />
        );
    }
  };

  return (
    <Card className="border border-hunt-mint/50 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* QR Type Selector Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-hunt-teal uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-hunt-sage" />
              1. Choose Content Type
            </Label>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              11+ formats, all free
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {DATA_TYPES.map((item) => {
              const Icon = item.icon;
              const isSelected = localData.type === item.type;
              return (
                <motion.button
                  key={item.type}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTypeChange(item.type)}
                  className={`relative p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-hunt-teal text-white border-hunt-teal shadow-md shadow-hunt-teal/20 font-semibold ring-2 ring-hunt-mint/50'
                      : 'bg-white hover:bg-hunt-light border-hunt-mint/40 text-hunt-dark hover:border-hunt-sage'
                  }`}
                >
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-1 text-[9px] font-bold px-1.5 py-0.2 bg-hunt-butter text-hunt-dark rounded-full border border-yellow-200">
                      {item.badge}
                    </span>
                  )}
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-hunt-butter' : 'text-hunt-teal'}`} />
                  <span className="text-[11px] leading-tight line-clamp-1">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Input Fields with Smooth AnimatePresence */}
        <div className="pt-2 border-t border-hunt-mint/30 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-hunt-teal uppercase tracking-wider">
              2. Enter Data Details
            </Label>
            <span className="text-[11px] text-hunt-sage font-medium">
              Real-time synchronization
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={localData.type}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {renderInputField()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Re-designed Modern Feedback & Helper Card */}
        <AnimatePresence>
          {localData.error ? (
            <motion.div
              key="error-box"
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-900 shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-700">
                  <AlertCircle className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-medium">{localData.error}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (localData.type === 'url') handleValueChange('https://example.com');
                  else if (localData.type === 'email') handleValueChange(JSON.stringify({ email: 'hello@example.com', subject: 'Inquiry', body: 'Hello!' }));
                  else if (localData.type === 'phone') handleValueChange('+15551234567');
                  else handleTypeChange(localData.type);
                }}
                className="text-[11px] font-bold text-amber-900 bg-amber-200/60 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
              >
                Use Sample
              </button>
            </motion.div>
          ) : !localData.value.trim() ? (
            <motion.div
              key="empty-box"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-hunt-light border border-hunt-mint/60 text-hunt-dark text-xs shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">💡</span>
                <span className="text-muted-foreground text-[11px]">
                  Type your content above or insert a sample to preview live.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (localData.type === 'url') handleValueChange('https://example.com');
                  else if (localData.type === 'text') handleValueChange('Welcome to QR Studio!');
                  else handleTypeChange(localData.type);
                }}
                className="text-[11px] font-bold text-hunt-teal bg-white hover:bg-hunt-mint/20 border border-hunt-mint px-2.5 py-1 rounded-lg transition-colors flex-shrink-0 shadow-2xs cursor-pointer"
              >
                Insert Sample
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default DataInput;
