
"use client";

import { useEffect } from "react";

type WistiaPlayerProps = {
  videoId: string;
};

export function WistiaPlayer({ videoId }: WistiaPlayerProps) {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://fast.wistia.com/player.js";
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = `https://fast.wistia.com/embed/${videoId}.js`;
    script2.async = true;
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, [videoId]);

  return (
    <div>
        <style>{`
            .wistia_embed {
                border-radius: 8px;
                overflow: hidden;
            }
        `}</style>
      <div
        className={`wistia_embed wistia_async_${videoId} videoFoam=true`}
        style={{ height: "auto", width: "100%", aspectRatio: "0.5625" }}
      >
        &nbsp;
      </div>
    </div>
  );
}
