"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    <section className="w-full max-w-full flex-center flex-col">
      <form
        onSubmit={handleSubmit}
        className="mt-1 w-full max-w-lg flex flex-col gap-1 glassmorphism"
      >
        <Image
          width={512}
          height={512}
          alt="generated image"
          src={
            processing
              ? "/assets/icons/loader.svg"
              : `data:image/jpg;base64,${image}`
          }
          className="mt-1 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
        />
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
