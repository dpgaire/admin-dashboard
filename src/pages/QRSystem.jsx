import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Copy,
  Check,
  History,
  Sparkles,
  Loader2,
  AlertCircle,
  Trash2,
  Wifi,
  Mail,
  MessageSquare,
  MapPin,
  User,
  Upload,
  Palette,
  Share2,
  FileDown,
  QrCode,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Code,
  Briefcase,
  Package,
  CreditCard,
  ShoppingCart,
  Ticket,
  Calendar,
  FileText,
  Database,
  Link2,
  BarChart3,
  Layers,
  Zap,
  Globe,
  DollarSign,
  TrendingUp,
  Users,
  FileJson,
  Terminal,
  Workflow,
  Gift,
  Type,
  Layout,
  Shirt,
  CupSodaIcon,
  Box,
} from "lucide-react";

const QR_TYPES = {
  text: { icon: QrCode, label: "Text/URL", category: "basic" },
  wifi: { icon: Wifi, label: "WiFi", category: "basic" },
  vcard: { icon: User, label: "Contact", category: "basic" },
  email: { icon: Mail, label: "Email", category: "basic" },
  sms: { icon: MessageSquare, label: "SMS", category: "basic" },
  geo: { icon: MapPin, label: "Location", category: "basic" },
  // Business Use Cases
  payment: { icon: DollarSign, label: "Payment", category: "business" },
  product: { icon: Package, label: "Product Info", category: "business" },
  coupon: { icon: Gift, label: "Coupon", category: "business" },
  event: { icon: Calendar, label: "Event", category: "business" },
  menu: { icon: FileText, label: "Digital Menu", category: "business" },
  review: { icon: TrendingUp, label: "Review Link", category: "business" },
  // Developer Use Cases
  api: { icon: Terminal, label: "API Endpoint", category: "developer" },
  jwt: { icon: Code, label: "JWT Token", category: "developer" },
  json: { icon: FileJson, label: "JSON Data", category: "developer" },
  webhook: { icon: Zap, label: "Webhook", category: "developer" },
  deeplink: { icon: Link2, label: "Deep Link", category: "developer" },
  oauth: { icon: Globe, label: "OAuth", category: "developer" },
};

const QR_STYLES = {
  square: "Square",
  dots: "Dots",
  rounded: "Rounded",
  fluid: "Fluid",
};

// Template configurations
const QR_TEMPLATES = {
  none: {
    name: "No Template",
    icon: Layout,
    border: "none",
    preview: "bg-transparent",
  },
  modern: {
    name: "Modern Border",
    icon: Box,
    border: "2px solid #3b82f6",
    borderRadius: "12px",
    padding: "20px",
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    preview:
      "bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300",
  },
  elegant: {
    name: "Elegant Frame",
    icon: Box,
    border: "1px solid #d1d5db",
    borderRadius: "16px",
    padding: "24px",
    background: "#ffffff",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    preview: "bg-white border border-gray-200 shadow-sm",
  },
  business: {
    name: "Business Card",
    icon: Box,
    border: "none",
    borderRadius: "8px",
    padding: "16px",
    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    preview: "bg-gradient-to-br from-slate-800 to-slate-600 text-white",
  },
  tshirt: {
    name: "T-Shirt",
    icon: Shirt,
    imageUrl: "https://i.imgur.com/t425OkI.png", // A better, cors-friendly URL
    qrStyle: {
      top: "42%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "22%",
    },
    titleStyle: {
      bottom: "25%",
      fontSize: "1.8rem",
      color: "#555555",
    },
    preview: "bg-gray-200",
  },
  cup: {
    name: "Cup",
    icon: CupSodaIcon,
    imageUrl: "https://i.imgur.com/K1T3l1g.png", // A better, cors-friendly URL
    qrStyle: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "30%",
    },
    titleStyle: {
      bottom: "20%",
      fontSize: "1.5rem",
      color: "#333333",
    },
    preview: "bg-gray-100",
  },
  minimal: {
    name: "Minimal",
    icon: Layout,
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    padding: "10px",
    background: "#ffffff",
    preview: "bg-white border border-gray-200",
  },
  rounded: {
    name: "Rounded Color",
    icon: Box,
    border: "none",
    borderRadius: "24px",
    padding: "20px",
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    preview: "bg-gradient-to-br from-indigo-500 to-purple-500 text-white",
  },
};

