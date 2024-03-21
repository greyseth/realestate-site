import { useState } from "react";

export default function Loading({ width, height, color, size }) {
  const [loadingWidth, setLoadingWidth] = useState(width ? width : "70px");
  const [loadingHeight, setLoadingHeight] = useState(height ? height : "70px");
  const [loadingColor, setLoadingColor] = useState(
    color ? color : "var(--tertiary-color)"
  );
  const [loadingSize, setLoadingSize] = useState(size ? size : "10px");

  return (
    <div
      className="loading"
      style={{
        width: loadingWidth,
        height: loadingHeight,
        border: `${loadingSize} solid var(--secondary-color)`,
        borderTop: `${loadingSize} solid ${loadingColor}`,
      }}
    ></div>
  );
}
