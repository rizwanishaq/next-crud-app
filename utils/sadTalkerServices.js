import { v4 as uuidv4 } from "uuid";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("./protocol/grpc_service.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })
);

// Setting up the grpc server credentials
const REMOTE_SERVER = "0.0.0.0:8001";

const identifierPackage = proto.inference;
const client = new identifierPackage.GRPCInferenceService(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
);

export const getVideoURL = ({ audio_url, image }) => {
  return new Promise((resolve, reject) => {
    const request = {
      model_name: "sadTalkerService",
      inputs: [
        {
          name: "image",
          datatype: "BYTES",
          shape: [1],
          contents: {
            byte_contents: [Buffer.from(image)],
          },
        },
        {
          name: "audio_url",
          datatype: "BYTES",
          shape: [1],
          contents: {
            byte_contents: [Buffer.from(audio_url)],
          },
        },
      ],
      outputs: [{ name: "video_url" }],
    };

    client.ModelInfer(request, (err, response) => {
      if (err) {
        console.log(err);
        return reject(`Error during request -> ${err}`);
      }
      const video_url = response.raw_output_contents[0].toString("utf8", 4);
      return resolve({
        video_url,
      });
    });
  });
};
