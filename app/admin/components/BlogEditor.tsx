import React, { useState, useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Block types for the editor
interface Block {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'bulletList' | 'orderedList' | 'blockquote' | 'codeBlock';
  content: string;
  attrs?: Record<string, unknown>;
}

// Sortable Block Component with drag handle and visual indicators
const SortableBlock: React.FC<{
  block: Block;
  onDelete: (id: string) => void;
  children: React.ReactNode;
}> = ({ block, onDelete, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`block-container ${isDragging ? 'dragging' : ''}`}
      {...attributes}
    >
      {/* Drag handle */}
      <div className="block-drag-handle" {...listeners}>
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
          <circle cx="2" cy="2" r="1" fill="#999"/>
          <circle cx="6" cy="2" r="1" fill="#999"/>
          <circle cx="2" cy="6" r="1" fill="#999"/>
          <circle cx="6" cy="6" r="1" fill="#999"/>
          <circle cx="2" cy="10" r="1" fill="#999"/>
          <circle cx="6" cy="10" r="1" fill="#999"/>
        </svg>
      </div>
      
      {/* Block content */}
      <div className="block-content">
        {children}
      </div>

      {/* Block controls */}
      <div className="block-controls">
        <button 
          type="button"
          onClick={() => onDelete(block.id)}
          className="block-delete"
          title="Eliminar bloque"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

// Individual block editor components
const BlockEditor: React.FC<{
  block: Block;
  onUpdate: (content: string) => void;
}> = ({ block, onUpdate }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Allow all necessary nodes but filter content at the UI level
        horizontalRule: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: block.content,
    onUpdate({ editor }) {
      onUpdate(editor.getHTML());
    },
  });

  if (!editor) return null;

  // Render different UI based on block type
  switch (block.type) {
    case 'heading':
      return (
        <div className="block-heading">
          <div className="block-type-label">Encabezado</div>
          <EditorContent editor={editor} />
        </div>
      );
    case 'image':
      return (
        <div className="block-image">
          <div className="block-type-label">Imagen</div>
          <ImageWithControls content={block.content} onUpdate={onUpdate} />
        </div>
      );
    case 'bulletList':
      return (
        <div className="block-list">
          <div className="block-type-label">Lista con viñetas</div>
          <EditorContent editor={editor} />
        </div>
      );
    case 'orderedList':
      return (
        <div className="block-list">
          <div className="block-type-label">Lista numerada</div>
          <EditorContent editor={editor} />
        </div>
      );
    case 'blockquote':
      return (
        <div className="block-quote">
          <div className="block-type-label">Cita</div>
          <EditorContent editor={editor} />
        </div>
      );
    case 'codeBlock':
      return (
        <div className="block-code">
          <div className="block-type-label">Código</div>
          <EditorContent editor={editor} />
        </div>
      );
    default: // paragraph
      return (
        <div className="block-paragraph">
          <div className="block-type-label">Párrafo</div>
          <EditorContent editor={editor} />
        </div>
      );
  }
};
// Updated ImageWithControls for block-based editor
const ImageWithControls: React.FC<{
  content: string;
  onUpdate: (content: string) => void;
}> = ({ content, onUpdate }) => {
  // Extract src from HTML content or use as direct URL
  const getSrcFromContent = (content: string) => {
    const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
    return imgMatch ? imgMatch[1] : content;
  };

  const currentSrc = getSrcFromContent(content);

  const handleReplace = () => {
    const url = window.prompt("Nueva URL de la imagen", currentSrc);
    if (url) {
      onUpdate(`<img src="${url}" alt="" />`);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img
        src={currentSrc}
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
      </div>
    </div>
  );
};

// Block insertion menu
const BlockInsertMenu: React.FC<{
  onInsert: (type: Block['type']) => void;
  show: boolean;
  onClose: () => void;
}> = ({ onInsert, show, onClose }) => {
  if (!show) return null;

  const blockTypes: Array<{ type: Block['type']; label: string; icon: string }> = [
    { type: 'paragraph', label: 'Párrafo', icon: '📝' },
    { type: 'heading', label: 'Encabezado', icon: 'H' },
    { type: 'image', label: 'Imagen', icon: '🖼️' },
    { type: 'bulletList', label: 'Lista con viñetas', icon: '•' },
    { type: 'orderedList', label: 'Lista numerada', icon: '1.' },
    { type: 'blockquote', label: 'Cita', icon: '"' },
    { type: 'codeBlock', label: 'Código', icon: '</>' },
  ];

  return (
    <div className="block-insert-menu">
      <div className="block-insert-header">
        <span>Agregar bloque</span>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="block-insert-options">
        {blockTypes.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => {
              onInsert(type);
              onClose();
            }}
            className="block-insert-option"
          >
            <span className="block-insert-icon">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Main Block-based BlogEditor component
export default function BlogEditor({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (content: string) => void;
}) {
  // Convert HTML content to blocks structure
  const parseContentToBlocks = (htmlContent: string): Block[] => {
    if (!htmlContent || htmlContent === "<p>¡Escribe tu contenido aquí!</p>") {
      return [{
        id: 'block-initial',
        type: 'paragraph',
        content: '<p>¡Escribe tu contenido aquí!</p>'
      }];
    }

    // Basic parsing - in a real implementation, this would be more sophisticated
    const blocks: Block[] = [];
    let blockId = 1;

    // Split by major block elements
    const parts = htmlContent.split(/(<h[1-6][^>]*>.*?<\/h[1-6]>|<img[^>]*>|<ul[^>]*>.*?<\/ul>|<ol[^>]*>.*?<\/ol>|<blockquote[^>]*>.*?<\/blockquote>|<pre[^>]*>.*?<\/pre>)/gs);
    
    parts.forEach(part => {
      if (!part.trim()) return;
      
      if (part.match(/<h[1-6]/)) {
        blocks.push({
          id: `block-heading-${blockId++}`,
          type: 'heading',
          content: part
        });
      } else if (part.match(/<img/)) {
        blocks.push({
          id: `block-image-${blockId++}`,
          type: 'image',
          content: part
        });
      } else if (part.match(/<ul/)) {
        blocks.push({
          id: `block-bullet-${blockId++}`,
          type: 'bulletList',
          content: part
        });
      } else if (part.match(/<ol/)) {
        blocks.push({
          id: `block-ordered-${blockId++}`,
          type: 'orderedList',
          content: part
        });
      } else if (part.match(/<blockquote/)) {
        blocks.push({
          id: `block-quote-${blockId++}`,
          type: 'blockquote',
          content: part
        });
      } else if (part.match(/<pre/)) {
        blocks.push({
          id: `block-code-${blockId++}`,
          type: 'codeBlock',
          content: part
        });
      } else if (part.trim()) {
        // Default to paragraph
        blocks.push({
          id: `block-paragraph-${blockId++}`,
          type: 'paragraph',
          content: part.includes('<p>') ? part : `<p>${part}</p>`
        });
      }
    });

    return blocks.length > 0 ? blocks : [{
      id: 'block-initial',
      type: 'paragraph',
      content: '<p>¡Escribe tu contenido aquí!</p>'
    }];
  };

  // Convert blocks back to HTML
  const blocksToHtml = (blocks: Block[]): string => {
    return blocks.map(block => block.content).join('');
  };

  const [blocks, setBlocks] = useState<Block[]>(() => parseContentToBlocks(value || ""));
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update parent component when blocks change
  useEffect(() => {
    if (isMounted) {
      onChange?.(blocksToHtml(blocks));
    }
  }, [blocks, isMounted, onChange]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = useCallback((event: { active: { id: string }; over: { id: string } }) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  // Update individual block content
  const updateBlock = useCallback((blockId: string, content: string) => {
    setBlocks(currentBlocks => {
      return currentBlocks.map(block =>
        block.id === blockId ? { ...block, content } : block
      );
    });
  }, []);

  // Delete block
  const deleteBlock = useCallback((blockId: string) => {
    setBlocks(currentBlocks => {
      const newBlocks = currentBlocks.filter(block => block.id !== blockId);
      
      // Ensure at least one block exists
      if (newBlocks.length === 0) {
        return [{
          id: 'block-empty',
          type: 'paragraph',
          content: '<p></p>'
        }];
      }
      
      return newBlocks;
    });
  }, []);

  // Insert new block
  const insertBlock = useCallback((type: Block['type']) => {
    const timestamp = Date.now();
    const newBlock: Block = {
      id: `block-${type}-${timestamp}`,
      type,
      content: type === 'image' 
        ? '<img src="" alt="" />' 
        : type === 'heading'
        ? '<h2>Nuevo encabezado</h2>'
        : type === 'bulletList'
        ? '<ul><li>Elemento de lista</li></ul>'
        : type === 'orderedList'
        ? '<ol><li>Elemento de lista</li></ol>'
        : type === 'blockquote'
        ? '<blockquote>Cita</blockquote>'
        : type === 'codeBlock'
        ? '<pre><code>// código</code></pre>'
        : '<p>Nuevo párrafo</p>'
    };

    setBlocks(currentBlocks => [...currentBlocks, newBlock]);
  }, []);

  // Don't render the drag and drop context on server side to avoid hydration issues
  if (!isMounted) {
    return (
      <div className="block-editor">
        <div className="block-editor-toolbar">
          <button
            type="button"
            onClick={() => setShowInsertMenu(true)}
            className="add-block-btn"
          >
            + Agregar bloque
          </button>
        </div>
        <div className="blocks-container">
          {blocks.map((block) => (
            <div key={block.id} className="block-container">
              <div className="block-content">
                <BlockEditor
                  block={block}
                  onUpdate={(content) => updateBlock(block.id, content)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="block-editor">
      {/* Add block button */}
      <div className="block-editor-toolbar">
        <button
          type="button"
          onClick={() => setShowInsertMenu(true)}
          className="add-block-btn"
        >
          + Agregar bloque
        </button>
      </div>

      {/* Block insert menu */}
      <BlockInsertMenu
        show={showInsertMenu}
        onClose={() => setShowInsertMenu(false)}
        onInsert={insertBlock}
      />

      {/* Draggable blocks */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
          <div className="blocks-container">
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                onDelete={deleteBlock}
              >
                <BlockEditor
                  block={block}
                  onUpdate={(content) => updateBlock(block.id, content)}
                />
              </SortableBlock>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
