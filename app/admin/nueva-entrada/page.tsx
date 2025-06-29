"use client";

import React, { useState } from "react";
import BlogEditor from "@/app/admin/components/BlogEditor";

export default function NuevaEntrada() {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    // Guardar en la base de datos: content
    alert(content); // reemplazar por guardar real
  };

  return (
    <div>
      <h1>Nueva Entrada</h1>
      <BlogEditor value={content} onChange={setContent} />
      <button onClick={handleSubmit}>Guardar</button>
    </div>
  );
}