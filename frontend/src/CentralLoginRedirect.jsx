import { useEffect } from "react";

export default function CentralLoginRedirect() {
  useEffect(() => {
    window.location.href = "http://localhost:5173/login?redirect=feedback";
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0d0d0d",
      color: "#ffffff",
      fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        width: "44px",
        height: "44px",
        border: "3px solid rgba(255, 255, 255, 0.15)",
        borderTopColor: "#e50914",
        borderRadius: "50%",
        animation: "spin 0.9s linear infinite"
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ marginTop: "18px", fontSize: "0.95rem", color: "#9ca3af" }}>
        Redirecting to VikingsERP Central Unified Login...
      </p>
    </div>
  );
}
