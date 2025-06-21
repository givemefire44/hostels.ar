import React from "react";

// comments: [{ text: string, flag?: string }]
export default function BubbleComments({ comments }) {
  return (
    <div style={{
      display: "flex",
      gap: 16,
      justifyContent: "center",
      marginBottom: 24,
      flexWrap: "wrap"
    }}>
      {comments.map((comment, idx) => (
        <div
          key={idx}
          style={{
            background: "#fff4",
            color: "#fff",
            borderRadius: 18,
            padding: "8px 20px",
            fontSize: "1.01rem",
            fontWeight: 500,
            boxShadow: "0 2px 10px #0001",
            display: "flex",
            alignItems: "center"
          }}
        >
          {comment.flag && <span style={{ marginRight: 8 }}>{comment.flag}</span>}
          {comment.text}
        </div>
      ))}
    </div>
  );
}
         
