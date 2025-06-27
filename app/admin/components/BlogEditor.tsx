import React from "react";
import { useEditor, EditorContent, NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";

// Imagen con controles (Eliminar/Reemplazar/Alinear)
const ImageWithControls = (props: any) => {
  const { node, updateAttributes, deleteNode } = props;

  const handleReplace = () => {
    const url = window.prompt("Nueva URL de la imagen", node.attrs.src);
    if (url) {
      updateAttributes({ src: url });
    }
  };

  const handleAlign = (alignment: 'left' | 'center' | 'right') => {
    updateAttributes({ align: alignment });
  };

  // Get current alignment, default to 'left'
  const currentAlign = node.attrs.align || 'left';

  return (
    <NodeViewWrapper 
      as="span" 
      style={{ display: "block", position: "relative" }}
      className={`image-wrapper image-align-${currentAlign}`}
    >
      <img
        src={node.attrs.src}
        alt=""
        style={{
          maxWidth: 400,
          maxHeight: 300,
          borderRadius: 8,
          display: "block",
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
        {/* Alignment buttons */}
        <button
          type="button"
          onClick={() => handleAlign('left')}
          style={{
            color: currentAlign === 'left' ? "#fff700" : "#fff",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
          }}
          title="Alinear a la izquierda"
        >
          ⬅️
        </button>
        <button
          type="button"
          onClick={() => handleAlign('center')}
          style={{
            color: currentAlign === 'center' ? "#fff700" : "#fff",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
          }}
          title="Alinear al centro"
        >
          ⬆️
        </button>
        <button
          type="button"
          onClick={() => handleAlign('right')}
          style={{
            color: currentAlign === 'right' ? "#fff700" : "#fff",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
          }}
          title="Alinear a la derecha"
        >
          ➡️
        </button>
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
        addAttributes() {
          return {
            ...this.parent?.(),
            align: {
              default: 'left',
              renderHTML: attributes => {
                return {
                  'data-align': attributes.align,
                };
              },
              parseHTML: element => {
                return element.getAttribute('data-align') || 'left';
              },
            },
          };
        },
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
      {/* CSS para estilos del editor */}
      <style>{`
        .ProseMirror img {
          max-width: 400px;
          max-height: 300px;
          height: auto;
          width: auto;
          display: block;
          border-radius: 8px;
        }
        
        /* Clases de alineación para imágenes */
        .image-wrapper.image-align-left img {
          margin: 16px 16px 16px 0;
        }
        
        .image-wrapper.image-align-center img {
          margin: 16px auto;
        }
        
        .image-wrapper.image-align-right img {
          margin: 16px 0 16px 16px;
          margin-left: auto;
        }
        
        .image-wrapper.image-align-right {
          text-align: right;
        }
        
        .image-wrapper.image-align-center {
          text-align: center;
        }
        
        .image-wrapper.image-align-left {
          text-align: left;
        }
      `}</style>
    </div>
  );
}
