import React from "react";

export default function Header() {
  return (
    <header
      style={{
        height: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 24px",
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 32, color: "#fff" }}>
        <span style={{ color: "#8816c0" }}>Hostels</span>
        <span style={{ color: "#FFC300" }}>.ar</span>
      </div>
      <div>
        <button
          style={{
            background: "#ffe600",
            border: "none",
            borderRadius: 8,
            padding: "8px 18px",
            fontWeight: 700,
            cursor: "pointer",
            color: "#8816c0",
            fontSize: 16,
          }}
        >
          Menú
        </button>
        {/* Acá podés luego poner el desplegable */}
      </div>
    </header>
  );
}
