import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

export default function ImageWithControls({ node, updateAttributes, deleteNode }: any) {
  const handleReplace = () => {
    const url = prompt('Nueva URL de la imagen');
    if (url) {
      updateAttributes({ src: url });
    }
  };

  return (
    <NodeViewWrapper className="image-with-controls" style={{ position: 'relative', display: 'inline-block' }}>
      <img src={node.attrs.src} alt="" style={{ maxWidth: 400, maxHeight: 300, borderRadius: 8 }} />
      <div style={{
        position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4,
        background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: '2px 4px',
        zIndex: 10
      }}>
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
