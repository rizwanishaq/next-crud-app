import { v4 as uuidv4 } from "uuid";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("./protocol/wav2lip.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })
);

// Setting up the grpc server credentials
const REMOTE_SERVER = `${process.env.MODEL_IP}:${process.env.MODEL_PORT}`;

const client = new proto.wav2lip.v1.Wav2Lip(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
);

export const generateAvatar = (audio_url, name, hd) => {
  return new Promise((resolve, reject) => {
    const request = {
      uid: uuidv4(),
      audio_url: audio_url,
      name: name,
      hd: hd,
    };

    client.predict(request, (err, response) => {
      if (err) {
        console.log(err);
        return reject(`Error during request -> ${err}`);
      }
      return resolve({
        video_url: response.video_url,
      });
    });
  });
};
