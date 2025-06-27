import React, { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent, NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Heading from "@tiptap/extension-heading";

// Imagen con controles (Eliminar/Reemplazar)
const ImageWithControls = (props: any) => {
  const { node, updateAttributes, deleteNode } = props;

  const handleReplace = () => {
    const url = window.prompt("Nueva URL de la imagen", node.attrs.src);
    if (url) {
      updateAttributes({ src: url });
    }
  };

  return (
    <NodeViewWrapper as="span" style={{ display: "inline-block", position: "relative" }}>
      <img
        src={node.attrs.src}
        alt=""
        style={{
          maxWidth: 400,
          maxHeight: 300,
          borderRadius: 8,
          display: "block",
          margin: "16px auto"
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          display: "flex",
          gap: 4,
          background: "rgba(0,0,0,0.6)",
          borderRadius: 4,
          padding: "2px 4px",
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={handleReplace}
          style={{
            color: "#fff",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
          }}
          title="Reemplazar imagen"
        >
          🔄
        </button>
        <button
          type="button"
          onClick={deleteNode}
          style={{
            color: "#fff",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
          }}
          title="Eliminar imagen"
        >
          🗑️
        </button>
      </div>
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

const MenuBar = ({ editor }: { editor: any }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const highlightPickerRef = useRef<HTMLDivElement>(null);

  // Click outside handler - always call hooks at the top level
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
      if (highlightPickerRef.current && !highlightPickerRef.current.contains(event.target as Node)) {
        setShowHighlightPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("URL de la imagen");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // Paleta de colores básica
  const textColors = [
    '#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
    '#ff0000', '#ff6600', '#ffcc00', '#00ff00', '#0066ff', '#6600ff',
    '#ff3366', '#ff9900', '#33cc00', '#00ccff', '#9966ff', '#ff6699'
  ];

  const highlightColors = [
    '#ffff00', '#00ff00', '#ff00ff', '#00ffff', '#ff6600', '#6600ff',
    '#ffcccc', '#ccffcc', '#ccccff', '#ffffcc', '#ffccff', '#ccffff'
  ];

  return (
    <div style={{ 
      marginBottom: 8, 
      padding: 8, 
      border: '1px solid #ddd', 
      borderRadius: 6, 
      background: '#fafafa',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      alignItems: 'center'
    }}>
      {/* Formato básico */}
      <button 
        onClick={() => editor.chain().focus().toggleBold().run()} 
        disabled={!editor.can().chain().focus().toggleBold().run()}
        style={{
          fontWeight: editor.isActive('bold') ? 'bold' : 'normal',
          background: editor.isActive('bold') ? '#e0e0e0' : 'white',
          border: '1px solid #ccc',
          borderRadius: 4,
          padding: '4px 8px',
          cursor: 'pointer'
        }}
      >
        <b>B</b>
      </button>
      
      <button 
        onClick={() => editor.chain().focus().toggleItalic().run()} 
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        style={{
          fontStyle: editor.isActive('italic') ? 'italic' : 'normal',
          background: editor.isActive('italic') ? '#e0e0e0' : 'white',
          border: '1px solid #ccc',
          borderRadius: 4,
          padding: '4px 8px',
          cursor: 'pointer'
        }}
      >
        <i>I</i>
      </button>

      <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 4px' }} />

      {/* Tamaños de texto */}
      <select
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'paragraph') {
            editor.chain().focus().setParagraph().run();
          } else if (value === 'h1') {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          } else if (value === 'h2') {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          } else if (value === 'h3') {
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          } else if (value === 'h4') {
            editor.chain().focus().toggleHeading({ level: 4 }).run();
          } else if (value === 'small') {
            editor.chain().focus().setParagraph().run();
            // Aplicar estilo pequeño vía mark personalizado
          } else if (value === 'large') {
            editor.chain().focus().setParagraph().run();
            // Aplicar estilo grande vía mark personalizado  
          }
        }}
        value={
          editor.isActive('heading', { level: 1 }) ? 'h1' :
          editor.isActive('heading', { level: 2 }) ? 'h2' :
          editor.isActive('heading', { level: 3 }) ? 'h3' :
          editor.isActive('heading', { level: 4 }) ? 'h4' :
          'paragraph'
        }
        style={{
          border: '1px solid #ccc',
          borderRadius: 4,
          padding: '4px 8px',
          background: 'white'
        }}
      >
        <option value="paragraph">Párrafo</option>
        <option value="h1">Título 1</option>
        <option value="h2">Título 2</option>
        <option value="h3">Título 3</option>
        <option value="h4">Título 4</option>
      </select>

      <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 4px' }} />

      {/* Color de texto */}
      <div style={{ position: 'relative' }} ref={colorPickerRef}>
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          style={{
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: '4px 8px',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <span style={{ 
            width: 12, 
            height: 12, 
            background: editor.getAttributes('textStyle').color || '#000000',
            border: '1px solid #ccc',
            borderRadius: 2
          }} />
          <span>A</span>
        </button>
        
        {showColorPicker && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 1000,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 4,
            width: 180
          }}>
            {textColors.map(color => (
              <button
                key={color}
                onClick={() => {
                  editor.chain().focus().setColor(color).run();
                  setShowColorPicker(false);
                }}
                style={{
                  width: 20,
                  height: 20,
                  background: color,
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  cursor: 'pointer'
                }}
                title={color}
              />
            ))}
            <input
              type="color"
              onChange={(e) => {
                editor.chain().focus().setColor(e.target.value).run();
                setShowColorPicker(false);
              }}
              style={{
                gridColumn: 'span 6',
                width: '100%',
                height: 24,
                border: '1px solid #ccc',
                borderRadius: 2,
                cursor: 'pointer'
              }}
            />
          </div>
        )}
      </div>

      {/* Color de fondo/resaltado */}
      <div style={{ position: 'relative' }} ref={highlightPickerRef}>
        <button
          onClick={() => setShowHighlightPicker(!showHighlightPicker)}
          style={{
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: '4px 8px',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <span style={{ 
            width: 12, 
            height: 12, 
            background: editor.getAttributes('highlight').color || '#ffff00',
            border: '1px solid #ccc',
            borderRadius: 2
          }} />
          <span>🖍️</span>
        </button>
        
        {showHighlightPicker && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 1000,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 4,
            width: 180
          }}>
            <button
              onClick={() => {
                editor.chain().focus().unsetHighlight().run();
                setShowHighlightPicker(false);
              }}
              style={{
                gridColumn: 'span 6',
                padding: '4px 8px',
                border: '1px solid #ccc',
                borderRadius: 2,
                background: 'white',
                cursor: 'pointer'
              }}
            >
              Sin resaltado
            </button>
            {highlightColors.map(color => (
              <button
                key={color}
                onClick={() => {
                  editor.chain().focus().setHighlight({ color }).run();
                  setShowHighlightPicker(false);
                }}
                style={{
                  width: 20,
                  height: 20,
                  background: color,
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  cursor: 'pointer'
                }}
                title={color}
              />
            ))}
            <input
              type="color"
              onChange={(e) => {
                editor.chain().focus().setHighlight({ color: e.target.value }).run();
                setShowHighlightPicker(false);
              }}
              style={{
                gridColumn: 'span 6',
                width: '100%',
                height: 24,
                border: '1px solid #ccc',
                borderRadius: 2,
                cursor: 'pointer'
              }}
            />
          </div>
        )}
      </div>

      <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 4px' }} />

      {/* Otros controles existentes */}
      <button 
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        style={{
          background: editor.isActive({ textAlign: 'left' }) ? '#e0e0e0' : 'white',
          border: '1px solid #ccc',
          borderRadius: 4,
          padding: '4px 8px',
          cursor: 'pointer'
        }}
      >
        Izq
      </button>
      <button 
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        style={{
          background: editor.isActive({ textAlign: 'center' }) ? '#e0e0e0' : 'white',
          border: '1px solid #ccc',
          borderRadius: 4,
          padding: '4px 8px',
          cursor: 'pointer'
        }}
      >
        Centro
      </button>
      <button 
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        style={{
          background: editor.isActive({ textAlign: 'right' }) ? '#e0e0e0' : 'white',
          border: '1px solid #ccc',
          borderRadius: 4,
          padding: '4px 8px',
          cursor: 'pointer'
        }}
      >
        Der
      </button>
      
      <button 
        onClick={addImage}
        style={{
          border: '1px solid #ccc',
          borderRadius: 4,
          padding: '4px 8px',
          background: 'white',
          cursor: 'pointer'
        }}
      >
        Imagen
      </button>
    </div>
  );
};

export default function BlogEditor({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (content: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.extend({
        addNodeView() {
          return ReactNodeViewRenderer(ImageWithControls);
        }
      }),
    ],
    content: value || "<p>¡Escribe tu contenido aquí!</p>",
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        style={{ border: "1px solid #ccc", minHeight: 200, padding: 12 }}
      />
      {/* CSS para limitar imágenes en el editor */}
      <style>{`
        .ProseMirror img {
          max-width: 400px;
          max-height: 300px;
          height: auto;
          width: auto;
          display: block;
          margin: 16px auto;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
