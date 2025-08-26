
"use client";

import { useEffect } from "react";

type WistiaPlayerProps = {
  videoId: string;
};

export function WistiaPlayer({ videoId }: WistiaPlayerProps) {
  useEffect(() => {
    // This loads the Wistia player API
    const wistiaScript = document.createElement("script");
    wistiaScript.src = "https://fast.wistia.com/assets/external/E-v1.js";
    wistiaScript.async = true;
    document.body.appendChild(wistiaScript);

    // This specifically loads the video embed
    const videoScript = document.createElement("script");
    videoScript.src = `https://fast.wistia.com/embed/medias/${videoId}.jsonp`;
    videoScript.async = true;
    document.body.appendChild(videoScript);

    return () => {
      // Cleanup scripts on component unmount
      document.body.removeChild(wistiaScript);
      document.body.removeChild(videoScript);
    };
  }, [videoId]);

  return (
    <div>
        <style>{`
            .wistia_embed {
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
        `}</style>
      <div
        className={`wistia_async_${videoId} videoFoam=true autoPlay=true fullscreenButton=true`}
        style={{ height: "auto", width: "100%", aspectRatio: "0.5625" }}
      >
        &nbsp;
      </div>
    </div>
  );
}
