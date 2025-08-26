
"use client";

import { useEffect } from "react";

type WistiaPlayerProps = {
  videoId: string;
};

export function WistiaPlayer({ videoId }: WistiaPlayerProps) {
  useEffect(() => {
    // The main script E-v1.js is now loaded in RootLayout.
    // This component now only needs to load the specific video embed script.
    const videoScript = document.createElement("script");
    videoScript.src = `https://fast.wistia.com/embed/medias/${videoId}.jsonp`;
    videoScript.async = true;
    document.body.appendChild(videoScript);

    return () => {
      // Cleanup script on component unmount
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
