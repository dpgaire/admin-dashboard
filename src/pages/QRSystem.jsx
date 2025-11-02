import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Download, Copy, Check, History, Sparkles, Link2, Loader2, AlertCircle, Trash2,
  Wifi, Mail, MessageSquare, MapPin, User, Upload, Palette, Share2, Moon, Sun, FileDown, QrCode
} from 'lucide-react';
import toast from 'react-hot-toast';
import { generateQrCode } from '../services/qrAPI';

const QR_TYPES = {
  text: { icon: QrCode, label: "Text/URL" },
  wifi: { icon: Wifi, label: "WiFi" },
  vcard: { icon: User, label: "Contact" },
  email: { icon: Mail, label: "Email" },
  sms: { icon: MessageSquare, label: "SMS" },
  geo: { icon: MapPin, label: "Location" },
};

const QRSystem = () => {
  const [qrType, setQrType] = useState('text');
  const [text, setText] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  
  // Customization
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState('H');
  const [style, setStyle] = useState('square'); // square, dots, rounded
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  
  const qrRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load history & theme
  useEffect(() => {
    const saved = localStorage.getItem('qrHistory');
    if (saved) setHistory(JSON.parse(saved));
    
    const theme = localStorage.getItem('qrDarkMode');
    if (theme === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('qrDarkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('qrDarkMode', 'false');
    }
  }, [darkMode]);

  // Save to history
  const saveToHistory = (type, input, value) => {
    const newEntry = {
      id: Date.now(),
      type,
      input,
      value,
      config: { fgColor, bgColor, errorLevel, style, hasLogo: !!logo },
      timestamp: new Date().toLocaleString(),
    };
    const updated = [newEntry, ...history.slice(0, 19)];
    setHistory(updated);
    localStorage.setItem('qrHistory', JSON.stringify(updated));
  };

  // Generate QR value based on type
  const generateValue = () => {
    switch (qrType) {
      case 'wifi':
        const [ssid, pass] = text.split('\n');
        return `WIFI:T:WPA;S:${ssid};P:${pass};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:123456789\nEMAIL:john@example.com\nEND:VCARD`;
      case 'email':
        return `mailto:${text}`;
      case 'sms':
        return `SMSTO:${text}`;
      case 'geo':
        const [lat, lng] = text.split(',');
        return `GEO:${lat},${lng}`;
      default:
        return text;
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Please fill required fields');
      return;
    }

    setLoading(true);
    setError('');
    setQrValue('');

    try {
      const value = generateValue();
      const result = await generateQrCode(value);
      const finalValue = result?.data?.qrText || value;
      
      setQrValue(finalValue);
      saveToHistory(qrType, text, finalValue);
      toast.success('QR Generated!');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogo(ev.target.result);
      setLogoPreview(ev.target.result);
      toast.success('Logo uploaded!');
    };
    reader.readAsDataURL(file);
  };

  const downloadQR = (format = 'png') => {
    const canvas = qrRef.current?.querySelector('canvas') || document.createElement('canvas');
    const svg = qrRef.current?.querySelector('svg');

    const downloadBlob = (blob, ext) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-${Date.now()}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${ext.toUpperCase()} downloaded!`);
    };

    if (format === 'svg' && svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      downloadBlob(blob, 'svg');
    } else {
      canvas.toBlob((blob) => {
        if (blob) downloadBlob(blob, format);
      }, `image/${format === 'jpg' ? 'jpeg' : format}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrValue);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareQR = () => {
    const dataUrl = qrRef.current?.querySelector('canvas')?.toDataURL();
    if (navigator.share && dataUrl) {
      fetch(dataUrl).then(res => res.blob()).then(blob => {
        const file = new File([blob], "qr.png", { type: "image/png" });
        navigator.share({ files: [file], title: "My QR Code" });
      });
    } else {
      toast("Share API not supported");
    }
  };

  const exportHistory = () => {
    const data = JSON.stringify(history, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-history.json';
    a.click();
    toast.success('History exported!');
  };

  const useHistoryItem = (item) => {
    setQrType(item.type);
    setText(item.input);
    setQrValue(item.value);
    setFgColor(item.config.fgColor);
    setBgColor(item.config.bgColor);
    setErrorLevel(item.config.errorLevel);
    setStyle(item.config.style);
    toast.success('Loaded from history');
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('qrHistory');
    toast.success('History cleared');
  };

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-indigo-50 to-purple-100'} py-8 px-4`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Generator */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader >
                <CardTitle className="flex items-center gap-3 text-2xl">
                  QR Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* QR Type Tabs */}
                <Tabs value={qrType} onValueChange={setQrType}>
                  <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
                    {Object.entries(QR_TYPES).map(([key, { icon: Icon, label }]) => (
                      <TabsTrigger key={key} value={key} className="text-xs">
                        <Icon className="h-4 w-4 mr-1" /> {label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                {/* Dynamic Input */}
                {qrType === 'wifi' && (
                  <div className="space-y-3">
                    <Input placeholder="WiFi Name (SSID)" value={text.split('\n')[0] || ''} onChange={e => setText(e.target.value + '\n' + (text.split('\n')[1] || ''))} />
                    <Input type="password" placeholder="Password" value={text.split('\n')[1] || ''} onChange={e => setText((text.split('\n')[0] || '') + '\n' + e.target.value)} />
                  </div>
                )}
                {qrType === 'geo' && (
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Latitude" />
                    <Input placeholder="Longitude" onChange={e => setText(`0,0`)} />
                  </div>
                )}
                {(qrType === 'text' || !['wifi', 'geo'].includes(qrType)) && (
                  <Textarea
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={qrType === 'vcard' ? 'Name\nPhone\nEmail' : 'Enter your content...'}
                    className="resize-none"
                  />
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button onClick={handleGenerate} disabled={loading || !text.trim()} size="lg" className="w-full">
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                  Generate QR Code
                </Button>

                {/* QR Preview */}
                {qrValue && (
                  <div ref={qrRef} className="relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl">
                    <div className="absolute top-4 right-4 flex gap-2 flex-wrap">
                      <Button size="icon" variant="secondary" onClick={copyToClipboard}>
                        {copied ? <Check /> : <Copy />}
                      </Button>
                      <Button size="icon" variant="secondary" onClick={() => downloadQR('png')}>
                        <Download />
                      </Button>
                      <Button size="icon" variant="secondary" onClick={shareQR}>
                        <Share2 />
                      </Button>
                    </div>

                    <div className="flex justify-center">
                      <QRCodeCanvas
                        value={qrValue}
                        size={300}
                        level={errorLevel}
                        fgColor={fgColor}
                        bgColor={bgColor}
                        includeMargin
                        imageSettings={logo ? {
                          src: logo,
                          height: 50,
                          width: 50,
                          excavate: true,
                          opacity: 0.9
                        } : undefined}
                      />
                    </div>

                    <div className="mt-6 text-center space-y-2">
                      <Badge variant="outline">{qrValue.length} chars</Badge>
                      <Badge>{errorLevel} Error Correction</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customization Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" /> Customize
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Foreground</Label>
                  <Input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="h-10" />
                </div>
                <div>
                  <Label>Background</Label>
                  <Input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-10" />
                </div>
                <div>
                  <Label>Error Level</Label>
                  <Select value={errorLevel} onValueChange={setErrorLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Low (7%)</SelectItem>
                      <SelectItem value="M">Medium (15%)</SelectItem>
                      <SelectItem value="Q">Quartile (25%)</SelectItem>
                      <SelectItem value="H">High (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Logo</Label>
                  <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" /> Upload
                  </Button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: History & Tools */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle><History className="inline h-5 w-5" /> History</CardTitle>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={exportHistory}><FileDown className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={clearHistory}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No QR codes yet</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {history.map(item => (
                      <div key={item.id} onClick={() => useHistoryItem(item)} className="p-3 rounded-lg border hover:bg-accent cursor-pointer transition">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
                          <QrCode className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            {/* <p className="font-medium text-sm truncate">{item.input.split('\n')[0]}</p> */}
                            <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {['png', 'svg', 'jpg', 'webp'].map(fmt => (
                  <Button key={fmt} variant="outline" onClick={() => downloadQR(fmt)}>
                    <Download className="h-4 w-4 mr-2" /> .{fmt}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Built with ❤️ for marketers, developers & restaurants
          </p>
          <div className="mt-4 flex justify-center gap-6 text-xs">
            <a href="https://qrcode.show" className="hover:text-purple-600">WiFi QR</a>
            <a href="https://vcard.qr-code-generator.com" className="hover:text-purple-600">vCard</a>
            <a href="https://menu.qr-code-generator.com" className="hover:text-purple-600">Menu</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRSystem;