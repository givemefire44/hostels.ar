import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

export default function ImageWithControls({ node, updateAttributes, deleteNode }: any) {
  const handleReplace = () => {
    const url = prompt('Nueva URL de la imagen');
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
      className={`image-with-controls image-wrapper image-align-${currentAlign}`} 
      style={{ position: 'relative', display: 'block' }}
    >
      <img 
        src={node.attrs.src} 
        alt="" 
        style={{ 
          maxWidth: 400, 
          maxHeight: 300, 
          borderRadius: 8,
          display: 'block'
        }} 
      />
      <div style={{
        position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4,
        background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: '2px 4px',
        zIndex: 10
      }}>
        {/* Alignment buttons */}
        <button
          type="button"
          onClick={() => handleAlign('left')}
          style={{
            color: currentAlign === 'left' ? "#fff700" : "#fff",
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14
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
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14
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
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14
          }}
          title="Alinear a la derecha"
        >
          ➡️
        </button>
        <button type="button" onClick={handleReplace}
          style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}
          title="Reemplazar imagen">🔄</button>
        <button type="button" onClick={deleteNode}
          style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}
          title="Eliminar imagen">🗑️</button>
      </div>
      <NodeViewContent />
    </NodeViewWrapper>
  );
}
