import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCcw, Copy, Eye, EyeOff, FileText, Maximize2, Minimize2, Loader2 } from "lucide-react";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef(null);
  const pdfPreviewRef = useRef(null);

  useEffect(() => {
    const defaultMarkdown = "# 📝 Professional Markdown Editor\n\nA **real-time markdown editor** with advanced PDF export capabilities.\n\n## Key Features\n\n- **Live Preview** - See changes instantly\n- **High-Quality PDF Export** - Perfect formatting and spacing\n- **Auto-Statistics** - Word, character, and line count\n- **Copy to Clipboard** - One-click copying\n- **Toggle Preview** - Focus mode available\n- **Fullscreen Mode** - Distraction-free writing\n- **Download as .md** - Export source files\n\n---\n\n## Getting Started\n\nStart typing in the editor on the left, and watch your content render beautifully on the right.\n\n### Formatting Examples\n\n**Bold text** is created with double asterisks.\n\n*Italic text* uses single asterisks.\n\n***Bold and italic*** combines both.\n\n### Lists\n\n#### Unordered Lists\n- First item\n- Second item\n  - Nested item\n  - Another nested item\n- Third item\n\n#### Ordered Lists\n1. First step\n2. Second step\n3. Third step\n\n### Code Blocks\n\n```javascript\nfunction hello() {\n  console.log('Hello, World!');\n}\n```\n\n### Blockquotes\n\n> This is a blockquote.\n> It can span multiple lines.\n\n### Tables\n\n| Feature | Status | Priority |\n|---------|--------|----------|\n| Editor | ✅ Done | High |\n| Preview | ✅ Done | High |\n| Export | ✅ Done | High |\n\n### Links and Images\n\n[Visit OpenAI](https://openai.com)\n\n---\n\n## Tips for Best Results\n\n1. Use proper heading hierarchy\n2. Add spacing between sections\n3. Keep paragraphs concise\n4. Use lists for better readability\n\n**Happy Writing! 🚀**";
    setMarkdown(defaultMarkdown);
  }, []);

  useEffect(() => {
    const words = markdown.trim().split(/\s+/).filter(Boolean).length;
    const lines = markdown.split('\n').length;
    setWordCount(words);
    setCharCount(markdown.length);
    setLineCount(lines);
  }, [markdown]);

  const handleDownloadPdf = async () => {
    if (!markdown.trim()) {
      alert("Please add some content before downloading");
      return;
    }

    setIsDownloading(true);
    
    try {
      // Wait for any pending renders
      await new Promise(resolve => setTimeout(resolve, 100));

      const element = pdfPreviewRef.current;
      if (!element) {
        throw new Error("Preview element not found");
      }

      // Calculate dimensions
      const padding = 40;
      const a4Width = 794; // A4 width in pixels at 96 DPI
      const a4Height = 1123; // A4 height in pixels at 96 DPI

      // Create high-quality canvas
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: a4Width,
        windowWidth: a4Width,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-pdf-content]');
          if (clonedElement) {
            clonedElement.style.width = `${a4Width - (padding * 2)}px`;
            clonedElement.style.padding = `${padding}px`;
            clonedElement.style.boxSizing = 'border-box';
          }
        }
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [a4Width, a4Height],
        compress: true,
        hotfixes: ["px_scaling"]
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Add subsequent pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const timestamp = new Date().toISOString().slice(0, 10);
      pdf.save(`markdown-export-${timestamp}.pdf`);
      
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Failed to generate PDF. Please try again or contact support.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("Failed to copy to clipboard");
    }
  };

  const handleDownloadMarkdown = () => {
    if (!markdown.trim()) {
      alert("Please add some content before downloading");
      return;
    }

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const timestamp = new Date().toISOString().slice(0, 10);
    a.download = `markdown-${timestamp}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all content? This action cannot be undone.")) {
      setMarkdown("");
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-950 p-4 sm:p-6 overflow-auto' : 'min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-4 sm:p-6'}`}>
      <div className="max-w-[1800px] mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex-1">
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{wordCount} words</span>
              <span>•</span>
              <span>{charCount} characters</span>
              <span>•</span>
              <span>{lineCount} lines</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-2"
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Show'}</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleFullscreen}
              className="gap-2"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Full'}</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              <span className="hidden sm:inline">{isCopied ? "Copied!" : "Copy"}</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownloadMarkdown}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">.md</span>
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleClear}
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
            <Button 
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export PDF</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Editor and Preview */}
        <div className={`grid ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-4`}>
          {/* Editor */}
          <Card className="shadow-md border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Markdown Input</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <Textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className="min-h-[calc(100vh-280px)] max-h-[calc(100vh-280px)] text-sm sm:text-base font-mono resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 p-4 sm:p-6"
                  placeholder="# Start writing your markdown here...&#10;&#10;## Subheading&#10;&#10;Your content goes here..."
                  spellCheck="false"
                  style={{
                    lineHeight: '1.6',
                    tabSize: '2'
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {showPreview && (
            <Card className="shadow-md border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div
                  ref={previewRef}
                  className="min-h-[calc(100vh-280px)] max-h-[calc(100vh-280px)] overflow-y-auto bg-white dark:bg-gray-900 p-4 sm:p-6"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e0 transparent'
                  }}
                >
                  <div
                    data-pdf-content
                    ref={pdfPreviewRef}
                    className="prose prose-sm sm:prose-base dark:prose-invert max-w-none"
                    style={{
                      lineHeight: '1.8',
                      fontSize: '15px'
                    }}
                  >
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({node, ...props}) => <h1 style={{marginTop: '2em', marginBottom: '0.75em', lineHeight: '1.3'}} {...props} />,
                        h2: ({node, ...props}) => <h2 style={{marginTop: '1.75em', marginBottom: '0.75em', lineHeight: '1.3'}} {...props} />,
                        h3: ({node, ...props}) => <h3 style={{marginTop: '1.5em', marginBottom: '0.5em', lineHeight: '1.3'}} {...props} />,
                        p: ({node, ...props}) => <p style={{marginTop: '1em', marginBottom: '1em', lineHeight: '1.8'}} {...props} />,
                        ul: ({node, ...props}) => <ul style={{marginTop: '1em', marginBottom: '1em', lineHeight: '1.7'}} {...props} />,
                        ol: ({node, ...props}) => <ol style={{marginTop: '1em', marginBottom: '1em', lineHeight: '1.7'}} {...props} />,
                        li: ({node, ...props}) => <li style={{marginTop: '0.5em', marginBottom: '0.5em'}} {...props} />,
                        blockquote: ({node, ...props}) => <blockquote style={{marginTop: '1.5em', marginBottom: '1.5em', paddingLeft: '1em', borderLeftWidth: '4px'}} {...props} />,
                        code: ({node, inline, ...props}) => inline ? 
                          <code style={{padding: '0.2em 0.4em', fontSize: '0.9em'}} {...props} /> : 
                          <code style={{padding: '1em', fontSize: '0.9em', display: 'block', lineHeight: '1.6'}} {...props} />,
                        pre: ({node, ...props}) => <pre style={{marginTop: '1.5em', marginBottom: '1.5em', padding: '1em', borderRadius: '0.375rem'}} {...props} />,
                        table: ({node, ...props}) => <table style={{marginTop: '1.5em', marginBottom: '1.5em', width: '100%'}} {...props} />,
                        hr: ({node, ...props}) => <hr style={{marginTop: '2em', marginBottom: '2em'}} {...props} />,
                      }}
                    >
                      {markdown || "*No content to preview*"}
                    </ReactMarkdown>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Reference */}
        <Card className="shadow-sm border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs sm:text-sm">
              <div className="space-y-1">
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded block"># H1</code>
                <p className="text-gray-600 dark:text-gray-400">Heading 1</p>
              </div>
              <div className="space-y-1">
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded block">## H2</code>
                <p className="text-gray-600 dark:text-gray-400">Heading 2</p>
              </div>
              <div className="space-y-1">
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded block">**bold**</code>
                <p className="text-gray-600 dark:text-gray-400">Bold text</p>
              </div>
              <div className="space-y-1">
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded block">*italic*</code>
                <p className="text-gray-600 dark:text-gray-400">Italic text</p>
              </div>
              <div className="space-y-1">
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded block">- item</code>
                <p className="text-gray-600 dark:text-gray-400">List item</p>
              </div>
              <div className="space-y-1">
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded block">`code`</code>
                <p className="text-gray-600 dark:text-gray-400">Inline code</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarkdownEditor;