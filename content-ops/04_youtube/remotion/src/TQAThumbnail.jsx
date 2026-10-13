// The Quiet Authority thumbnail card (1280 by 720). One card for each master video.
// The picture is one of the two locked plates, cropped differently for each video so every card is easy to tell apart.
// The scripture title sits in the middle in brand gold Cinzel. The words come from the props. Text boxes stay within 780 pixels.
// Only the brand colors and the brand fonts are used here.
import { useEffect, useState } from "react";
import { AbsoluteFill, Img, continueRender, delayRender } from "remotion";
import spotlightCandle from "./assets/tqa/light-stream-plate.jpg";
import characterSpotlight from "./assets/tqa/character-spotlight-plate.jpg";

export const THUMB = Object.freeze({ width: 1280, height: 720, text_width_px: 780 });
const COLORS = { black: "#0d0d0d", gold: "#C9A84C", cream: "#F5F0E8" };
const IMAGES = { spotlight_candle: spotlightCandle, character_spotlight: characterSpotlight };
const MAX_W = THUMB.text_width_px;

const FONT_CSS = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400&family=Jost:wght@300;400&display=swap";
const useBrandFonts = () => {
  const [handle] = useState(() => delayRender("brand fonts", { timeoutInMilliseconds: 60000 }));
  useEffect(() => {
    const finish = () => continueRender(handle);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_CSS;
    link.onload = () => Promise.all([document.fonts.load('400 40px "Cinzel"'), document.fonts.load('300 40px "Jost"')]).then(finish, finish);
    link.onerror = finish;
    document.head.appendChild(link);
  }, [handle]);
};

// card: { plate, zoom, focus, shade, lines: [{ text, size }], sub }
export const TQAThumbnail = ({ card }) => {
  useBrandFonts();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
      <AbsoluteFill style={{ opacity: card.shade, overflow: "hidden" }}>
        <Img
          src={IMAGES[card.plate]}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: card.focus, transform: `scale(${card.zoom})`, transformOrigin: card.focus }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: MAX_W, maxWidth: MAX_W, boxSizing: "border-box", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          {card.lines.map((l) => (
            <div key={l.text} style={{ fontFamily: "'Cinzel', serif", fontWeight: 400, fontSize: l.size, letterSpacing: 4, lineHeight: 1.15, color: COLORS.gold, textShadow: `0 3px 18px ${COLORS.black}` }}>
              {l.text}
            </div>
          ))}
          <div style={{ marginTop: 14, fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 34, letterSpacing: 2, color: COLORS.cream, textShadow: `0 3px 18px ${COLORS.black}` }}>{card.sub}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
