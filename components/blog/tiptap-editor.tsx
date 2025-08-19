'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Bold,
  Italic,
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
  Link as LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  Upload,
  Palette,
  Type,
  Highlighter,
  Underline as UnderlineIcon,
} from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

export default function TiptapEditor({
  content,
  onChange,
  placeholder = 'Commencez à écrire...',
  className = '',
  editable = true,
}: TiptapEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-200',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      Underline,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300 my-4',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border border-gray-300',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 bg-gray-100 font-bold p-2',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-2',
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!editor || acceptedFiles.length === 0) return;

    setIsUploading(true);
    
    try {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', 'editor');

      const response = await fetch('/api/articles/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      if (result.success) {
        editor.chain().focus().setImage({ src: result.data.url }).run();
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // You might want to show a toast notification here
    } finally {
      setIsUploading(false);
    }
  }, [editor]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
  });

  const addLink = () => {
    if (linkUrl) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
  };

  const addImage = () => {
    const url = window.prompt('URL de l\'image:');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const colors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF',
    '#EF4444', '#F97316', '#F59E0B', '#EAB308',
    '#22C55E', '#10B981', '#06B6D4', '#0EA5E9',
    '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7',
    '#EC4899', '#F43F5E',
  ];

  if (!editor) {
    return <div className="h-64 bg-gray-50 animate-pulse rounded-lg" />;
  }

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      
      {/* Toolbar */}
      {editable && (
        <div className="bg-gray-50 border-b border-gray-300 p-3">
          <div className="flex flex-wrap items-center gap-1">
            
            {/* Text formatting */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor.isActive('bold') ? 'bg-gray-200' : ''
                }`}
                title="Gras"
              >
                <Bold className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor.isActive('italic') ? 'bg-gray-200' : ''
                }`}
                title="Italique"
              >
                <Italic className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor.isActive('underline') ? 'bg-gray-200' : ''
                }`}
                title="Souligné"
              >
                <UnderlineIcon className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor.isActive('strike') ? 'bg-gray-200' : ''
                }`}
                title="Barré"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor.isActive('highlight') ? 'bg-gray-200' : ''
                }`}
                title="Surligner"
              >
                <Highlighter className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor.isActive('code') ? 'bg-gray-200' : ''
                }`}
                title="Code"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>

            {/* Headings */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
                }`}
                title="Titre 1"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
                }`}
                title="Titre 2"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''
                }`}
                title="Titre 3"
              >
                <Heading3 className="w-4 h-4" />
              </button>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor.isActive('bulletList') ? 'bg-gray-200' : ''
                }`}
                title="Liste à puces"
              >
                <List className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor.isActive('orderedList') ? 'bg-gray-200' : ''
                }`}
                title="Liste numérotée"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor.isActive('blockquote') ? 'bg-gray-200' : ''
                }`}
                title="Citation"
              >
                <Quote className="w-4 h-4" />
              </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
              <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
                }`}
                title="Aligner à gauche"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
                }`}
                title="Centrer"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
                }`}
                title="Aligner à droite"
              >
                <AlignRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''
                }`}
                title="Justifier"
              >
                <AlignJustify className="w-4 h-4" />
              </button>
            </div>

            {/* Media */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
              <div className="relative">
                <button
                  onClick={() => setShowLinkDialog(!showLinkDialog)}
                  className={`p-2 rounded hover:bg-gray-200 ${
                    editor.isActive('link') ? 'bg-gray-200' : ''
                  }`}
                  title="Lien"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                
                {showLinkDialog && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg p-3 shadow-lg z-10 w-64">
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && addLink()}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={addLink}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Ajouter
                      </button>
                      <button
                        onClick={removeLink}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                      >
                        Supprimer
                      </button>
                      <button
                        onClick={() => setShowLinkDialog(false)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={addImage}
                className="p-2 rounded hover:bg-gray-200"
                title="Image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              
              <button
                onClick={insertTable}
                className="p-2 rounded hover:bg-gray-200"
                title="Tableau"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Color picker */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 rounded hover:bg-gray-200"
                  title="Couleur du texte"
                >
                  <Palette className="w-4 h-4" />
                </button>
                
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg p-3 shadow-lg z-10">
                    <div className="grid grid-cols-6 gap-1">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            editor.chain().focus().setColor(color).run();
                            setShowColorPicker(false);
                          }}
                          className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        editor.chain().focus().unsetColor().run();
                        setShowColorPicker(false);
                      }}
                      className="mt-2 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 w-full"
                    >
                      Réinitialiser
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Undo/Redo */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Annuler"
              >
                <Undo className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refaire"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor content */}
      <div 
        className="relative min-h-[300px]"
        {...(editable ? getRootProps() : {})}
      >
        {editable && <input {...getInputProps()} />}
        
        {isDragActive && (
          <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-300 rounded flex items-center justify-center z-10">
            <div className="text-center">
              <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-blue-700 font-medium">Déposez votre image ici</p>
            </div>
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-gray-700">Upload en cours...</p>
            </div>
          </div>
        )}
        
        <EditorContent 
          editor={editor} 
          className={editable ? 'min-h-[300px]' : ''}
        />
        
        {!content && editable && (
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(showLinkDialog || showColorPicker) && (
        <div
          className="fixed inset-0 z-[5]"
          onClick={() => {
            setShowLinkDialog(false);
            setShowColorPicker(false);
          }}
        />
      )}
    </div>
  );
}