import { v4 as uuidv4 } from "uuid";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("./protocol/integrator.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })
);

const REMOTE_SERVER = `${process.env.CHAT_SERVER}`;

const client = new proto.utopia.brain.integrator.v1.Chatbot(
  REMOTE_SERVER,
  grpc.credentials.createSsl()
);

export const sendMessage = (text) => {
  const request = {
    input_sentence: text,
    user_id: uuidv4(),
    language: "EN_2_EN",
    model: "macri".toUpperCase(),
    mode: "AUDIO",
  };

  return new Promise((resolve, reject) => {
    client.RunBot(request, (error, response) => {
      if (error) return reject(error);
      resolve(response);
    });
  });
};

export const getInfoModel = (request) => {
  const { model, language } = request;
  const params = {
    model: model,
    language: language,
  };

  return new Promise((resolve, reject) => {
    client.GetInfoModel(params, (error, response) => {
      if (error) return reject(error);
      resolve(response);
    });
  });
};

export default sendMessage;
