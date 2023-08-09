"use client";
import { useState, useEffect } from "react";
import SelectLanguages from "@components/SelectLanguages";
import SelectVideo from "@components/SelectVideo";
import SelectVoice from "@components/SelectVoice";
import { Suspense } from "react";
import FormMimic from "@components/MIMIC/FormMimic";
import AvatarViewer from "@components/MIMIC/AvatarViewer";
const VideoPage = () => {
  const [languages, setLanguages] = useState([]);
  const [voices, setVoices] = useState([]);
  const [videos, setVideos] = useState([]);
  const [avatar, setAvatar] = useState(
    "https://dialoga-machine-learning.s3.eu-west-1.amazonaws.com/mimic/videos/eduardo_bravo/eduardo_bravo_another.mp4"
  );
  const [language, setLanuage] = useState("es-ES");
  const [voice, setVoice] = useState("UTESM");
  const [prompt, setPrompt] = useState("");
  const [audio_url, setAudio_Url] = useState("");

  useEffect(() => {
    const getLanguages = async () => {
      const response = await fetch("/api/tts/languages");
      const { languages } = await response.json();
      setLanguages(languages);
    };
    getLanguages();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const getVoices = async () => {
      const response = await fetch(`/api/tts/languages/${language}`);
      const { voices } = await response.json();
      setVoices(voices);
    };

    if (language) getVoices();
    // eslint-disable-next-line
  }, [language]);

  useEffect(() => {
    const getVideosUrl = async () => {
      const response = await fetch("/api/mimic/videosurl");
      const { urls } = await response.json();
      setVideos(urls);
    };
    getVideosUrl();
  }, []);

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
    <section className="w-full max-w-full flex-start flex-col">
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
        <Suspense fallback={<div>Loading repo...</div>}>
          <AvatarViewer avatar={avatar} audio_url={audio_url} />
        </Suspense>
      </div>
    </section>
  );
};

export default VideoPage;
