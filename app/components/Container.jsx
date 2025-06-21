"use client";
export default function Container({ children, style = {} }) {
  return (
    <div
      style={{
        maxWidth: 1350,
        width: "100%",
        margin: "0 auto",
        padding: "0 24px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
