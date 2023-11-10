"use client";
import { useState, useEffect, useRef } from "react";
import { downsampleBuffer, getLinear16 } from "@utils/utils";

const page = () => {
  const [start, setStart] = useState(false);
  const [error, setError] = useState("");
  const [text, setText] = useState("");

  const [responseData, setResponseData] = useState({
    transcription: null,
  });
  const ws = useRef(null);
  const audioContext = useRef(null);
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

        ws.current.send(JSON.stringify({ simple: "simple" }));
      };

      ws.current.onmessage = (event) => {
        const { transcription } = JSON.parse(event.data);

        setResponseData({
          transcription,
        });
      };
      ws.current.onclose = () => {
        console.log("stream closed");
        setStart(false);
        setResponseData({
          transcription: null,
        });
      };
      ws.current.onerror = (e) => {
        console.log(`stream close due to error : ${JSON.stringify(e)}`);

        setStart(false);
        ws.current.close();
        audioContext.current && audioContext.current.close();
      };

      return () => {
        ws.current.close();
        audioContext.current && audioContext.current.close();
        console.log("Demounting the component");
        setError("");
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  useEffect(() => {
    if (responseData.transcription != null) {
      try {
        setText(responseData.transcription);
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
      <div>
        <h1>{text}</h1>
      </div>
      <div className="mt-1 w-full max-w-lg flex flex-col gap-1 glassmorphism">
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
