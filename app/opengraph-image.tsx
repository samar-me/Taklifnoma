import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#f8f1e7", background: "#302a24", fontFamily: "serif" }}>
      <div style={{ fontSize: 22, letterSpacing: 8, color: "#d7b47a" }}>WEDDING INVITATION</div>
      <div style={{ fontSize: 104, marginTop: 36 }}>Samar &amp; Madina</div>
      <div style={{ fontSize: 34, marginTop: 28, color: "#ddc18d" }}>18 October 2026</div>
    </div>, size,
  );
}
