import React, { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, List, ListOrdered, Link, Image, Code,
  Heading1, Heading2, Heading3, Quote, Undo, Redo, Download,
  Eye, EyeOff, FileText, Copy, RefreshCcw, Maximize2, Minimize2,
  Loader2, Palette, Highlighter, Type
} from "lucide-react";

const RichTextEditor = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled Blog Post");
  const [author, setAuthor] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readTime, setReadTime] = useState(0);
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const pdfPreviewRef = useRef(null);

  useEffect(() => {
    const defaultContent = `<h2>Welcome to Your Rich Text Editor</h2><p>This is a professional blog post editor with real-time preview and PDF export capabilities.</p><h3>Key Features:</h3><ul><li>Full formatting controls (bold, italic, underline, etc.)</li><li>Multiple heading levels</li><li>Lists (ordered and unordered)</li><li>Text alignment options</li><li>Link and image insertion</li><li>Code blocks and quotes</li><li>Real-time word count and reading time</li><li>High-quality PDF export</li></ul><h3>Getting Started</h3><p>Start writing your blog post using the toolbar above. You can format text, add headings, insert links and images, and much more.</p><blockquote>Pro tip: Use keyboard shortcuts like Ctrl+B for bold and Ctrl+I for italic!</blockquote><p>Your content is automatically saved and you can export it as PDF anytime.</p><h3>Code Example</h3><pre><code>function greet(name) {
  return \`Hello, \${name}!\`;
}</code></pre><p><strong>Happy writing!</strong> 🚀</p>`;
    
    if (editorRef.current) {
      editorRef.current.innerHTML = defaultContent;
      setContent(defaultContent);
      calculateStats(defaultContent);
    }
  }, []);

  const calculateStats = (html) => {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const readingTime = Math.ceil(words / 200); // Average reading speed: 200 words/min
    
    setWordCount(words);
    setCharCount(chars);
    setReadTime(readingTime);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setContent(html);
      calculateStats(html);
    }
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      executeCommand("insertImage", url);
    }
  };

  const changeTextColor = () => {
    const color = prompt("Enter color (e.g., #FF0000 or red):");
    if (color) {
      executeCommand("foreColor", color);
    }
  };

  const changeBackgroundColor = () => {
    const color = prompt("Enter background color:");
    if (color) {
      executeCommand("hiliteColor", color);
    }
  };

  const changeFontSize = () => {
    const size = prompt("Enter font size (1-7):", "3");
    if (size && size >= 1 && size <= 7) {
      executeCommand("fontSize", size);
    }
  };

  const handleDownloadPdf = async () => {
    if (!content.trim()) {
      alert("Please add some content before downloading");
      return;
    }

    setIsDownloading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const element = pdfPreviewRef.current;
      if (!element) throw new Error("Preview element not found");

      const padding = 60;
      const a4Width = 794;
      const a4Height = 1123;

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
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      pdf.save(`${filename}-${timestamp}.pdf`);
      
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadHTML = () => {
    if (!content.trim()) {
      alert("Please add some content before downloading");
      return;
    }

    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      line-height: 1.8;
      color: #333;
    }
    h1 { font-size: 2.5em; margin-bottom: 0.5em; }
    h2 { font-size: 2em; margin-top: 1.5em; margin-bottom: 0.5em; }
    h3 { font-size: 1.5em; margin-top: 1.25em; margin-bottom: 0.5em; }
    p { margin: 1em 0; }
    blockquote {
      border-left: 4px solid #e5e7eb;
      padding-left: 1em;
      margin: 1.5em 0;
      color: #6b7280;
    }
    pre {
      background: #f3f4f6;
      padding: 1em;
      border-radius: 0.375rem;
      overflow-x: auto;
    }
    code {
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 0.9em;
    }
    img { max-width: 100%; height: auto; }
    .metadata {
      color: #6b7280;
      font-size: 0.9em;
      margin-bottom: 2em;
      padding-bottom: 1em;
      border-bottom: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <article>
    <h1>${title}</h1>
    ${author ? `<div class="metadata">By ${author}</div>` : ''}
    ${content}
  </article>
</body>
</html>`;

    const blob = new Blob([fullHTML], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    a.download = `${filename}-${timestamp}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      alert("Content copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all content? This action cannot be undone.")) {
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
        setContent("");
        setWordCount(0);
        setCharCount(0);
        setReadTime(0);
      }
    }
  };

  const ToolbarButton = ({ icon: Icon, onClick, title, active = false }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      title={title}
      className={`h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 ${active ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-950 p-4 sm:p-6 overflow-auto' : 'min-h-screen  dark:from-gray-950 dark:to-gray-900 p-4 sm:p-6'}`}>
      <div className="max-w-[1800px] mx-auto space-y-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1 w-full lg:w-auto">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl sm:text-2xl font-bold border-0 focus-visible:ring-0 px-2"
                  placeholder="Enter blog title..."
                />
              </div>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="text-sm border-0 focus-visible:ring-0 px-2 text-gray-600 dark:text-gray-400"
                placeholder="Author name (optional)"
              />
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-2">
                <span className="font-medium">{wordCount} words</span>
                <span>•</span>
                <span>{charCount} characters</span>
                <span>•</span>
                <span>{readTime} min read</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)} className="gap-2">
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Show'}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)} className="gap-2">
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Full'}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copy</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadHTML} className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">.html</span>
              </Button>
              <Button variant="secondary" size="sm" onClick={handleClear} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
              <Button size="sm" onClick={handleDownloadPdf} disabled={isDownloading} className="gap-2 bg-blue-600 hover:bg-blue-700">
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
        </div>

        {/* Toolbar */}
        <Card className="shadow-sm border-gray-200 dark:border-gray-800">
          <CardContent className="p-3">
            <div className="flex flex-wrap gap-1">
              <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
                <ToolbarButton icon={Undo} onClick={() => executeCommand('undo')} title="Undo" />
                <ToolbarButton icon={Redo} onClick={() => executeCommand('redo')} title="Redo" />
              </div>
              
              <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 px-2">
                <ToolbarButton icon={Heading1} onClick={() => executeCommand('formatBlock', '<h2>')} title="Heading 1" />
                <ToolbarButton icon={Heading2} onClick={() => executeCommand('formatBlock', '<h3>')} title="Heading 2" />
                <ToolbarButton icon={Heading3} onClick={() => executeCommand('formatBlock', '<h4>')} title="Heading 3" />
              </div>

              <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 px-2">
                <ToolbarButton icon={Bold} onClick={() => executeCommand('bold')} title="Bold (Ctrl+B)" />
                <ToolbarButton icon={Italic} onClick={() => executeCommand('italic')} title="Italic (Ctrl+I)" />
                <ToolbarButton icon={Underline} onClick={() => executeCommand('underline')} title="Underline (Ctrl+U)" />
                <ToolbarButton icon={Strikethrough} onClick={() => executeCommand('strikeThrough')} title="Strikethrough" />
              </div>

              <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 px-2">
                <ToolbarButton icon={AlignLeft} onClick={() => executeCommand('justifyLeft')} title="Align Left" />
                <ToolbarButton icon={AlignCenter} onClick={() => executeCommand('justifyCenter')} title="Align Center" />
                <ToolbarButton icon={AlignRight} onClick={() => executeCommand('justifyRight')} title="Align Right" />
                <ToolbarButton icon={AlignJustify} onClick={() => executeCommand('justifyFull')} title="Justify" />
              </div>

              <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 px-2">
                <ToolbarButton icon={List} onClick={() => executeCommand('insertUnorderedList')} title="Bullet List" />
                <ToolbarButton icon={ListOrdered} onClick={() => executeCommand('insertOrderedList')} title="Numbered List" />
              </div>

              <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 px-2">
                <ToolbarButton icon={Quote} onClick={() => executeCommand('formatBlock', '<blockquote>')} title="Quote" />
                <ToolbarButton icon={Code} onClick={() => executeCommand('formatBlock', '<pre>')} title="Code Block" />
              </div>

              <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 px-2">
                <ToolbarButton icon={Link} onClick={insertLink} title="Insert Link" />
                <ToolbarButton icon={Image} onClick={insertImage} title="Insert Image" />
              </div>

              <div className="flex gap-1 px-2">
                <ToolbarButton icon={Palette} onClick={changeTextColor} title="Text Color" />
                <ToolbarButton icon={Highlighter} onClick={changeBackgroundColor} title="Background Color" />
                <ToolbarButton icon={Type} onClick={changeFontSize} title="Font Size" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editor and Preview */}
        <div className={`grid ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-4`}>
          {/* Editor */}
          <Card className="shadow-md border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Editor</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="min-h-[calc(100vh-420px)] max-h-[calc(100vh-420px)] overflow-y-auto p-4 sm:p-6 focus:outline-none prose prose-sm sm:prose-base dark:prose-invert max-w-none"
                style={{
                  lineHeight: '1.8',
                  fontSize: '15px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e0 transparent'
                }}
              />
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
                  className="min-h-[calc(100vh-420px)] max-h-[calc(100vh-420px)] overflow-y-auto bg-white dark:bg-gray-900 p-4 sm:p-6"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e0 transparent'
                  }}
                >
                  <div
                    data-pdf-content
                    ref={pdfPreviewRef}
                    className="prose prose-sm sm:prose-base dark:prose-invert max-w-none"
                  >
                    {title && <h1 style={{ marginBottom: '0.5em' }}>{title}</h1>}
                    {author && (
                      <div style={{ 
                        color: '#6b7280', 
                        fontSize: '0.9em', 
                        marginBottom: '2em',
                        paddingBottom: '1em',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        By {author}
                      </div>
                    )}
                    <div dangerouslySetInnerHTML={{ __html: content || '<p style="color: #9ca3af;"><em>Start typing to see your content here...</em></p>' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;