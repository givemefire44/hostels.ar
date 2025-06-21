import React from "react";

// Ejemplo de avatares libres de derechos, puedes cambiarlos por los que quieras
const avatars = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/54.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
];

export default function BubbleComments({ comments }) {
  return (
    <div style={{
      display: "flex",
      gap: 28,
      justifyContent: "center",
      marginBottom: 32,
      flexWrap: "wrap"
    }}>
      {comments.map((comment, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 130
          }}
        >
          <img
            src={avatars[idx % avatars.length]}
            alt="avatar"
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 2px 10px #0002",
              border: "2.5px solid #fff",
              marginBottom: 8,
            }}
          />
          <div style={{
            background: "#fff",
            color: "#7e2fbf",
            borderRadius: 18,
            padding: "8px 18px",
            fontSize: "1.05rem",
            fontWeight: 500,
            boxShadow: "0 2px 10px #0002",
            maxWidth: 180,
            textAlign: "center",
            border: "1.5px solid #e8e1ef",
          }}>
            {comment.text}
          </div>
        </div>
      ))}
    </div>
  );
}
         