const QRSystem = () => {
  const [activeTab, setActiveTab] = useState("generate");
  const [qrType, setQrType] = useState("text");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Form States
  const [formData, setFormData] = useState({
    text: "",
    url: "",
    wifiSSID: "",
    wifiPassword: "",
    wifiEncryption: "WPA",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contactOrg: "",
    contactUrl: "",
    emailTo: "",
    emailSubject: "",
    emailBody: "",
    smsPhone: "",
    smsMessage: "",
    geoLat: "",
    geoLng: "",
    // Business fields
    paymentMethod: "upi",
    paymentId: "",
    paymentAmount: "",
    paymentNote: "",
    productName: "",
    productSKU: "",
    productPrice: "",
    productUrl: "",
    couponCode: "",
    couponDiscount: "",
    couponExpiry: "",
    eventName: "",
    eventDate: "",
    eventLocation: "",
    eventUrl: "",
    menuUrl: "",
    reviewPlatform: "google",
    reviewUrl: "",
    apiEndpoint: "",
    apiMethod: "GET",
    apiHeaders: "",
    jwtToken: "",
    jsonData: "",
    webhookUrl: "",
    webhookSecret: "",
    deeplinkScheme: "",
    deeplinkPath: "",
    oauthProvider: "google",
    oauthClientId: "",
    oauthRedirect: "",
  });

  const [qrValue, setQrValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [batchData, setBatchData] = useState("");
  const [batchResults, setBatchResults] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalGenerated: 0,
    byType: {},
    byDate: {},
  });

  // Customization
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [transparentBg, setTransparentBg] = useState(false);
  const [errorLevel, setErrorLevel] = useState("H");
  const [style, setStyle] = useState("square");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [logoSize] = useState([60, 60]);

  // Template States
  const [qrTitle, setQrTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("none");

  const qrRef = useRef(null);
  const fileInputRef = useRef(null);
  const batchContainerRef = useRef(null);

  // Load history & analytics
  useEffect(() => {
    const saved = localStorage.getItem("qrHistory");
    if (saved) {
      const parsedHistory = JSON.parse(saved);
      setHistory(parsedHistory);
      updateAnalytics(parsedHistory);
    }
  }, []);

  const updateAnalytics = (historyData) => {
    const stats = {
      totalGenerated: historyData.length,
      byType: {},
      byDate: {},
    };

    historyData.forEach((item) => {
      stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
      const date = new Date(item.timestamp).toLocaleDateString();
      stats.byDate[date] = (stats.byDate[date] || 0) + 1;
    });

    setAnalytics(stats);
  };

  // Save to history
  const saveToHistory = (type, data, value) => {
    const newEntry = {
      id: Date.now(),
      type,
      data,
      value,
      config: {
        fgColor,
        bgColor,
        transparentBg,
        errorLevel,
        style,
        hasLogo: !!logo,
        template: selectedTemplate,
        title: qrTitle,
      },
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...history.slice(0, 99)];
    setHistory(updated);
    localStorage.setItem("qrHistory", JSON.stringify(updated));
    updateAnalytics(updated);
  };

  // Generate QR value based on type
  const generateValue = () => {
    switch (qrType) {
      case "text":
        return formData.text || formData.url;
      case "wifi":
        return `WIFI:T:${
          formData.wifiEncryption
        };S:${formData.wifiSSID.trim()};P:${formData.wifiPassword};;`;
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${formData.contactName}\nTEL:${formData.contactPhone}\nEMAIL:${formData.contactEmail}\nORG:${formData.contactOrg}\nURL:${formData.contactUrl}\nEND:VCARD`;
      case "email":
        const emailParams = new URLSearchParams();
        if (formData.emailSubject)
          emailParams.append("subject", formData.emailSubject);
        if (formData.emailBody) emailParams.append("body", formData.emailBody);
        return `mailto:${formData.emailTo}${
          emailParams.toString() ? "?" + emailParams : ""
        }`;
      case "sms":
        return `SMSTO:${formData.smsPhone}${
          formData.smsMessage ? ":" + formData.smsMessage : ""
        }`;
      case "geo":
        return `geo:${formData.geoLat},${formData.geoLng}`;
      // Business cases
      case "payment":
        if (formData.paymentMethod === "upi") {
          return `upi://pay?pa=${formData.paymentId}&pn=Merchant&am=${formData.paymentAmount}&cu=INR&tn=${formData.paymentNote}`;
        }
        return `${formData.paymentMethod}:${formData.paymentId}?amount=${formData.paymentAmount}`;
      case "product":
        return JSON.stringify({
          name: formData.productName,
          sku: formData.productSKU,
          price: formData.productPrice,
          url: formData.productUrl,
        });
      case "coupon":
        return JSON.stringify({
          code: formData.couponCode,
          discount: formData.couponDiscount,
          expiry: formData.couponExpiry,
        });
      case "event":
        return `BEGIN:VEVENT\nSUMMARY:${formData.eventName}\nDTSTART:${formData.eventDate}\nLOCATION:${formData.eventLocation}\nURL:${formData.eventUrl}\nEND:VEVENT`;
      case "menu":
        return formData.menuUrl;
      case "review":
        return formData.reviewUrl;
      // Developer cases
      case "api":
        return JSON.stringify({
          endpoint: formData.apiEndpoint,
          method: formData.apiMethod,
          headers: formData.apiHeaders ? JSON.parse(formData.apiHeaders) : {},
        });
      case "jwt":
        return formData.jwtToken;
      case "json":
        return formData.jsonData;
      case "webhook":
        return JSON.stringify({
          url: formData.webhookUrl,
          secret: formData.webhookSecret,
        });
      case "deeplink":
        return `${formData.deeplinkScheme}://${formData.deeplinkPath}`;
      case "oauth":
        return `https://accounts.${formData.oauthProvider}.com/o/oauth2/auth?client_id=${formData.oauthClientId}&redirect_uri=${formData.oauthRedirect}&response_type=code`;
      default:
        return formData.text;
    }
  };

  const handleGenerate = async () => {
    setError("");
    setLoading(true);
    try {
      const value = generateValue();
      setQrValue(value);
      saveToHistory(qrType, formData, value);
    } catch (err) {
      setError("Generation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchGenerate = () => {
    try {
      const lines = batchData.split("\n").filter((l) => l.trim());
      const results = lines.map((line, idx) => ({
        id: Date.now() + idx,
        value: line.trim(),
        type: qrType,
      }));
      setBatchResults(results);
      results.forEach((r) => saveToHistory(qrType, { text: r.value }, r.value));
    } catch (err) {
      setError("Batch generation failed");
    }
  };

  const downloadAllBatch = () => {
    const zip = batchResults
      .map((item, idx) => {
        const canvas = document
          .getElementById(`batch-qr-${idx}`)
          ?.querySelector("canvas");
        return canvas?.toDataURL("image/png");
      })
      .filter(Boolean);

    zip.forEach((dataUrl, idx) => {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `qr-${idx + 1}.png`;
      a.click();
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogo(ev.target.result);
      setLogoPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const downloadQR = (format = "png") => {
    const template = QR_TEMPLATES[selectedTemplate];

    if (template && template.imageUrl && qrRef.current) {
      const container = qrRef.current;
      const qrCanvas = container.querySelector("canvas");
      const bgImage = new Image();
      bgImage.crossOrigin = "Anonymous";

      bgImage.onload = () => {
        const finalCanvas = document.createElement("canvas");
        const ctx = finalCanvas.getContext("2d");

        finalCanvas.width = bgImage.naturalWidth;
        finalCanvas.height = bgImage.naturalHeight;

        // 1. Draw background image
        ctx.drawImage(bgImage, 0, 0);

        // 2. Draw QR Code
        if (qrCanvas) {
          const qrStyle = template.qrStyle;
          const qrWidth = finalCanvas.width * (parseFloat(qrStyle.width) / 100);
          const qrHeight = qrWidth; // Assuming square QR code

          let qrX = 0;
          let qrY = 0;

          const top = parseFloat(qrStyle.top);
          const left = parseFloat(qrStyle.left);

          if (qrStyle.transform === "translate(-50%, -50%)") {
            qrX = finalCanvas.width * (left / 100) - qrWidth / 2;
            qrY = finalCanvas.height * (top / 100) - qrHeight / 2;
          } else {
            // Basic positioning if no transform
            qrX = finalCanvas.width * (left / 100);
            qrY = finalCanvas.height * (top / 100);
          }

          ctx.drawImage(qrCanvas, qrX, qrY, qrWidth, qrHeight);
        }

        // 3. Draw Title
        if (qrTitle && template.titleStyle) {
          const titleStyle = template.titleStyle;
          const baseFontSize = 16; // assuming 1rem = 16px
          const fontSizeRem = parseFloat(titleStyle.fontSize);
          const dynamicFontSize =
            fontSizeRem * baseFontSize * (finalCanvas.width / 600); // Scale with canvas width, base 600px

          ctx.font = `bold ${dynamicFontSize}px Arial`;
          ctx.fillStyle = titleStyle.color;
          ctx.textAlign = "center";

          let titleX = finalCanvas.width / 2;
          let titleY = 0;

          if (titleStyle.top) {
            titleY = finalCanvas.height * (parseFloat(titleStyle.top) / 100);
          } else if (titleStyle.bottom) {
            titleY =
              finalCanvas.height -
              finalCanvas.height * (parseFloat(titleStyle.bottom) / 100);
          }

          ctx.fillText(qrTitle, titleX, titleY);
        }

        // 4. Trigger download
        const dataUrl = finalCanvas.toDataURL(`image/${format}`);
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `qr-${template.name
          .toLowerCase()
          .replace(" ", "-")}-${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      bgImage.onerror = () => {
        setError("Failed to load template image. Please check the image URL.");
      };

      bgImage.src = template.imageUrl;
    } else {
      // Fallback to original download logic for non-template QR codes
      const canvas = qrRef.current?.querySelector("canvas");
      if (!canvas) return;

      if (format === "svg") {
        alert("SVG download is not available for this QR code.");
        return;
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `qr-code-${Date.now()}.${format}`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }, `image/${format === "jpg" ? "jpeg" : format}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportHistory = () => {
    const data = JSON.stringify(history, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-history.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Apply template styles to QR container
  const getTemplateStyles = () => {
    const template = QR_TEMPLATES[selectedTemplate];
    if (!template || selectedTemplate === "none") return {};

    return {
      border: template.border,
      borderRadius: template.borderRadius,
      padding: template.padding,
      background: template.background,
      boxShadow: template.boxShadow,
    };
  };

  // Dynamic Input Renderer
  const renderInput = () => {
    const businessInputs = {
      payment: (
        <div className="space-y-4">
          <Select
            value={formData.paymentMethod}
            onValueChange={(v) =>
              setFormData({ ...formData, paymentMethod: v })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="bitcoin">Bitcoin</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Payment ID/Address *"
            value={formData.paymentId}
            onChange={(e) =>
              setFormData({ ...formData, paymentId: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Amount"
            value={formData.paymentAmount}
            onChange={(e) =>
              setFormData({ ...formData, paymentAmount: e.target.value })
            }
          />
          <Input
            placeholder="Note/Description"
            value={formData.paymentNote}
            onChange={(e) =>
              setFormData({ ...formData, paymentNote: e.target.value })
            }
          />
        </div>
      ),
      product: (
        <div className="space-y-4">
          <Input
            placeholder="Product Name *"
            value={formData.productName}
            onChange={(e) =>
              setFormData({ ...formData, productName: e.target.value })
            }
          />
          <Input
            placeholder="SKU"
            value={formData.productSKU}
            onChange={(e) =>
              setFormData({ ...formData, productSKU: e.target.value })
            }
          />
          <Input
            placeholder="Price"
            value={formData.productPrice}
            onChange={(e) =>
              setFormData({ ...formData, productPrice: e.target.value })
            }
          />
          <Input
            placeholder="Product URL"
            value={formData.productUrl}
            onChange={(e) =>
              setFormData({ ...formData, productUrl: e.target.value })
            }
          />
        </div>
      ),
      coupon: (
        <div className="space-y-4">
          <Input
            placeholder="Coupon Code *"
            value={formData.couponCode}
            onChange={(e) =>
              setFormData({ ...formData, couponCode: e.target.value })
            }
          />
          <Input
            placeholder="Discount (e.g., 20%)"
            value={formData.couponDiscount}
            onChange={(e) =>
              setFormData({ ...formData, couponDiscount: e.target.value })
            }
          />
          <Input
            type="date"
            placeholder="Expiry Date"
            value={formData.couponExpiry}
            onChange={(e) =>
              setFormData({ ...formData, couponExpiry: e.target.value })
            }
          />
        </div>
      ),
      event: (
        <div className="space-y-4">
          <Input
            placeholder="Event Name *"
            value={formData.eventName}
            onChange={(e) =>
              setFormData({ ...formData, eventName: e.target.value })
            }
          />
          <Input
            type="datetime-local"
            value={formData.eventDate}
            onChange={(e) =>
              setFormData({ ...formData, eventDate: e.target.value })
            }
          />
          <Input
            placeholder="Location"
            value={formData.eventLocation}
            onChange={(e) =>
              setFormData({ ...formData, eventLocation: e.target.value })
            }
          />
          <Input
            placeholder="Event URL"
            value={formData.eventUrl}
            onChange={(e) =>
              setFormData({ ...formData, eventUrl: e.target.value })
            }
          />
        </div>
      ),
      menu: (
        <Input
          placeholder="Digital Menu URL *"
          value={formData.menuUrl}
          onChange={(e) =>
            setFormData({ ...formData, menuUrl: e.target.value })
          }
        />
      ),
      review: (
        <div className="space-y-4">
          <Select
            value={formData.reviewPlatform}
            onValueChange={(v) =>
              setFormData({ ...formData, reviewPlatform: v })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="yelp">Yelp</SelectItem>
              <SelectItem value="trustpilot">Trustpilot</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Review Page URL *"
            value={formData.reviewUrl}
            onChange={(e) =>
              setFormData({ ...formData, reviewUrl: e.target.value })
            }
          />
        </div>
      ),
    };

    const developerInputs = {
      api: (
        <div className="space-y-4">
          <Input
            placeholder="API Endpoint *"
            value={formData.apiEndpoint}
            onChange={(e) =>
              setFormData({ ...formData, apiEndpoint: e.target.value })
            }
          />
          <Select
            value={formData.apiMethod}
            onValueChange={(v) => setFormData({ ...formData, apiMethod: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            placeholder='Headers (JSON format, e.g., {"Authorization": "Bearer token"})'
            value={formData.apiHeaders}
            onChange={(e) =>
              setFormData({ ...formData, apiHeaders: e.target.value })
            }
            rows={3}
          />
        </div>
      ),
      jwt: (
        <Textarea
          placeholder="JWT Token *"
          value={formData.jwtToken}
          onChange={(e) =>
            setFormData({ ...formData, jwtToken: e.target.value })
          }
          rows={5}
        />
      ),
      json: (
        <Textarea
          placeholder="JSON Data *"
          value={formData.jsonData}
          onChange={(e) =>
            setFormData({ ...formData, jsonData: e.target.value })
          }
          rows={8}
        />
      ),
      webhook: (
        <div className="space-y-4">
          <Input
            placeholder="Webhook URL *"
            value={formData.webhookUrl}
            onChange={(e) =>
              setFormData({ ...formData, webhookUrl: e.target.value })
            }
          />
          <Input
            type="password"
            placeholder="Webhook Secret"
            value={formData.webhookSecret}
            onChange={(e) =>
              setFormData({ ...formData, webhookSecret: e.target.value })
            }
          />
        </div>
      ),
      deeplink: (
        <div className="space-y-4">
          <Input
            placeholder="URL Scheme (e.g., myapp) *"
            value={formData.deeplinkScheme}
            onChange={(e) =>
              setFormData({ ...formData, deeplinkScheme: e.target.value })
            }
          />
          <Input
            placeholder="Path (e.g., profile/123)"
            value={formData.deeplinkPath}
            onChange={(e) =>
              setFormData({ ...formData, deeplinkPath: e.target.value })
            }
          />
        </div>
      ),
      oauth: (
        <div className="space-y-4">
          <Select
            value={formData.oauthProvider}
            onValueChange={(v) =>
              setFormData({ ...formData, oauthProvider: v })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="github">GitHub</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Client ID *"
            value={formData.oauthClientId}
            onChange={(e) =>
              setFormData({ ...formData, oauthClientId: e.target.value })
            }
          />
          <Input
            placeholder="Redirect URI"
            value={formData.oauthRedirect}
            onChange={(e) =>
              setFormData({ ...formData, oauthRedirect: e.target.value })
            }
          />
        </div>
      ),
    };

    // Return business or developer inputs if applicable
    if (businessInputs[qrType]) return businessInputs[qrType];
    if (developerInputs[qrType]) return developerInputs[qrType];

    // Default basic inputs
    const basicInputs = {
      text: (
        <Textarea
          placeholder="Enter text or URL...or tel:+9779846724440"
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          rows={5}
        />
      ),
      wifi: (
        <div className="space-y-4">
          <Input
            placeholder="Network Name (SSID) *"
            value={formData.wifiSSID}
            onChange={(e) =>
              setFormData({ ...formData, wifiSSID: e.target.value })
            }
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.wifiPassword}
              onChange={(e) =>
                setFormData({ ...formData, wifiPassword: e.target.value })
              }
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Select
            value={formData.wifiEncryption}
            onValueChange={(v) =>
              setFormData({ ...formData, wifiEncryption: v })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WPA">WPA/WPA2</SelectItem>
              <SelectItem value="WEP">WEP</SelectItem>
              <SelectItem value="nopass">Open</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
      vcard: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Full Name *"
            value={formData.contactName}
            onChange={(e) =>
              setFormData({ ...formData, contactName: e.target.value })
            }
          />
          <Input
            placeholder="Phone"
            value={formData.contactPhone}
            onChange={(e) =>
              setFormData({ ...formData, contactPhone: e.target.value })
            }
          />
          <Input
            placeholder="Email"
            value={formData.contactEmail}
            onChange={(e) =>
              setFormData({ ...formData, contactEmail: e.target.value })
            }
          />
          <Input
            placeholder="Company"
            value={formData.contactOrg}
            onChange={(e) =>
              setFormData({ ...formData, contactOrg: e.target.value })
            }
          />
          <Input
            placeholder="Website"
            className="md:col-span-2"
            value={formData.contactUrl}
            onChange={(e) =>
              setFormData({ ...formData, contactUrl: e.target.value })
            }
          />
        </div>
      ),
      email: (
        <div className="space-y-4">
          <Input
            placeholder="Email Address *"
            value={formData.emailTo}
            onChange={(e) =>
              setFormData({ ...formData, emailTo: e.target.value })
            }
          />
          <Input
            placeholder="Subject"
            value={formData.emailSubject}
            onChange={(e) =>
              setFormData({ ...formData, emailSubject: e.target.value })
            }
          />
          <Textarea
            placeholder="Message"
            rows={3}
            value={formData.emailBody}
            onChange={(e) =>
              setFormData({ ...formData, emailBody: e.target.value })
            }
          />
        </div>
      ),
      sms: (
        <div className="space-y-4">
          <Input
            placeholder="Phone Number *"
            value={formData.smsPhone}
            onChange={(e) =>
              setFormData({ ...formData, smsPhone: e.target.value })
            }
          />
          <Textarea
            placeholder="Message"
            rows={3}
            value={formData.smsMessage}
            onChange={(e) =>
              setFormData({ ...formData, smsMessage: e.target.value })
            }
          />
        </div>
      ),
      geo: (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Latitude *</Label>
            <Input
              placeholder="40.7128"
              value={formData.geoLat}
              onChange={(e) =>
                setFormData({ ...formData, geoLat: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Longitude *</Label>
            <Input
              placeholder="-74.0060"
              value={formData.geoLng}
              onChange={(e) =>
                setFormData({ ...formData, geoLng: e.target.value })
              }
            />
          </div>
        </div>
      ),
    };

    return basicInputs[qrType] || null;
  };

  const filteredTypes = Object.entries(QR_TYPES).filter(
    ([_, type]) => categoryFilter === "all" || type.category === categoryFilter
  );

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="generate">
              <QrCode className="h-4 w-4 mr-2" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="batch">
              <Layers className="h-4 w-4 mr-2" />
              Batch
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="docs">
              <Code className="h-4 w-4 mr-2" />
              API Docs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create QR Code</CardTitle>
                    <CardDescription>
                      Choose from {Object.keys(QR_TYPES).length} different types
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex gap-2 mb-3">
                        {["all", "basic", "business", "developer"].map(
                          (cat) => (
                            <Badge
                              key={cat}
                              variant={
                                categoryFilter === cat ? "default" : "outline"
                              }
                              className="cursor-pointer"
                              onClick={() => setCategoryFilter(cat)}
                            >
                              {cat === "all"
                                ? "All"
                                : cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </Badge>
                          )
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {filteredTypes.map(([key, { icon: Icon, label }]) => (
                          <Button
                            key={key}
                            variant={qrType === key ? "default" : "outline"}
                            className="h-auto py-3 flex flex-col gap-1"
                            onClick={() => setQrType(key)}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="text-xs">{label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 rounded-xl">{renderInput()}</div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handleGenerate}
                      disabled={loading}
                      size="lg"
                      className="w-full"
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-5 w-5" />
                      )}
                      Generate QR Code
                    </Button>

                    {qrValue && (
                      <div
                        ref={qrRef}
                        className="relative rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden"
                        style={
                          !QR_TEMPLATES[selectedTemplate]?.imageUrl
                            ? getTemplateStyles()
                            : {}
                        }
                      >
                        <div className="absolute top-4 right-4 flex gap-2 flex-wrap z-20">
                          <Button
                            size="icon"
                            variant={"secondary"}
                            onClick={copyToClipboard}
                          >
                            {copied ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant={"secondary"}
                            onClick={() => downloadQR("png")}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>

                        {QR_TEMPLATES[selectedTemplate]?.imageUrl ? (
                          <div className="relative">
                            <img
                              src={QR_TEMPLATES[selectedTemplate].imageUrl}
                              alt={QR_TEMPLATES[selectedTemplate].name}
                              className="w-full h-auto"
                            />
                            <div
                              className="absolute"
                              style={QR_TEMPLATES[selectedTemplate].qrStyle}
                            >
                              <QRCodeCanvas
                                value={qrValue}
                                size={256} // A fixed size for the canvas for consistency
                                level={errorLevel}
                                fgColor={fgColor}
                                bgColor={
                                  transparentBg ? "transparent" : bgColor
                                }
                                includeMargin
                                imageSettings={
                                  logo
                                    ? {
                                        src: logo,
                                        height: logoSize[0],
                                        width: logoSize[1],
                                        excavate: true,
                                      }
                                    : undefined
                                }
                              />
                            </div>
                            {qrTitle && (
                              <div
                                className="absolute w-full text-center"
                                style={
                                  QR_TEMPLATES[selectedTemplate].titleStyle
                                }
                              >
                                <h3
                                  className="font-bold"
                                  style={{
                                    fontSize:
                                      QR_TEMPLATES[selectedTemplate].titleStyle
                                        .fontSize,
                                    color:
                                      QR_TEMPLATES[selectedTemplate].titleStyle
                                        .color,
                                    textShadow:
                                      "0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.8)",
                                  }}
                                >
                                  {qrTitle}
                                </h3>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-8">
                            {qrTitle && (
                              <div className="mb-4 text-center">
                                <h3
                                  className={`text-xl font-bold ${
                                    selectedTemplate === "business" ||
                                    selectedTemplate === "rounded"
                                      ? "text-white"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {qrTitle}
                                </h3>
                              </div>
                            )}
                            <div className="flex justify-center">
                              <QRCodeCanvas
                                value={qrValue}
                                size={280}
                                level={errorLevel}
                                fgColor={fgColor}
                                bgColor={
                                  transparentBg ? "transparent" : bgColor
                                }
                                includeMargin
                                imageSettings={
                                  logo
                                    ? {
                                        src: logo,
                                        height: logoSize[0],
                                        width: logoSize[1],
                                        excavate: true,
                                      }
                                    : undefined
                                }
                              />
                            </div>
                            <div className="mt-6 text-center">
                              <div className="flex justify-center gap-2 flex-wrap">
                                <Badge
                                  variant={
                                    selectedTemplate === "none"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {qrValue.length} chars
                                </Badge>
                                <Badge
                                  variant={
                                    selectedTemplate === "none"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {errorLevel} Error Correction
                                </Badge>
                                <Badge
                                  variant={
                                    selectedTemplate === "none"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {QR_TYPES[qrType]?.label}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" /> Customization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Foreground</Label>
                        <Input
                          type="color"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Background</Label>
                        <Input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          disabled={transparentBg}
                        />
                      </div>
                      <div>
                        <Label>Error Level</Label>
                        <Select
                          value={errorLevel}
                          onValueChange={setErrorLevel}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="L">Low (7%)</SelectItem>
                            <SelectItem value="M">Medium (15%)</SelectItem>
                            <SelectItem value="Q">High (25%)</SelectItem>
                            <SelectItem value="H">Max (30%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Style</Label>
                        <Select value={style} onValueChange={setStyle}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(QR_STYLES).map(([k, v]) => (
                              <SelectItem key={k} value={k}>
                                {v}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Transparent Background</Label>
                      <Switch
                        checked={transparentBg}
                        onCheckedChange={setTransparentBg}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Type className="h-5 w-5" /> Title & Template
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="qr-title">QR Code Title</Label>
                      <Input
                        id="qr-title"
                        placeholder="Enter title or name..."
                        value={qrTitle}
                        onChange={(e) => setQrTitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <Separator />

                    <div>
                      <Label>Choose Template</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {Object.entries(QR_TEMPLATES).map(([key, template]) => {
                          const Icon = template.icon;
                          return (
                            <Button
                              key={key}
                              variant={
                                selectedTemplate === key ? "default" : "outline"
                              }
                              className="h-auto py-3 flex flex-col gap-1"
                              onClick={() => setSelectedTemplate(key)}
                            >
                              <Icon className="h-4 w-4" />
                              <span className="text-xs">{template.name}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {selectedTemplate !== "none" && (
                      <div className="p-3 rounded-lg border-2 border-dashed border-gray-200 text-center">
                        <div
                          className={`p-4 rounded-lg ${QR_TEMPLATES[selectedTemplate].preview}`}
                        >
                          <div className="w-16 h-16 mx-auto rounded flex items-center justify-center">
                            <QrCode className="h-6 w-6" />
                          </div>
                          {qrTitle && (
                            <p className="text-xs font-medium mt-2 truncate">
                              {qrTitle}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {QR_TEMPLATES[selectedTemplate].name} Preview
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Logo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {logoPreview ? (
                      <div className="space-y-3">
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="w-full rounded-lg border"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setLogo(null);
                            setLogoPreview("");
                          }}
                          className="w-full"
                        >
                          Remove Logo
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" /> Upload Logo
                      </Button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Export</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadQR("png")}
                    >
                      PNG
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadQR("jpg")}
                    >
                      JPG
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadQR("svg")}
                    >
                      SVG
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTransparentBg(true);
                        setTimeout(() => downloadQR("png"), 100);
                      }}
                    >
                      Transparent
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <History className="h-5 w-5" /> History
                      </CardTitle>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setHistory([]);
                          localStorage.removeItem("qrHistory");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {history.length === 0 ? (
                      <p className="text-center text-gray-500 py-8 text-sm">
                        No history yet
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {history.slice(0, 10).map((item) => {
                          const Icon = QR_TYPES[item.type]?.icon || QrCode;
                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                setQrType(item.type);
                                setFormData(item.data);
                                setQrValue(item.value);
                                setSelectedTemplate(
                                  item.config?.template || "none"
                                );
                                setQrTitle(item.config?.title || "");
                              }}
                              className="p-3 rounded-lg border  cursor-pointer transition flex items-center gap-3"
                            >
                              <div className="p-2 rounded">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">
                                  {item.config?.title ||
                                    QR_TYPES[item.type]?.label}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(item.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="batch">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" /> Batch Generation
                </CardTitle>
                <CardDescription>
                  Generate multiple QR codes at once (one per line)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Enter URLs or data, one per line&#10;https://example.com/product/1&#10;https://example.com/product/2&#10;https://example.com/product/3"
                  rows={10}
                  value={batchData}
                  onChange={(e) => setBatchData(e.target.value)}
                />
                <div className="flex gap-3">
                  <Button onClick={handleBatchGenerate} className="flex-1">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate{" "}
                    {batchData.split("\n").filter((l) => l.trim()).length} QR
                    Codes
                  </Button>
                  {batchResults.length > 0 && (
                    <Button onClick={downloadAllBatch} variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download All
                    </Button>
                  )}
                </div>

                {batchResults.length > 0 && (
                  <div
                    ref={batchContainerRef}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6"
                  >
                    {batchResults.map((item, idx) => (
                      <div
                        key={item.id}
                        id={`batch-qr-${idx}`}
                        className="p-4  rounded-lg border shadow-sm"
                      >
                        <QRCodeCanvas
                          value={item.value}
                          size={150}
                          level={errorLevel}
                          fgColor={fgColor}
                          bgColor={bgColor}
                          includeMargin
                        />
                        <p className="text-xs text-center mt-2 truncate">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" /> Total Generated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-indigo-600">
                    {analytics.totalGenerated}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">QR codes created</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" /> By Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(analytics.byType)
                      .slice(0, 5)
                      .map(([type, count]) => (
                        <div
                          key={type}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm">
                            {QR_TYPES[type]?.label || type}
                          </span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" /> Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(analytics.byDate)
                      .slice(0, 5)
                      .map(([date, count]) => (
                        <div
                          key={date}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm">{date}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Export Analytics</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-3">
                  <Button onClick={exportHistory}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Export History (JSON)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const csv = history
                        .map(
                          (h) =>
                            `${h.type},${h.timestamp},${h.value.replace(
                              /,/g,
                              ";"
                            )}`
                        )
                        .join("\n");
                      const blob = new Blob([csv], { type: "text/csv" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "qr-analytics.csv";
                      a.click();
                    }}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Export as CSV
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="docs">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" /> Developer Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">JavaScript Example</h3>
                    <pre className=" p-4 rounded-lg text-xs overflow-x-auto">
                      {`import QRCode from 'qrcode';

// Generate QR Code
const generateQR = async (data) => {
  try {
    const url = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 500,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return url;
  } catch (err) {
    console.error(err);
  }
};

// Usage
const qrUrl = await generateQR('https://example.com');`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Python Example</h3>
                    <pre className=" p-4 rounded-lg text-xs overflow-x-auto">
                      {`import qrcode

# Create QR Code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)

qr.add_data('https://example.com')
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save("qrcode.png")`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" /> Business Use Cases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Payment Links</h4>
                        <p className="text-sm ">
                          Accept payments via UPI, PayPal, or crypto
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2rounded">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Product Tracking</h4>
                        <p className="text-sm ">
                          Track inventory with unique QR codes per product
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded">
                        <Gift className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Digital Coupons</h4>
                        <p className="text-sm ">
                          Create scannable discount codes for customers
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded">
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Review Collection</h4>
                        <p className="text-sm ">
                          Direct customers to your review pages
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded">
                        <FileText className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Contactless Menus</h4>
                        <p className="text-sm ">
                          Perfect for restaurants and cafes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded">
                        <Ticket className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Event Registration</h4>
                        <p className="text-sm ">
                          Quick check-in with calendar integration
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" /> Developer Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded">
                        <Terminal className="h-5 w-5 text-cyan-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">API Endpoints</h4>
                        <p className="text-sm ">
                          Encode API URLs with authentication headers
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded">
                        <Zap className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Webhooks</h4>
                        <p className="text-sm ">
                          Share webhook URLs securely with secrets
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded">
                        <Link2 className="h-5 w-5 text-lime-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Deep Links</h4>
                        <p className="text-sm ">
                          Create app deep links for mobile navigation
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded">
                        <FileJson className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">JSON Payloads</h4>
                        <p className="text-sm ">
                          Encode complex data structures
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded">
                        <Database className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">JWT Tokens</h4>
                        <p className="text-sm ">
                          Share authentication tokens securely
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded">
                        <Globe className="h-5 w-5 text-violet-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">OAuth Flows</h4>
                        <p className="text-sm ">
                          Generate OAuth authorization URLs
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Workflow className="h-5 w-5" /> Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Error Correction:</strong> Use level H (30%) for
                        codes with logos or in challenging environments
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Size:</strong> Minimum 2cm x 2cm for print,
                        200px for digital displays
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Contrast:</strong> Ensure high contrast between
                        foreground and background
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Testing:</strong> Always test QR codes on
                        multiple devices before deployment
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>URLs:</strong> Use URL shorteners for long links
                        to reduce complexity
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Analytics:</strong> Use tracking parameters to
                        measure scan rates
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QRSystem;
