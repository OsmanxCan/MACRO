"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import Placeholder from "@tiptap/extension-placeholder"
import { Table } from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import Heading from "@tiptap/extension-heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  ImageIcon,
  Table as TableIcon,
  Palette,
  Minus,
} from "lucide-react"
import { useEffect, useState } from "react"

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false, // Özel heading kullanacağız
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: 'editor-heading',
        },
      }),
      Underline,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: "İçeriğinizi buraya yazın...",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full my-4",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border border-gray-300",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-gray-300 bg-gray-100 font-bold p-2",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-300 p-2",
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[400px] p-6 bg-white dark:bg-gray-900",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl("")
    }
  }

  const removeLink = () => {
    editor.chain().focus().unsetLink().run()
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl("")
    }
  }

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const colors = [
    "#000000", "#374151", "#6B7280", "#EF4444", "#F59E0B",
    "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899",
  ]

  return (
    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
      {/* Toolbar - Sticky */}
      <div className="sticky top-0 z-10 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3">
        <div className="flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <Button
              type="button"
              variant={editor.isActive("bold") ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant={editor.isActive("italic") ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant={editor.isActive("underline") ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              title="Underline (Ctrl+U)"
            >
              <UnderlineIcon className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant={editor.isActive("strike") ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant={editor.isActive("code") ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleCode().run()}
              title="Code"
            >
              <Code className="w-4 h-4" />
            </Button>
          </div>

          {/* Headings */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <Button
              type="button"
              variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </Button>
          </div>

          {/* Lists */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <Button
              type="button"
              variant={editor.isActive("bulletList") ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant={editor.isActive("orderedList") ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant={editor.isActive("blockquote") ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </Button>
          </div>

          {/* Alignment */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <Button
              type="button"
              variant={editor.isActive({ textAlign: "left" }) ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant={editor.isActive({ textAlign: "center" }) ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant={editor.isActive({ textAlign: "right" }) ? "default" : "ghost"}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Color Picker */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="sm" title="Text Color">
                  <Palette className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-8 h-8 rounded border-2 border-gray-300 hover:scale-110 transition"
                      style={{ backgroundColor: color }}
                      onClick={() => editor.chain().focus().setColor(color).run()}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => editor.chain().focus().unsetColor().run()}
                >
                  Reset Color
                </Button>
              </PopoverContent>
            </Popover>
          </div>

          {/* Link */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant={editor.isActive("link") ? "default" : "ghost"}
                  size="sm"
                  title="Add Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addLink()}
                  />
                  <div className="flex gap-2">
                    <Button type="button" size="sm" onClick={addLink} className="flex-1">
                      Ekle
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={removeLink}
                      className="flex-1"
                    >
                      Kaldır
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Image */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="sm" title="Add Image">
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <Label>Resim URL</Label>
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addImage()}
                  />
                  <Button type="button" size="sm" onClick={addImage} className="w-full">
                    Resim Ekle
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Table */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addTable}
              title="Insert Table"
            >
              <TableIcon className="w-4 h-4" />
            </Button>
          </div>

          {/* Horizontal Rule */}
          <div className="flex gap-1 border-r pr-2 mr-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Horizontal Line"
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>

          {/* Undo/Redo */}
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  )
}