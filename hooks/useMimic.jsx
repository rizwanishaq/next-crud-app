"use client";
import { useContext } from "react";
import { MimicContext } from "@contexts/MimicContext";

export const useMimic = () => {
  return useContext(MimicContext);
};
