"use client";

const FormMimic = ({ prompt, setPrompt, handleSubmit }) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
    >
      <label>
        <span className="font-satoshi font-semibold text-base text-gray-700">
          Your Prompt
        </span>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Write your post here"
          required
          className="form_textarea "
        />
      </label>

      <div className="flex-end mx-3 mb-5 gap-4">
        <button
          type="submit"
          className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white hover:bg-orange-700"
          // disabled={processing}
        >
          {/* {processing ? "Generating..." : "Generate"} */}
          Generate
        </button>
      </div>
    </form>
  );
};

export default FormMimic;
