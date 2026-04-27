import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#003D9B",
          background: "linear-gradient(135deg, #003D9B 0%, #0066FF 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              backgroundColor: "white",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 20,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                backgroundColor: "#003D9B",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
          </div>
          <span
            style={{
              fontSize: 72,
              fontWeight: "bold",
              color: "white",
              letterSpacing: "-2px",
            }}
          >
            PTLPOS
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 28,
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: 8,
            }}
          >
            Smart Retail & POS Platform
          </span>
          <span
            style={{
              fontSize: 20,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Multi-tenant POS for SMEs
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}