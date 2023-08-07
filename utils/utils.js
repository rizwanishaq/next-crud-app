import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

import fs from "fs";
export const createFile = (id) => {
  const name = `${id}.wav`;
  return fs.createWriteStream(name);
};

export const deleteFile = (fileName) => {
  fs.unlink(fileName, (err) => {
    if (err) {
      console.log(err);
    }
    console.log(`${fileName} - deleted`);
  });
};
