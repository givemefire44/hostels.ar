import React from "react";
import { useEditor, EditorContent, NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import ImageGallery from "./ImageGalleryExtension";

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

  const addGallery = () => {
    editor.chain().focus().setImageGallery().run();
  };

  return (
    <div style={{ marginBottom: 8 }}>
      <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()}>
        <b>B</b>
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()}>
        <i>I</i>
      </button>
      <button onClick={() => editor.chain().focus().setParagraph().run()}>Párrafo</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button onClick={addImage}>Imagen</button>
      <button onClick={addGallery}>📸 Galería</button>
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
      ImageGallery,
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
