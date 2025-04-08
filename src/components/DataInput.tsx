
import { useState } from "react";
import { QRCodeData, QRCodeType, validateQRData } from "@/lib/qr-utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DataInputProps {
  data: QRCodeData;
  onDataChange: (data: QRCodeData) => void;
}

const DataInput: React.FC<DataInputProps> = ({ data, onDataChange }) => {
  const [localData, setLocalData] = useState<QRCodeData>(data);

  const handleValueChange = (value: string) => {
    const newData = { ...localData, value };
    const validatedData = validateQRData(newData);
    setLocalData(validatedData);
    onDataChange(validatedData);
  };

  const handleTypeChange = (type: QRCodeType) => {
    const newData = { ...localData, type, error: '' };
    setLocalData(newData);
    onDataChange(newData);
  };

  const renderInputField = () => {
    switch (localData.type) {
      case 'text':
        return (
          <div className="space-y-2">
            <Label htmlFor="text-input">Text Content</Label>
            <Textarea
              id="text-input"
              placeholder="Enter text to encode in QR code"
              value={localData.value}
              onChange={(e) => handleValueChange(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        );
        
      case 'url':
        return (
          <div className="space-y-2">
            <Label htmlFor="url-input">Website URL</Label>
            <Input
              id="url-input"
              type="url"
              placeholder="https://example.com"
              value={localData.value}
              onChange={(e) => handleValueChange(e.target.value)}
            />
          </div>
        );
        
      case 'email':
        return (
          <div className="space-y-2">
            <Label htmlFor="email-input">Email Address</Label>
            <Input
              id="email-input"
              type="email"
              placeholder="example@email.com"
              value={localData.value}
              onChange={(e) => handleValueChange(e.target.value)}
            />
          </div>
        );
        
      case 'phone':
        return (
          <div className="space-y-2">
            <Label htmlFor="phone-input">Phone Number</Label>
            <Input
              id="phone-input"
              type="tel"
              placeholder="+1 234 567 8900"
              value={localData.value}
              onChange={(e) => handleValueChange(e.target.value)}
            />
          </div>
        );
        
      case 'wifi':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
              <Input
                id="wifi-ssid"
                placeholder="Your WiFi Network"
                value={localData.value ? JSON.parse(localData.value || '{"ssid":""}').ssid : ''}
                onChange={(e) => {
                  try {
                    const currentData = localData.value ? JSON.parse(localData.value) : { ssid: '', encryption: 'WPA', password: '' };
                    currentData.ssid = e.target.value;
                    handleValueChange(JSON.stringify(currentData));
                  } catch (e) {
                    handleValueChange(JSON.stringify({ ssid: e.target.value, encryption: 'WPA', password: '' }));
                  }
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wifi-password">Password</Label>
              <Input
                id="wifi-password"
                type="password"
                placeholder="WiFi Password"
                value={localData.value ? JSON.parse(localData.value || '{"password":""}').password : ''}
                onChange={(e) => {
                  try {
                    const currentData = localData.value ? JSON.parse(localData.value) : { ssid: '', encryption: 'WPA', password: '' };
                    currentData.password = e.target.value;
                    handleValueChange(JSON.stringify(currentData));
                  } catch (e) {
                    handleValueChange(JSON.stringify({ ssid: '', encryption: 'WPA', password: e.target.value }));
                  }
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Encryption</Label>
              <RadioGroup
                defaultValue="WPA"
                value={localData.value ? JSON.parse(localData.value || '{"encryption":"WPA"}').encryption : 'WPA'}
                onValueChange={(value) => {
                  try {
                    const currentData = localData.value ? JSON.parse(localData.value) : { ssid: '', encryption: 'WPA', password: '' };
                    currentData.encryption = value;
                    handleValueChange(JSON.stringify(currentData));
                  } catch (e) {
                    handleValueChange(JSON.stringify({ ssid: '', encryption: value, password: '' }));
                  }
                }}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="WPA" id="encryption-wpa" />
                  <Label htmlFor="encryption-wpa">WPA/WPA2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="WEP" id="encryption-wep" />
                  <Label htmlFor="encryption-wep">WEP</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="encryption-none" />
                  <Label htmlFor="encryption-none">None</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
        
      case 'vcard':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="vcard-firstname">First Name</Label>
                <Input
                  id="vcard-firstname"
                  placeholder="John"
                  value={localData.value ? JSON.parse(localData.value || '{"firstName":""}').firstName : ''}
                  onChange={(e) => {
                    try {
                      const currentData = localData.value ? JSON.parse(localData.value) : { 
                        firstName: '', lastName: '', phone: '', email: '', organization: '', title: '', address: '' 
                      };
                      currentData.firstName = e.target.value;
                      handleValueChange(JSON.stringify(currentData));
                    } catch (e) {
                      handleValueChange(JSON.stringify({ firstName: e.target.value, lastName: '', phone: '', email: '', organization: '', title: '', address: '' }));
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vcard-lastname">Last Name</Label>
                <Input
                  id="vcard-lastname"
                  placeholder="Doe"
                  value={localData.value ? JSON.parse(localData.value || '{"lastName":""}').lastName : ''}
                  onChange={(e) => {
                    try {
                      const currentData = localData.value ? JSON.parse(localData.value) : { 
                        firstName: '', lastName: '', phone: '', email: '', organization: '', title: '', address: '' 
                      };
                      currentData.lastName = e.target.value;
                      handleValueChange(JSON.stringify(currentData));
                    } catch (e) {
                      handleValueChange(JSON.stringify({ firstName: '', lastName: e.target.value, phone: '', email: '', organization: '', title: '', address: '' }));
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vcard-phone">Phone</Label>
              <Input
                id="vcard-phone"
                placeholder="+1 234 567 8900"
                value={localData.value ? JSON.parse(localData.value || '{"phone":""}').phone : ''}
                onChange={(e) => {
                  try {
                    const currentData = localData.value ? JSON.parse(localData.value) : { 
                      firstName: '', lastName: '', phone: '', email: '', organization: '', title: '', address: '' 
                    };
                    currentData.phone = e.target.value;
                    handleValueChange(JSON.stringify(currentData));
                  } catch (e) {
                    handleValueChange(JSON.stringify({ firstName: '', lastName: '', phone: e.target.value, email: '', organization: '', title: '', address: '' }));
                  }
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vcard-email">Email</Label>
              <Input
                id="vcard-email"
                placeholder="john.doe@example.com"
                value={localData.value ? JSON.parse(localData.value || '{"email":""}').email : ''}
                onChange={(e) => {
                  try {
                    const currentData = localData.value ? JSON.parse(localData.value) : { 
                      firstName: '', lastName: '', phone: '', email: '', organization: '', title: '', address: '' 
                    };
                    currentData.email = e.target.value;
                    handleValueChange(JSON.stringify(currentData));
                  } catch (e) {
                    handleValueChange(JSON.stringify({ firstName: '', lastName: '', phone: '', email: e.target.value, organization: '', title: '', address: '' }));
                  }
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="vcard-organization">Organization</Label>
                <Input
                  id="vcard-organization"
                  placeholder="Company Inc."
                  value={localData.value ? JSON.parse(localData.value || '{"organization":""}').organization : ''}
                  onChange={(e) => {
                    try {
                      const currentData = localData.value ? JSON.parse(localData.value) : { 
                        firstName: '', lastName: '', phone: '', email: '', organization: '', title: '', address: '' 
                      };
                      currentData.organization = e.target.value;
                      handleValueChange(JSON.stringify(currentData));
                    } catch (e) {
                      handleValueChange(JSON.stringify({ firstName: '', lastName: '', phone: '', email: '', organization: e.target.value, title: '', address: '' }));
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vcard-title">Job Title</Label>
                <Input
                  id="vcard-title"
                  placeholder="Software Engineer"
                  value={localData.value ? JSON.parse(localData.value || '{"title":""}').title : ''}
                  onChange={(e) => {
                    try {
                      const currentData = localData.value ? JSON.parse(localData.value) : { 
                        firstName: '', lastName: '', phone: '', email: '', organization: '', title: '', address: '' 
                      };
                      currentData.title = e.target.value;
                      handleValueChange(JSON.stringify(currentData));
                    } catch (e) {
                      handleValueChange(JSON.stringify({ firstName: '', lastName: '', phone: '', email: '', organization: '', title: e.target.value, address: '' }));
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vcard-address">Address</Label>
              <Textarea
                id="vcard-address"
                placeholder="123 Main St, City, State, Country"
                value={localData.value ? JSON.parse(localData.value || '{"address":""}').address : ''}
                onChange={(e) => {
                  try {
                    const currentData = localData.value ? JSON.parse(localData.value) : { 
                      firstName: '', lastName: '', phone: '', email: '', organization: '', title: '', address: '' 
                    };
                    currentData.address = e.target.value;
                    handleValueChange(JSON.stringify(currentData));
                  } catch (e) {
                    handleValueChange(JSON.stringify({ firstName: '', lastName: '', phone: '', email: '', organization: '', title: '', address: e.target.value }));
                  }
                }}
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="default-input">Content</Label>
            <Input
              id="default-input"
              placeholder="Enter content for QR code"
              value={localData.value}
              onChange={(e) => handleValueChange(e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label>QR Code Type</Label>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
            <div 
              className={`qr-item flex flex-col items-center justify-center p-3 ${localData.type === 'url' ? 'bg-accent/10 ring-1 ring-accent' : ''}`}
              onClick={() => handleTypeChange('url')}
            >
              <span className="text-xl">🌐</span>
              <span className="text-xs mt-1">URL</span>
            </div>
            <div 
              className={`qr-item flex flex-col items-center justify-center p-3 ${localData.type === 'text' ? 'bg-accent/10 ring-1 ring-accent' : ''}`}
              onClick={() => handleTypeChange('text')}
            >
              <span className="text-xl">📝</span>
              <span className="text-xs mt-1">Text</span>
            </div>
            <div 
              className={`qr-item flex flex-col items-center justify-center p-3 ${localData.type === 'email' ? 'bg-accent/10 ring-1 ring-accent' : ''}`}
              onClick={() => handleTypeChange('email')}
            >
              <span className="text-xl">✉️</span>
              <span className="text-xs mt-1">Email</span>
            </div>
            <div 
              className={`qr-item flex flex-col items-center justify-center p-3 ${localData.type === 'phone' ? 'bg-accent/10 ring-1 ring-accent' : ''}`}
              onClick={() => handleTypeChange('phone')}
            >
              <span className="text-xl">📞</span>
              <span className="text-xs mt-1">Phone</span>
            </div>
            <div 
              className={`qr-item flex flex-col items-center justify-center p-3 ${localData.type === 'sms' ? 'bg-accent/10 ring-1 ring-accent' : ''}`}
              onClick={() => handleTypeChange('sms')}
            >
              <span className="text-xl">💬</span>
              <span className="text-xs mt-1">SMS</span>
            </div>
            <div 
              className={`qr-item flex flex-col items-center justify-center p-3 ${localData.type === 'wifi' ? 'bg-accent/10 ring-1 ring-accent' : ''}`}
              onClick={() => handleTypeChange('wifi')}
            >
              <span className="text-xl">📶</span>
              <span className="text-xs mt-1">WiFi</span>
            </div>
            <div 
              className={`qr-item flex flex-col items-center justify-center p-3 ${localData.type === 'vcard' ? 'bg-accent/10 ring-1 ring-accent' : ''}`}
              onClick={() => handleTypeChange('vcard')}
            >
              <span className="text-xl">👤</span>
              <span className="text-xs mt-1">vCard</span>
            </div>
          </div>
        </div>

        {renderInputField()}

        {localData.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{localData.error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default DataInput;
