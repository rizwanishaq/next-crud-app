"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loader from "@components/Loader";
// import axios from "axios";

const GenerateImagePage = () => {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [processing, setProcessing] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setImage("");
      setProcessing(true);
      const response = await fetch("/api/generate-image", {
        method: "POST",
        body: JSON.stringify({
          prompt: prompt,
        }),
      });
      const { imageUrl } = await response.json();
      setImage(imageUrl);
      setProcessing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setProcessing(false);
      router.refresh();
    }
  };

  return (
    <section className="w-full max-w-full flex-start flex-col">
      <h1 className="head_text text-left">
        <span className="blue_gradient">Generate Image</span>
      </h1>
      <p className="desc text-left max-w-md">
        Generate and share amazing prompts with the world, and let your
        imagination run wild with any AI-powered platform
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-1 w-full max-w-lg flex flex-col gap-1 glassmorphism"
      >
        {processing ? (
          <Loader desc="generating image" />
        ) : (
          <>
            <Image
              width={512}
              height={512}
              alt="generated image"
              src={`data:image/jpg;base64,${image}`}
              className="mt-1 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
            />
          </>
        )}

        {/* <p className="font-inter text-sm text-gray-500">{prompt}</p> */}
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Prompt
          </span>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            type="text"
            placeholder="Write a prompt to generate image"
            required
            className="form_input"
          />
        </label>
        <div className="flex-end mx-3 mb-5 gap-4">
          <button
            type="submit"
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white hover:bg-orange-700"
            disabled={processing}
          >
            {processing ? "Generating..." : "Generate"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default GenerateImagePage;
