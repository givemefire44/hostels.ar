import React from "react";
import { useEditor, EditorContent, NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";

/**
 * BlogEditor - Editor visual para posts con soporte completo de listas
 * 
 * Funcionalidades de lista:
 * - Listas desordenadas (viñetas): Botón "• Lista"
 * - Listas ordenadas (numeradas): Botón "1. Lista" 
 * - Toggle automático entre lista y párrafo normal
 * - Soporte para múltiples elementos en listas
 * - Estilos CSS específicos para .ProseMirror en globals.css
 * 
 * Futuras mejoras potenciales:
 * - Listas de tareas con checkboxes
 * - Sublistas anidadas con diferentes niveles
 * - Shortcuts de teclado para crear listas
 */

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
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("URL de la imagen");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: 4,
      marginBottom: 8,
      padding: 6,
      background: "#fafafa",
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }}>
      <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()}>
        <b>B</b>
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()}>
        <i>I</i>
      </button>
      <button onClick={() => editor.chain().focus().setParagraph().run()}>Párrafo</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      {/* Lista desordenada (viñetas) - Toggle entre lista y texto normal */}
      <button 
        onClick={() => editor.chain().focus().toggleBulletList().run()} 
        style={{ fontWeight: editor.isActive('bulletList') ? "bold" : "normal" }}
        title="Crear lista con viñetas"
      >
        • Lista
      </button>
      {/* Lista ordenada (numerada) - Toggle entre lista y texto normal */}
      <button 
        onClick={() => editor.chain().focus().toggleOrderedList().run()} 
        style={{ fontWeight: editor.isActive('orderedList') ? "bold" : "normal" }}
        title="Crear lista numerada"
      >
        1. Lista
      </button>
      <button onClick={addImage}>Imagen</button>
      <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>Izq</button>
      <button onClick={() => editor.chain().focus().setTextAlign("center").run()}>Centro</button>
      <button onClick={() => editor.chain().focus().setTextAlign("right").run()}>Der</button>
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
