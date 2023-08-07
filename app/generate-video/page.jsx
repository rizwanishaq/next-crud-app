"use client";
import { useState, useEffect } from "react";
import SelectLanguages from "@components/SelectLanguages";
import SelectVideo from "@components/SelectVideo";
import SelectVoice from "@components/SelectVoice";
import Loader from "@components/Loader";
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

  useEffect(() => {
    const getLanguages = async () => {
      const response = await fetch("/api/tts");
      const { languages } = await response.json();
      setLanguages(languages);
    };
    getLanguages();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const getVoices = async () => {
      const response = await fetch(`/api/tts?language=${language}`);
      const { voices } = await response.json();
      setVoices(voices);
    };

    if (language) getVoices();
    // eslint-disable-next-line
  }, [language]);

  useEffect(() => {
    const getVideosUrl = async () => {
      const response = await fetch("/api/mimic");
      const { urls } = await response.json();
      setVideos(urls);
    };
    getVideosUrl();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/tts", {
      method: "POST",
      body: JSON.stringify({
        text: prompt,
        language: language,
        voice: voice,
      }),
    });
    const { audio_url } = await response.json();
    console.log(audio_url);
  };

  return (
    <section className="w-full max-w-full flex-start flex-col">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="mt-1 w-full max-w-lg flex flex-col gap-1 glassmorphism">
          <SelectLanguages languages={languages} setLanuage={setLanuage} />
          <SelectVoice voices={voices} setVoice={setVoice} />
          <SelectVideo vidoes={videos} setAvatar={setAvatar} />
          <form
            onSubmit={handleSubmit}
            className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
          >
            <label>
              <span className="font-satoshi font-semibold text-base text-gray-700">
                Your Prompt
              </span>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Write your post here"
                required
                className="form_textarea "
              />
            </label>

            <div className="flex-end mx-3 mb-5 gap-4">
              <button
                type="submit"
                className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white hover:bg-orange-700"
                // disabled={processing}
              >
                {/* {processing ? "Generating..." : "Generate"} */}
                Generate
              </button>
            </div>
          </form>
        </div>
        <div className="mt-1 w-full max-w-lg flex flex-col gap-1 glassmorphism">
          <div className="h-full max-w-lg">
            {avatar ? (
              <video
                src={avatar}
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
      </div>
    </section>
  );
};

export default VideoPage;
