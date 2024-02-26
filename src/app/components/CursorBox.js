import { useEffect, useState } from "react";

export default function CursorBox({ msg, showing }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    document.addEventListener("mousemove", (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    });
  }, []);

  return (
    <p
      className="cursor-box"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
      }}
      hidden={!showing}
    >
      {msg}
    </p>
  );
}
