"use client";
import { createContext, useState, useEffect } from "react";

export const MimicContext = createContext();

const MimicProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [language, setLanuage] = useState("es-ES");
  const [voices, setVoices] = useState([]);
  const [voice, setVoice] = useState("UTESM");
  const [avatar, setAvatar] = useState(
    "https://dialoga-machine-learning.s3.eu-west-1.amazonaws.com/mimic/videos/eduardo_bravo/eduardo_bravo_another.mp4"
  );

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
    const getVideosUrl = async () => {
      const response = await fetch("/api/mimic/videosurl");
      const { urls } = await response.json();
      setVideos(urls);
    };
    getVideosUrl();
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

  return (
    <MimicContext.Provider
      value={{
        videos,
        languages,
        language,
        voices,
        voice,
        setLanuage,
        setVoice,
        avatar,
        setAvatar,
      }}
    >
      {children}
    </MimicContext.Provider>
  );
};

export default MimicProvider;
