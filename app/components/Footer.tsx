import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#1a1a1a",
        color: "#fff",
        padding: "32px 0 24px 0",
        marginTop: 48,
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 24px",
        textAlign: "center",
        fontSize: 16,
      }}>
        © {new Date().getFullYear()} Hostels.ar — Todos los derechos reservados.
      </div>
    </footer>
  );
}
