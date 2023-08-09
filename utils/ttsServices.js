import wav from "wav";
import { v4 as uuidv4 } from "uuid";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { uploadAudio } from "@utils/awsUtils";
import { deleteFile } from "@utils/utils";
const proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("./protocol/tts.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })
);

// Setting up the grpc server credentials
const REMOTE_SERVER = process.env.TTS_SERVER;

const client = new proto.utopia.texttospeech.v1.TextToSpeech(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
);

export const listLanguages = () => {
  return new Promise((resolve, reject) => {
    client.ListLanguages({}, metadata, (error, response) => {
      if (error) return reject(error);
      resolve(response);
    });
  });
};

export const listVoices = (language) => {
  const params = { language_code: language };

  return new Promise((resolve, reject) => {
    client.ListVoices(params, metadata, (error, response) => {
      if (error) return reject(error);
      resolve(response);
    });
  });
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const SynthesizeSpeech = ({ data }) => {
  const fileName = `${uuidv4()}`;
  const { language, voice, text } = data;

  const input = {
    text: text,
    ssml: "ssml",
  };
  const ssml_gender = "FEMALE";

  const voice_config = {
    language_code: language,
    name: voice,
    ssml_gender,
  };

  const audio_config = {
    audio_encoding: "LINEAR16",
    speaking_rate: 1.0,
    pitch: 1,
    volume_gain_db: 2.0,
    sample_rate_hertz: 22050,
    effects_profile_id: "",
  };

  const ttsRequest = {
    input,
    voice: voice_config,
    audio_config,
  };

  const fileWriter = new wav.FileWriter(`${fileName}.wav`, {
    channels: 1,
    sampleRate: 22050,
    bitDepth: 16,
  });
  return new Promise((resolve, reject) => {
    const call = client.SynthesizeSpeech(ttsRequest, metadata);

    call.on("data", (chunk) => {
      const { audio_content } = chunk;
      fileWriter.write(audio_content);
    });
    call.on("error", async (error) => {
      console.log(error);
      await delay(50);
      fileWriter.end();
      deleteFile(`${fileName}.wav`);
      reject(error);
    });

    call.on("status", (status) => {
      if (status.details) console.log(status.details);
    });

    call.on("end", async () => {
      await delay(50);
      await fileWriter.end();
      const audio_url = await uploadAudio(`${fileName}.wav`);
      deleteFile(`${fileName}.wav`);
      resolve(audio_url);
    });
  });
};

export const metadata = new grpc.Metadata();
metadata.add("request_id", "random_id");

export default client;
