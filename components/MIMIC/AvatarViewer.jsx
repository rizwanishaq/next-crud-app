"use client";
import Loader from "@components/Loader";
import { useState, useEffect } from "react";
const AvatarViewer = ({ avatar, audio_url }) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const getAvatar = async () => {
      setProcessing(true);
      const response = await fetch("/api/mimic/getAvatar", {
        method: "POST",
        body: JSON.stringify({
          avatar: avatar,
          audio_url: audio_url,
          hd: true,
        }),
      });

      const { video_url } = await response.json();
      setAvatarUrl(video_url);
      setProcessing(false);
    };
    if (audio_url !== "") {
      getAvatar();
    }
  }, [audio_url]);

  return (
    <div className="mt-1 w-full max-w-lg flex flex-col gap-1 glassmorphism">
      <div className="h-full max-w-lg">
        {!processing ? (
          <video
            src={avatarUrl}
            controls
            width={512}
            height={512}
            className="mt-1 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
          />
        ) : (
          <Loader
            desc="Loading video"
            className="mt-1 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
          />
        )}
      </div>
    </div>
  );
};

export default AvatarViewer;
