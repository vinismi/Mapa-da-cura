
"use client";

import { useEffect, useRef } from "react";

type WistiaPlayerProps = {
  videoId: string;
};

export function WistiaPlayer({ videoId }: WistiaPlayerProps) {
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadVideo = () => {
      if (videoContainerRef.current && window.Wistia?.api) {
        // Find any existing player in the container and replace it
        const existingPlayer = window.Wistia.api(videoContainerRef.current.id);
        if (existingPlayer) {
          existingPlayer.replaceWith(videoId);
        }
      }
    };

    // The main script E-v1.js is loaded in RootLayout.
    // We just need the JSONP file for the specific media.
    const videoScript = document.createElement("script");
    videoScript.src = `https://fast.wistia.com/embed/medias/${videoId}.jsonp`;
    videoScript.async = true;
    document.body.appendChild(videoScript);

    // Wistia's API might not be ready immediately. We'll check for it.
    const checkWistiaInterval = setInterval(() => {
      if (window.Wistia?.api) {
        clearInterval(checkWistiaInterval);
        loadVideo();
      }
    }, 100);

    return () => {
      // Cleanup
      clearInterval(checkWistiaInterval);
      try {
        if (document.body.contains(videoScript)) {
          document.body.removeChild(videoScript);
        }
      } catch (error) {
        console.warn("Failed to cleanup Wistia script.", error);
      }
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
        ref={videoContainerRef}
        id={`wistia_player_${videoId}_${Math.random().toString(36).substring(7)}`}
        className={`wistia_embed wistia_async_${videoId} videoFoam=true autoPlay=false fullscreenButton=true fullscreenOnplay=true`}
        style={{ height: "auto", width: "100%", aspectRatio: "0.5625" }}
      >
        &nbsp;
      </div>
    </div>
  );
}

declare global {
  interface Window {
    Wistia: any;
  }
}

    