import React from "react";

export default function HeelBars({ heel = 0 }) {
  const totalLines = 40;
  const angleSpread = 80;
  const radius = 460;
  const maxHeel = 40;

  const getColorForIndex = (relativeIdx, halfHighlight) => {
    const t = Math.min(relativeIdx / halfHighlight, 1); // 0 → 1
    let r, g;

    if (t < 0.5) {
      // green → yellow
      r = Math.round(255 * (t * 2));        // 0 → 255
      g = 255;
    } else {
      // yellow → red
      r = 255;
      g = Math.round(255 * (1 - (t - 0.5) * 2)); // 255 → 0
    }

    return `rgb(${r},${g},0)`;
  };

  return (
    <>
      {["left", "right"].map((side) => {
        const isLeft = side === "left";

        return (
          <div
            key={side}
            className="absolute w-full h-full pointer-events-none"
          >
            {Array.from({ length: totalLines }).map((_, i) => {
              const centerIdx = Math.floor(totalLines / 2);
              const relativeIdx = i - centerIdx;
              const anglePerStep = angleSpread / totalLines;
              const angle = relativeIdx * anglePerStep;
              const rotation = isLeft ? -angle : angle;
              const translateDirection = isLeft ? -1 : 1;

              const halfHighlight = Math.floor(Math.min(Math.abs(heel), maxHeel) / 2);
              let isHighlighted = false;
              let color = "white";

              if (heel > 0) {
                isHighlighted = isLeft
                  ? relativeIdx < 0 && -relativeIdx <= halfHighlight
                  : relativeIdx >= 0 && relativeIdx < halfHighlight;
                if (isHighlighted) color = getColorForIndex(Math.abs(relativeIdx), halfHighlight);
              } else if (heel < 0) {
                isHighlighted = isLeft
                  ? relativeIdx >= 0 && relativeIdx < halfHighlight
                  : relativeIdx < 0 && -relativeIdx <= halfHighlight;
                if (isHighlighted) color = getColorForIndex(Math.abs(relativeIdx), halfHighlight);
              }

              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: isHighlighted ? "32px" : "16px",
                    height: "3px",
                    backgroundColor: color,
                    opacity: isHighlighted ? 1 : 0.3,
                    borderRadius: "1px",
                    transform: `
                      rotate(${rotation}deg)
                      translateX(${translateDirection * radius}px)
                      ${isLeft ? `translateX(-${isHighlighted ? 32 : 16}px)` : ``}
                      rotate(${-rotation}deg)
                    `,
                    transformOrigin: "center",
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}
