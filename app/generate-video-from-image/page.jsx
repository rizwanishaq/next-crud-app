"use client";
import { useState, useRef, useEffect } from "react";
import SelectLanguages from "@components/SelectLanguages";
import SelectVoice from "@components/SelectVoice";
import { useMimic } from "@hooks/useMimic";
import { Upload } from "lucide-react";
import Image from "next/image";
const VideoPage = () => {
  const { languages, language, voices, voice, setLanuage, setVoice } =
    useMimic();

  const [prompt, setPrompt] = useState("");
  const [audiourl, setAudioUrl] = useState("");
  const [image, setImage] = useState(null);
  const [avatarimage, setAvatarimage] = useState(null);
  const canvas_ref = useRef(undefined);
  const [processing, setProcesssing] = useState(false);
  const [avatarVideo, setAvatarVideo] = useState("");

  useEffect(() => {
    const getVideo = async () => {
      setAvatarVideo("");
      setProcesssing(true);
      const response = await fetch("/api/generate-video-from-image/getVideo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio_url: audiourl,
          image: avatarimage.split(",")[1],
        }),
      });

      const responseData = await response.json();
      setAvatarVideo(responseData.video_url);
      setProcesssing(false);
    };
    if (audiourl !== "") {
      getVideo();
    }
    // eslint-disable-next-line
  }, [audiourl]);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setAudioUrl("");
      setAvatarVideo("");
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleContext = (e) => {
    const background_image = e.target;
    canvas_ref.current.width = background_image.width;
    canvas_ref.current.height = background_image.height;
    canvas_ref.current.hidden = true;
    canvas_ref.current.getContext("2d").drawImage(background_image, 0, 0);
    setAvatarimage(canvas_ref.current.toDataURL("image/jpeg"));
  };

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
    setAudioUrl(audio_url);
  };

  return (
    <section className="w-lg max-w-full flex-start flex-col">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="mt-1 w-full max-w-lg flex flex-col gap-1 glassmorphism">
          <SelectLanguages languages={languages} setLanuage={setLanuage} />
          <SelectVoice voices={voices} setVoice={setVoice} />
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

            <div className="flex-between mx-3 mb-5 gap-4">
              <div>
                <label>
                  <span>
                    {/* <GrAttachment size={20} /> */}
                    <Upload className="hover:cursor-pointer" />
                  </span>

                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white hover:bg-orange-700"
                >
                  Generate
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="mt-1 flex flex-col w-full max-w-full gap-2 glassmorphism">
          <div className="h-full max-w-full">
            {!processing ? (
              <video
                src={avatarVideo}
                controls
                width={512}
                height={512}
                className="glassmorphism aspect-video"
              />
            ) : (
              <Image
                width={512}
                height={512}
                alt="generated image"
                src="/assets/icons/loader.svg"
                className="glassmorphism aspect-video"
              />
            )}
          </div>

          <canvas ref={canvas_ref} />
          {image && (
            <Image
              src={image}
              alt=""
              onLoad={handleContext}
              width={512}
              height={512}
              className="rounded-xl border border-gray-200 bg-white/20 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur p-2"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoPage;
