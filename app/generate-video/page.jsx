"use client";
import { useState, useEffect } from "react";
import SelectLanguages from "@components/SelectLanguages";
import SelectVideo from "@components/SelectVideo";
import SelectVoice from "@components/SelectVoice";
import FormMimic from "@components/MIMIC/FormMimic";
import AvatarViewer from "@components/MIMIC/AvatarViewer";
import { useMimic } from "@hooks/useMimic";
const VideoPage = () => {
  const {
    videos,
    languages,
    language,
    voices,
    voice,
    setLanuage,
    setVoice,
    avatar,
    setAvatar,
  } = useMimic();

  const [prompt, setPrompt] = useState("");
  const [audio_url, setAudio_Url] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/tts/synthesizespeech", {
      method: "POST",
      body: JSON.stringify({
        text: prompt,
        language: language,
        voice: voice,
      }),
    });
    const { audio_url } = await response.json();
    setAudio_Url(audio_url);
  };

  return (
    <section className="w-lg max-w-full flex-start flex-col">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="mt-1 w-full max-w-lg flex flex-col gap-1 glassmorphism">
          <SelectLanguages languages={languages} setLanuage={setLanuage} />
          <SelectVoice voices={voices} setVoice={setVoice} />
          <SelectVideo vidoes={videos} setAvatar={setAvatar} />
          <FormMimic
            prompt={prompt}
            setPrompt={setPrompt}
            handleSubmit={handleSubmit}
          />
        </div>
        <div className="mt-1 w-full max-w-full gap-2 glassmorphism">
          <AvatarViewer avatar={avatar} audio_url={audio_url} />
        </div>
      </div>
    </section>
  );
};

export default VideoPage;
