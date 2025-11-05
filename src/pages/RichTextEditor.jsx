import React, { useState, useRef, useEffect, useCallback } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, List, ListOrdered, Link, Image, Code,
  Heading1, Heading2, Heading3, Quote, Undo, Redo, Download,
  Eye, EyeOff, FileText, Copy, RefreshCcw, Maximize2, Minimize2,
  Loader2, Palette, Highlighter, Type, Table, Minus, Smile,
  Save, FolderOpen, Sun, Moon, Trash2, Plus
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const pdfPreviewRef = useRef(null);
  const fileInputRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  const SAVE_KEY = "rich-blog-draft-v3";

  // Load draft
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const { title, author, content, timestamp } = JSON.parse(saved);
        setTitle(title || "Untitled Blog Post");
        setAuthor(author || "");
        if (editorRef.current && content) {
          editorRef.current.innerHTML = content;
          setContent(content);
          calculateStats(content);
          setLastSaved(new Date(timestamp).toLocaleTimeString());
        }
      } catch (e) { console.warn(e); }
    }

    if (!saved || !editorRef.current?.innerHTML.trim()) {
      const defaultContent = `<h2>Welcome to Your Blog Editor</h2><p>Start writing your <strong>amazing article</strong> here.</p><ul><li>Full formatting</li><li>Image upload</li><li>Table support</li><li>Auto-save</li></ul><blockquote>Write once, publish everywhere.</blockquote><p>Happy writing! <span style="font-size: 1.5em;">sparkles</span></p>`;
      if (editorRef.current) {
        editorRef.current.innerHTML = defaultContent;
        setContent(defaultContent);
        calculateStats(defaultContent);
      }
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(media.matches);
    const handler = (e) => setIsDarkMode(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  // Auto-save
  useEffect(() => {
    if (!content || content === "<br>") return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setIsTyping(true);
    saveTimeoutRef.current = setTimeout(() => {
      const draft = { title, author, content, timestamp: new Date().toISOString() };
      localStorage.setItem(SAVE_KEY, JSON.stringify(draft));
      setLastSaved(new Date().toLocaleTimeString());
      setIsTyping(false);
    }, 3000);
    return () => clearTimeout(saveTimeoutRef.current);
  }, [content, title, author]);

  const calculateStats = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || "";
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
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

  const exec = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertHTML = (html) => {
    document.execCommand("insertHTML", false, html);
    handleInput();
  };

  const insertLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) exec("createLink", url);
  };

  const insertImageFromFile = (file) => {
    if (!file.type.startsWith("image/")) return alert("Image only");
    const reader = new FileReader();
    reader.onload = (e) => exec("insertImage", e.target.result);
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) insertImageFromFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) insertImageFromFile(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (ev) => exec("insertImage", ev.target.result);
        reader.readAsDataURL(blob);
      }
    }
  };

  const insertTable = () => {
    const rows = prompt("Rows:", "3") || 3;
    const cols = prompt("Columns:", "3") || 3;
    let table = `<table style="width:100%; border-collapse:collapse; margin:1em 0;">`;
    for (let i = 0; i < rows; i++) {
      table += `<tr>`;
      for (let j = 0; j < cols; j++) {
        const tag = i === 0 ? "th" : "td";
        const text = i === 0 ? `Header ${j + 1}` : `Cell`;
        table += `<${tag} style="border:1px solid #ddd; padding:8px; text-align:left;">${text}</${tag}>`;
      }
      table += `</tr>`;
    }
    table += `</table>`;
    insertHTML(table);
  };

  const addRow = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const table = range.commonAncestorContainer;
    const tr = table.closest ? table.closest("tr") : null;
    if (!tr || !tr.closest("table")) return alert("Select a cell in a table");
    const cells = tr.cells.length;
    const newRow = document.createElement("tr");
    for (let i = 0; i < cells; i++) {
      const td = document.createElement("td");
      td.style = "border:1px solid #ddd; padding:8px;";
      td.innerHTML = "&nbsp;";
      newRow.appendChild(td);
    }
    tr.parentNode.insertBefore(newRow, tr.nextSibling);
    handleInput();
  };

  const addColumn = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const cell = range.commonAncestorContainer;
    const td = cell.closest ? cell.closest("td, th") : null;
    if (!td || !td.closest("table")) return alert("Select a cell");
    const table = td.closest("table");
    const index = Array.from(td.parentNode.children).indexOf(td);
    Array.from(table.rows).forEach(row => {
      const newCell = document.createElement(row.cells[0].tagName);
      newCell.style = "border:1px solid #ddd; padding:8px;";
      newCell.innerHTML = "&nbsp;";
      row.insertBefore(newCell, row.cells[index + 1] || null);
    });
    handleInput();
  };

  const removeRow = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const tr = range.commonAncestorContainer.closest("tr");
    if (!tr || !tr.closest("table")) return alert("Select a row");
    if (tr.closest("table").rows.length <= 1) return alert("Cannot remove last row");
    tr.remove();
    handleInput();
  };

  const removeColumn = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const td = range.commonAncestorContainer.closest("td, th");
    if (!td || !td.closest("table")) return alert("Select a column");
    const table = td.closest("table");
    const index = Array.from(td.parentNode.children).indexOf(td);
    if (table.rows[0].cells.length <= 1) return alert("Cannot remove last column");
    Array.from(table.rows).forEach(row => row.deleteCell(index));
    handleInput();
  };

  const insertHR = () => insertHTML("<hr style='margin:2em 0; border:1px solid #e5e7eb;'>");

  const insertEmoji = () => {
    const emoji = prompt("Emoji (e.g., rocket, heart):", "rocket");
    const map = { rocket: "rocket", heart: "red heart", star: "star", fire: "fire", smile: "smiling face" };
    insertHTML(`<span style="font-size:1.5em;">${map[emoji.toLowerCase()] || emoji}</span>`);
  };

  const saveDraft = () => {
    const draft = { title, author, content, timestamp: new Date().toISOString() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(draft));
    setLastSaved(new Date().toLocaleTimeString());
    alert("Saved!");
  };

  const loadDraft = () => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved && window.confirm("Load last draft?")) {
      const { title, author, content } = JSON.parse(saved);
      setTitle(title); setAuthor(author);
      editorRef.current.innerHTML = content;
      setContent(content);
      calculateStats(content);
    }
  };

  const handleDownloadPdf = async () => {
    if (!content.trim()) return alert("Add content");
    setIsDownloading(true);
    try {
      await new Promise(r => setTimeout(r, 200));
      const el = pdfPreviewRef.current;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: 794,
        onclone: (doc) => {
          const content = doc.querySelector('[data-pdf-content]');
          if (content) {
            content.style.width = "674px";
            content.style.padding = "60px";
            content.style.boxSizing = "border-box";
          }
        }
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [794, 1123] });
      const imgWidth = 794;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let pos = 0;
      pdf.addImage(imgData, "PNG", 0, pos, imgWidth, imgHeight);
      heightLeft -= 1123;
      while (heightLeft > 0) {
        pos = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, pos, imgWidth, imgHeight);
        heightLeft -= 1123;
      }
      pdf.save(`${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (e) {
      alert("PDF failed");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadHTML = () => {
    const fullHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.8;color:#333}h1{font-size:2.5em}h2{font-size:2em}h3{font-size:1.5em}blockquote{border-left:4px solid #e5e7eb;padding-left:1em;margin:1.5em 0;color:#6b7280}pre{background:#f3f4f6;padding:1em;border-radius:8px;overflow-x:auto}table{width:100%;border-collapse:collapse;margin:1.5em 0}th,td{border:1px solid #ddd;padding:8px}th{background:#f9fafb}img{max-width:100%;height:auto;border-radius:8px}.meta{color:#6b7280;font-size:0.9em;margin-bottom:2em;padding-bottom:1em;border-bottom:1px solid #e5e7eb}</style></head><body><article><h1>${title}</h1>${author ? `<div class="meta">By ${author}</div>` : ''}${content}</article></body></html>`;
    const blob = new Blob([fullHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().slice(0,10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => alert("Copied!"));
  };

  const handleClear = () => {
    if (window.confirm("Clear all?")) {
      editorRef.current.innerHTML = "";
      setContent("");
      calculateStats("");
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        switch (e.key) {
          case 'b': exec('bold'); break;
          case 'i': exec('italic'); break;
          case 'u': exec('underline'); break;
          case 'z': exec('undo'); break;
          case 'y': exec('redo'); break;
          case 's': saveDraft(); break;
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const ToolbarButton = ({ icon: Icon, onClick, title, active = false }) => (
    <Button variant="ghost" size="sm" onClick={onClick} title={title} className={`h-8 w-8 p-0 ${active ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 p-4 overflow-auto' : 'min-h-screen  p-4 sm:p-6'} `}>
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />

      <div className="max-w-[1800px] mx-auto space-y-4">
        {/* Header */}
        <Card className="shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-xl sm:text-2xl font-bold border-0 focus-visible:ring-0 px-2" placeholder="Title..." />
                </div>
                <Input value={author} onChange={(e) => setAuthor(e.target.value)} className="text-sm border-0 focus-visible:ring-0 px-2 text-gray-600" placeholder="Author" />
                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs sm:text-sm text-gray-600 px-2">
                  <span>{wordCount} words</span><span>•</span>
                  <span>{charCount} chars</span><span>•</span>
                  <span>{readTime} min</span>
                  {lastSaved && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {isTyping ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                        Saved {lastSaved}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="hidden sm:inline ml-1">{showPreview ? 'Hide' : 'Show'}</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  <span className="hidden sm:inline ml-1">{isFullscreen ? 'Exit' : 'Full'}</span>
                </Button>
                <Button variant="outline" size="sm" onClick={saveDraft}><Save className="h-4 w-4" /><span className="hidden sm:inline ml-1">Save</span></Button>
                <Button variant="outline" size="sm" onClick={loadDraft}><FolderOpen className="h-4 w-4" /><span className="hidden sm:inline ml-1">Load</span></Button>
                <Button variant="outline" size="sm" onClick={() => setIsDarkMode(!isDarkMode)}>
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopy}><Copy className="h-4 w-4" /><span className="hidden sm:inline ml-1">Copy</span></Button>
                <Button variant="outline" size="sm" onClick={handleDownloadHTML}><FileText className="h-4 w-4" /><span className="hidden sm:inline ml-1">HTML</span></Button>
                <Button variant="secondary" size="sm" onClick={handleClear}><RefreshCcw className="h-4 w-4" /><span className="hidden sm:inline ml-1">Clear</span></Button>
                <Button size="sm" onClick={handleDownloadPdf} disabled={isDownloading} className="bg-blue-600 hover:bg-blue-700">
                  {isDownloading ? <><Loader2 className="h-4 w-4 animate-spin" /><span className="hidden sm:inline ml-1">PDF...</span></> : <><Download className="h-4 w-4" /><span className="hidden sm:inline ml-1">PDF</span></>}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toolbar */}
        <Card className="shadow-sm">
          <CardContent className="p-3">
            <div className="flex flex-wrap gap-1 items-center">
              {/* Format Block */}
              <Select onValueChange={(v) => exec('formatBlock', v)}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue placeholder="Paragraph" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<p>">Paragraph</SelectItem>
                  <SelectItem value="<h1>">Heading 1</SelectItem>
                  <SelectItem value="<h2>">Heading 2</SelectItem>
                  <SelectItem value="<h3>">Heading 3</SelectItem>
                  <SelectItem value="<blockquote>">Quote</SelectItem>
                  <SelectItem value="<pre>">Code</SelectItem>
                </SelectContent>
              </Select>

              <div className="h-6 w-px bg-gray-300 mx-1" />

              <ToolbarButton icon={Undo} onClick={() => exec('undo')} title="Undo" />
              <ToolbarButton icon={Redo} onClick={() => exec('redo')} title="Redo" />

              <div className="h-6 w-px bg-gray-300 mx-1" />

              <ToolbarButton icon={Bold} onClick={() => exec('bold')} title="Bold" />
              <ToolbarButton icon={Italic} onClick={() => exec('italic')} title="Italic" />
              <ToolbarButton icon={Underline} onClick={() => exec('underline')} title="Underline" />
              <ToolbarButton icon={Strikethrough} onClick={() => exec('strikeThrough')} title="Strike" />

              <div className="h-6 w-px bg-gray-300 mx-1" />

              <ToolbarButton icon={AlignLeft} onClick={() => exec('justifyLeft')} title="Left" />
              <ToolbarButton icon={AlignCenter} onClick={() => exec('justifyCenter')} title="Center" />
              <ToolbarButton icon={AlignRight} onClick={() => exec('justifyRight')} title="Right" />
              <ToolbarButton icon={AlignJustify} onClick={() => exec('justifyFull')} title="Justify" />

              <div className="h-6 w-px bg-gray-300 mx-1" />

              <ToolbarButton icon={List} onClick={() => exec('insertUnorderedList')} title="Bullet" />
              <ToolbarButton icon={ListOrdered} onClick={() => exec('insertOrderedList')} title="Numbered" />

              <div className="h-6 w-px bg-gray-300 mx-1" />

              <ToolbarButton icon={Link} onClick={insertLink} title="Link" />
              <ToolbarButton icon={Image} onClick={() => fileInputRef.current?.click()} title="Image" />
              <ToolbarButton icon={Table} onClick={insertTable} title="Table" />
              <ToolbarButton icon={Plus} onClick={addRow} title="Add Row" />
              <ToolbarButton icon={Trash2} onClick={removeRow} title="Remove Row" />
              <ToolbarButton icon={Plus} onClick={addColumn} title="Add Col" />
              <ToolbarButton icon={Trash2} onClick={removeColumn} title="Remove Col" />
              <ToolbarButton icon={Minus} onClick={insertHR} title="HR" />
              <ToolbarButton icon={Smile} onClick={insertEmoji} title="Emoji" />

              <div className="h-6 w-px bg-gray-300 mx-1" />

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Palette className="h-4 w-4" /></Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <input type="color" onChange={(e) => exec('foreColor', e.target.value)} className="w-10 h-10 cursor-pointer" />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Highlighter className="h-4 w-4" /></Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <input type="color" onChange={(e) => exec('hiliteColor', e.target.value)} className="w-10 h-10 cursor-pointer" />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Type className="h-4 w-4" /></Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <Select onValueChange={(v) => exec('fontSize', v)}>
                    <SelectTrigger className="w-20">Size</SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7].map(s => <SelectItem key={s} value={s.toString()}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Editor + Preview */}
        <div className={`grid ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-4`}>
          <Card className="shadow-md">
            <CardHeader className="pb-3"><CardTitle className="text-lg">Editor</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onDrop={handleDrop}
                onPaste={handlePaste}
                onDragOver={(e) => e.preventDefault()}
                className="min-h-[calc(100vh-420px)] p-6 focus:outline-none prose prose-sm sm:prose-lg dark:prose-invert max-w-none overflow-auto"
                style={{ lineHeight: '1.8', fontSize: '16px' }}
              />
            </CardContent>
          </Card>

          {showPreview && (
            <Card className="shadow-md">
              <CardHeader className="pb-3"><CardTitle className="text-lg">Preview</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div ref={previewRef} className="min-h-[calc(100vh-420px)] overflow-auto bg-white dark:bg-gray-900 p-6">
                  <div data-pdf-content ref={pdfPreviewRef} className="prose prose-sm sm:prose-lg dark:prose-invert max-w-none">
                    {title && <h1>{title}</h1>}
                    {author && <div className="text-gray-600 text-sm mb-6 pb-4 border-b">By {author}</div>}
                    <div dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-500 italic">Start typing...</p>' }} />
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