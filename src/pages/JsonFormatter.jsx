import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Expand, Shrink, Eye, EyeOff } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import toast from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";


const JsonFormatter = () => {
  const [inputJson, setInputJson] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [error, setError] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
    const { theme } = useTheme();

  console.log("theme", theme);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedJson(formatted);
      setError("");
    } catch (e) {
      setFormattedJson("");
      setError("Invalid JSON: " + e.message);
      toast.error("Invalid JSON format!");
    }
  };

  const handleCopy = () => {
    if (formattedJson) {
      navigator.clipboard.writeText(formattedJson);
      toast.success("Formatted JSON copied to clipboard!");
    } else {
      toast.error("Nothing to copy!");
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div
      className={`space-y-6 ${
        isFullScreen ? "fixed inset-0 bg-gray-900 z-50 p-6" : ""
      }`}
    >
      <div className="flex flex-col md:flex-row items-start gap-2 md:gap-0 md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            JSON Formatter
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Paste your JSON and format it beautifully.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleFormat}>Format JSON</Button>
          <Button onClick={handleCopy} variant="outline">
            <Copy className="mr-2 h-4 w-4" /> Copy
          </Button>
          <Button onClick={togglePreview} variant="outline">
            {showPreview ? (
              <EyeOff className="mr-2 h-4 w-4" />
            ) : (
              <Eye className="mr-2 h-4 w-4" />
            )}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button onClick={toggleFullScreen} variant="outline">
            {isFullScreen ? (
              <Shrink className="mr-2 h-4 w-4" />
            ) : (
              <Expand className="mr-2 h-4 w-4" />
            )}
            {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
          </Button>
        </div>
      </div>
      <div
        className={`grid ${
          showPreview ? "md:grid-cols-2" : "md:grid-cols-1"
        } gap-6`}
      >
        <Card>
          <CardHeader>
            <CardTitle>Input JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              placeholder="Paste your JSON here..."
              className="h-[550px] text-base font-mono"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </CardContent>
        </Card>
        {showPreview && (
          <Card>
            <CardHeader>
              <CardTitle>Formatted JSON</CardTitle>
            </CardHeader>
            <CardContent>
              {formattedJson && theme && formattedJson.trim() !== "" ? (
                <div className="h-[550px] rounded-md overflow-auto">
                  <Highlight
                    key={theme}
                    theme={theme === "dark" ? themes.vsDark : themes.github}
                    code={formattedJson}
                    language="json"
                  >
                    {({
                      className,
                      style,
                      tokens,
                      getLineProps,
                      getTokenProps,
                    }) => (
                      <pre className={className} style={style}>
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line })}>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                </div>
              ) : (
                <p>Input value not set.....</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JsonFormatter;
