"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
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
    <div className="h-full max-w-full">
      {!processing ? (
        <video
          src={avatarUrl}
          controls
          width={512}
          height={512}
          className="glassmorphism"
        />
      ) : (
        <Image
          width={512}
          height={512}
          alt="generated image"
          src="/assets/icons/loader.svg"
          className="glassmorphism"
        />
      )}
    </div>
  );
};

export default AvatarViewer;
