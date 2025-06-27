import React, { useState } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { supabase } from "@/lib/supabaseClient";

interface GalleryProps {
  node: any;
  updateAttributes: (attrs: any) => void;
  deleteNode: () => void;
}

export function ImageGalleryView({ node, updateAttributes, deleteNode }: GalleryProps) {
  const [uploading, setUploading] = useState(false);
  const images = node.attrs.images || [];

  const handleImageUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const filePath = `blog/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (error) {
        console.error("Error uploading image:", error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      return urlData?.publicUrl;
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(url => url !== null);
      const newImages = [...images, ...validUrls];
      updateAttributes({ images: newImages });
    } catch (error) {
      alert("Error al subir algunas imágenes");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_: any, index: number) => index !== indexToRemove);
    updateAttributes({ images: newImages });
  };

  const addImageFromUrl = () => {
    const url = window.prompt("URL de la imagen");
    if (url) {
      const newImages = [...images, url];
      updateAttributes({ images: newImages });
    }
  };

  return (
    <NodeViewWrapper className="image-gallery-block">
      <div style={{
        border: "2px dashed #ccc",
        borderRadius: 8,
        padding: 16,
        margin: "16px 0",
        background: "#fafafa"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          padding: "4px 8px",
          background: "white",
          borderRadius: 4,
          border: "1px solid #ddd"
        }}>
          <span style={{ fontWeight: "bold", color: "#666" }}>
            📸 Galería de Imágenes ({images.length})
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              id={`gallery-upload-${node.attrs.id || 'default'}`}
              onChange={(e) => {
                if (e.target.files) {
                  handleImageUpload(e.target.files);
                }
              }}
            />
            <label
              htmlFor={`gallery-upload-${node.attrs.id || 'default'}`}
              style={{
                cursor: "pointer",
                background: "#4CAF50",
                color: "white",
                padding: "4px 8px",
                borderRadius: 4,
                fontSize: 12,
                border: "none"
              }}
            >
              {uploading ? "Subiendo..." : "➕ Subir"}
            </label>
            <button
              type="button"
              onClick={addImageFromUrl}
              style={{
                background: "#2196F3",
                color: "white",
                padding: "4px 8px",
                borderRadius: 4,
                fontSize: 12,
                border: "none",
                cursor: "pointer"
              }}
            >
              🔗 URL
            </button>
            <button
              type="button"
              onClick={deleteNode}
              style={{
                background: "#f44336",
                color: "white",
                padding: "4px 8px",
                borderRadius: 4,
                fontSize: 12,
                border: "none",
                cursor: "pointer"
              }}
            >
              🗑️ Eliminar
            </button>
          </div>
        </div>

        {images.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: 20,
            color: "#999",
            background: "white",
            borderRadius: 4,
            border: "1px dashed #ddd"
          }}>
            <p>No hay imágenes en la galería</p>
            <p style={{ fontSize: 12 }}>Usa los botones de arriba para agregar imágenes</p>
          </div>
        ) : (
          <div className="gallery-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 8,
            background: "white",
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ddd"
          }}>
            {images.map((src: string, index: number) => (
              <div key={index} style={{ position: "relative" }}>
                <img
                  src={src}
                  alt={`Imagen ${index + 1}`}
                  style={{
                    width: "100%",
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #eee"
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    background: "rgba(244, 67, 54, 0.8)",
                    color: "white",
                    border: "none",
                    borderRadius: 2,
                    width: 18,
                    height: 18,
                    fontSize: 10,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  title="Eliminar imagen"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <NodeViewContent />
    </NodeViewWrapper>
  );
}