import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";

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
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      })
    ],
    content: value || "<p>¡Escribe tu contenido aquí!</p>",
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} style={{ border: "1px solid #ccc", minHeight: 200, padding: 12 }} />
    </div>
  );
}
