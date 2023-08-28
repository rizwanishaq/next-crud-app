"use client";
import { useState, useEffect, useRef } from "react";
import PCMPlayer from "pcm-player";
import { downsampleBuffer, getLinear16 } from "@utils/utils";
import Image from "next/image";
import SelectVideo from "@components/SelectVideo";

const page = () => {
  const [avatar, setAvatar] = useState(
    "https://dialoga-machine-learning.s3.eu-west-1.amazonaws.com/mimic/videos/eduardo_bravo/eduardo_bravo_another.mp4"
  );

  const [start, setStart] = useState(false);
  const [error, setError] = useState("");
  const avatars = [
    "https://dialoga-machine-learning.s3.eu-west-1.amazonaws.com/mimic/videos/eduardo_bravo/eduardo_bravo_cartoo23323n.mp4",
    "https://dialoga-machine-learning.s3.eu-west-1.amazonaws.com/mimic/videos/eduardo_bravo/eduardo_bravo_metahuman.mp4",
    "https://dialoga-machine-learning.s3.eu-west-1.amazonaws.com/mimic/videos/eduardo_bravo/eduardo_bravo_another.mp4",
    "https://dialoga-machine-learning.s3.eu-west-1.amazonaws.com/mimic/videos/eduardo_bravo/eduardo_bravo_better_one.mp4",
    "https://dialoga-machine-learning.s3.eu-west-1.amazonaws.com/mimic/videos/eduardo_bravo/eduardo_bravo_Screenshot+from+2023-05-15+16-01-45-0-Enhanced-Animated.mp4",
  ];

  const [responseData, setResponseData] = useState({
    image: null,
    audio_contents: null,
  });
  const ws = useRef(null);
  const audioContext = useRef(null);
  const player = useRef(null);
  const process_microphone_buffer = async (bufferF32, sampleRate) => {
    const targetSampleRate = 16000;
    const downsampledBuffer = downsampleBuffer(
      bufferF32,
      sampleRate,
      targetSampleRate
    );
    const raw = await getLinear16(downsampledBuffer);
    const bytes = raw.buffer;

    ws.current.send(bytes);
  };

  const success = async (stream) => {
    audioContext.current = new AudioContext();

    const audioInput = audioContext.current.createMediaStreamSource(stream);

    await audioContext.current.audioWorklet.addModule(
      "worklet/script-processor.js"
    );

    const recorder = new AudioWorkletNode(
      audioContext.current,
      "script-processor"
    );

    recorder.port.onmessage = (e) => {
      process_microphone_buffer(e.data, audioContext.current.sampleRate);
    };

    audioInput.connect(recorder);
    recorder.connect(audioContext.current.destination);
  };

  const unsuccess = (err) => {
    console.log(err);
    setError(err);
    setStart(false);
  };

  const getUserMedia = () => {
    console.log("stream started");
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(success)
      .catch(unsuccess);
  };

  useEffect(() => {
    if (start) {
      setError("");
      ws.current = new WebSocket("ws://localhost:5000/ws");
      ws.current.onopen = () => {
        getUserMedia();
        player.current = new PCMPlayer({
          inputCodec: "Int16",
          channels: 1,
          sampleRate: 16000,
          flushTime: 50,
        });

        ws.current.send(JSON.stringify({ avatar: avatar }));
      };

      ws.current.onmessage = (event) => {
        const { image, audio_contents } = JSON.parse(event.data);

        setResponseData({
          image,
          audio_contents,
        });
      };
      ws.current.onclose = () => {
        console.log("stream closed");
        setStart(false);
        setResponseData({
          image: null,
          audio_contents: null,
        });
      };
      ws.current.onerror = (e) => {
        console.log(`stream close due to error : ${JSON.stringify(e)}`);

        setStart(false);
        player.current.destroy();
        ws.current.close();
        audioContext.current && audioContext.current.close();
      };

      return () => {
        player.current.destroy();
        ws.current.close();
        audioContext.current && audioContext.current.close();
        console.log("Demounting the component");
        setError("");
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  useEffect(() => {
    if (responseData.audio_contents != null) {
      try {
        player.current.feed(new Int8Array(responseData.audio_contents.data));
      } catch (error) {
        setError(error.message);
      }
    }
    // eslint-disable-next-line
  }, [responseData]);

  const stopHandler = (e) => {
    setStart(false);
  };

  const startHandler = (e) => {
    setStart(true);
  };

  return (
    <section className="w-full max-w-full flex-center flex-col">
      <div className="mt-1 w-full max-w-lg flex flex-col gap-1 glassmorphism">
        <Image
          width={256}
          height={256}
          alt="generated image"
          src={
            responseData.image
              ? `data:image/jpeg;base64,${responseData.image}`
              : "/assets/images/logo.svg"
          }
          className="mt-1 w-full max-w-lg flex flex-col gap-7 rounded-full border border-gray-200 bg-white/20 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur p-1"
        />
        <SelectVideo vidoes={avatars} setAvatar={setAvatar} />

        <div className="flex-between mx-2  gap-4 py-4">
          <div>
            <button
              type="submit"
              className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white hover:bg-orange-700"
              onClick={startHandler}
              disabled={start}
            >
              start
            </button>
          </div>
          <div>
            <button
              type="submit"
              className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white hover:bg-orange-700"
              onClick={stopHandler}
              disabled={!start}
            >
              Stop
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
