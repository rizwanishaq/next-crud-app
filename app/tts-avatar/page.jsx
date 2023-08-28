"use client";
import { useState, useEffect, useRef } from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import PCMPlayer from "pcm-player";
import { useMimic } from "@hooks/useMimic";
import Image from "next/image";
import { downsampleBuffer, getLinear16 } from "@utils/utils";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { fromJSON } from "@grpc/proto-loader";
import SelectVoice from "@components/SelectVoice";
import SelectLanguages from "@components/SelectLanguages";
import SelectVideo from "@components/SelectVideo";

const page = () => {
  const { language, voice, voices, setVoice, setLanuage, languages } =
    useMimic();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      content: "Hello I am ChatGPT, how can I help you?",
      role: "assistant",
    },
    {
      content: "I am good thanks, how are you?",
      role: "user",
    },
  ]);
  const [typing, setTyping] = useState(false);

  const [responseData, setResponseData] = useState({
    image: null,
    audio_contents: null,
  });

  const ws = useRef(null);
  const audioContext = useRef(null);
  const player = useRef(null);
  const [text, setText] = useState("");

  const [start, setStart] = useState(false);
  const [error, setError] = useState("");

  const [audio_url, setAudio_Url] = useState("");

  const avatars = [
    "https://dialoga-machine-learning.s3.eu-west-1.amazonaws.com/mimic/videos/eduardo_bravo/eduardo_bravo_cartoo23323n.mp4",
    "https://dialoga-machine-learning.s3.eu-west-1.amazonaws.com/mimic/videos/eduardo_bravo/eduardo_bravo_metahuman.mp4",
    "https://dialoga-machine-learning.s3.amazonaws.com/mimic/source/monalisa.mp4",
    "https://dialoga-machine-learning.s3.eu-west-1.amazonaws.com/mimic/videos/eduardo_bravo/eduardo_bravo_another.mp4",
    "https://dialoga-machine-learning.s3.eu-west-1.amazonaws.com/mimic/videos/eduardo_bravo/eduardo_bravo_better_one.mp4",
    "https://dialoga-machine-learning.s3.eu-west-1.amazonaws.com/mimic/videos/eduardo_bravo/eduardo_bravo_Screenshot+from+2023-05-15+16-01-45-0-Enhanced-Animated.mp4",
    "https://dialoga-machine-learning.s3.amazonaws.com/mimic/videos/eduardo_bravo/eduardo_bravo_00024-3290188462-0-Enhanced-Animated.mp4",
    "https://dialoga-machine-learning.s3.amazonaws.com/mimic/videos/eduardo_bravo/eduardo_bravo_00053-2365829893-0-Enhanced-Animated.mp4",
  ];

  const [avatar, setAvatar] = useState(
    "https://dialoga-machine-learning.s3.eu-west-1.amazonaws.com/mimic/videos/eduardo_bravo/eduardo_bravo_another.mp4"
  );

  const process_microphone_buffer = async (event) => {
    const inputBuffer = event.inputBuffer;
    const buffer32 = inputBuffer.getChannelData(0);

    const targetSampleRate = 16000;
    const downsampledBuffer = downsampleBuffer(
      buffer32,
      event.inputBuffer.sampleRate,
      targetSampleRate
    );
    const raw = await getLinear16(downsampledBuffer);
    const bytes = raw.buffer;

    ws.current.send(bytes);
  };

  const success = async (arrayBuffer) => {
    audioContext.current = new AudioContext();

    const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);

    const source = audioContext.current.createBufferSource();
    source.buffer = audioBuffer;

    const scriptProcessor = audioContext.current.createScriptProcessor(
      2048,
      1,
      1
    );

    scriptProcessor.onaudioprocess = process_microphone_buffer;

    scriptProcessor.connect(audioContext.current.destination);

    source.connect(scriptProcessor);
    source.start();
  };

  useEffect(() => {
    if (start) {
      ws.current = new WebSocket("ws://localhost:5000/ws");
      ws.current.onopen = () => {
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
        setResponseData({
          image: null,
          audio_contents: null,
        });
      };
      ws.current.onerror = (e) => {
        console.log("stream close due to error");

        player.current.destroy();
        ws.current.close();
        audioContext.current && audioContext.current.close();
      };

      return () => {
        player.current.destroy();
        ws.current.close();
        audioContext.current && audioContext.current.close();
        console.log("Demounting the component");
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

  useEffect(() => {
    if (audio_url !== "") {
      const getAudioDecoding = async () => {
        const response = await fetch("api/mimic/getAudio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audio_url: `${audio_url}`,
          }),
        });

        if (audioContext.current) {
          audioContext.current.close();
          audioContext.current = null;
        }

        const arrayBuffer = await response.arrayBuffer();
        success(arrayBuffer);
        if (!start) setStart(true);
      };

      getAudioDecoding();
    }
  }, [audio_url]);

  useEffect(() => {
    const getUrl = async () => {
      const response = await fetch("/api/tts/synthesizespeech", {
        method: "POST",
        body: JSON.stringify({
          language: language,
          voice: voice,
          text: text,
        }),
      });

      const { audio_url } = await response.json();
      setAudio_Url(audio_url);
      setText("");
    };
    if (text !== "") getUrl();
  }, [text]);

  const stopHandler = (e) => {
    setStart(false);
  };

  const startHandler = (e) => {
    setStart(true);
  };

  useEffect(() => {
    const avatarResponse = async () => {
      const response = await fetch("/api/chat/", {
        method: "POST",
        body: JSON.stringify({
          text: message,
        }),
      });

      const responseData = await response.json();

      setText(responseData);
      setStart(true);

      const newMessage = {
        content: responseData,
        role: "assistant",
      };

      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      setTyping(false);
    };
    if (typing) {
      avatarResponse();
    }
  }, [typing]);

  const handleSend = async (message) => {
    setMessage(message);
    const newMessage = {
      content: message,
      role: "user",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);
  };

  return (
    <section className="w-full max-w-full flex-center flex-col">
      <div className="mt-1 w-full max-w-2xl flex flex-col gap-2 glassmorphism">
        <div className="flex justify-between">
          <div className="w-1/2">
            <SelectLanguages languages={languages} setLanuage={setLanuage} />
            <SelectVoice voices={voices} setVoice={setVoice} />
            <SelectVideo vidoes={avatars} setAvatar={setAvatar} />
          </div>
          <Image
            width={256}
            height={256}
            alt="generated image"
            src={
              responseData.image
                ? `data:image/jpeg;base64,${responseData.image}`
                : "/assets/images/logo.svg"
            }
            className="max-w-xs rounded-full object-contain"
          />
        </div>
        <div
          className=" glassmorphism overflow-hidden relative justify-end"
          style={{ height: "270px" }}
        >
          <MainContainer>
            <ChatContainer>
              <MessageList
                scrollBehavior="auto"
                autoScrollToBottom={true}
                typingIndicator={
                  typing ? (
                    <TypingIndicator content="ChatSystem is processing" />
                  ) : null
                }
              >
                {messages.map((message, i) => {
                  return (
                    <Message
                      key={i}
                      model={{
                        message: message.content,
                        sender: message.role,
                        direction:
                          message.role === "user" ? "outgoing" : "incoming",
                      }}
                    ></Message>
                  );
                })}
              </MessageList>
              <MessageInput
                placeholder="Type message here"
                onSend={handleSend}
                className="form_input"
              />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </section>
  );
};

export default page;
