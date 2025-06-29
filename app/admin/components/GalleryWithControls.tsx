import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

interface GalleryWithControlsProps {
  node: {
    attrs: {
      images: string[];
      columns?: number;
    };
  };
  updateAttributes: (attrs: any) => void;
  deleteNode: () => void;
}

export default function GalleryWithControls({ 
  node, 
  updateAttributes, 
  deleteNode 
}: GalleryWithControlsProps) {
  const { images, columns = 2 } = node.attrs;

  const handleAddImages = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;

      // Import supabase dynamically to avoid SSR issues
      const { supabase } = await import('@/lib/supabaseClient');
      const newImageUrls: string[] = [];

      for (const file of Array.from(files)) {
        try {
          const filePath = `blog/${Date.now()}-${file.name}`;
          const { data, error } = await supabase.storage
            .from('blog-images')
            .upload(filePath, file);
          
          if (error) {
            console.error('Error uploading image:', error);
            alert(`Error al subir ${file.name}: ${error.message}`);
            continue;
          }

          const { data: urlData } = supabase.storage
            .from('blog-images')
            .getPublicUrl(filePath);

          if (urlData?.publicUrl) {
            newImageUrls.push(urlData.publicUrl);
          }
        } catch (error) {
          console.error('Error processing file:', error);
          alert(`Error al procesar ${file.name}`);
        }
      }

      if (newImageUrls.length > 0) {
        updateAttributes({ images: [...images, ...newImageUrls] });
      }
    };
    input.click();
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    updateAttributes({ images: newImages });
  };

  const handleSetColumns = () => {
    const newColumns = window.prompt('Número de columnas (2-4):', columns.toString());
    const parsed = parseInt(newColumns || '2');
    if (parsed >= 2 && parsed <= 4) {
      updateAttributes({ columns: parsed });
    }
  };

  return (
    <NodeViewWrapper className="gallery-with-controls" style={{ margin: '16px 0' }}>
      {/* Gallery Controls */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 8,
        padding: 8,
        background: 'rgba(0,0,0,0.1)',
        borderRadius: 4,
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={handleAddImages}
            style={{
              padding: '4px 8px',
              backgroundColor: '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12
            }}
            title="Agregar imágenes"
          >
            ➕ Añadir imágenes
          </button>
          <button
            type="button"
            onClick={handleSetColumns}
            style={{
              padding: '4px 8px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12
            }}
            title="Cambiar número de columnas"
          >
            📱 {columns} cols
          </button>
        </div>
        <button
          type="button"
          onClick={deleteNode}
          style={{
            padding: '4px 8px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12
          }}
          title="Eliminar galería"
        >
          🗑️ Eliminar
        </button>
      </div>

      {/* Gallery Grid */}
      <div 
        className="gallery-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 8,
          minHeight: images.length === 0 ? 100 : 'auto',
          border: images.length === 0 ? '2px dashed #ccc' : 'none',
          borderRadius: 8,
          padding: images.length === 0 ? 16 : 0
        }}
      >
        {images.length === 0 ? (
          <div style={{
            gridColumn: `1 / ${columns + 1}`,
            textAlign: 'center',
            color: '#666',
            fontSize: 14
          }}>
            📷 Galería vacía - Haz clic en "Añadir imágenes" para comenzar
          </div>
        ) : (
          images.map((src, index) => (
            <div 
              key={index}
              style={{ 
                position: 'relative',
                borderRadius: 8,
                overflow: 'hidden',
                aspectRatio: '1',
                backgroundColor: '#f5f5f5'
              }}
            >
              <img
                src={src}
                alt={`Imagen ${index + 1} de la galería`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  width: 20,
                  height: 20,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Eliminar imagen"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
      <NodeViewContent />
    </NodeViewWrapper>
  );
}