"use client";

const FormMimic = ({ prompt, setPrompt, handleSubmit, hd, setHd }) => {
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

      <div className="flex-between mx-3 mb-5 gap-4">
        <div>
          <button
            type="submit"
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white hover:bg-orange-700"
            // disabled={processing}
          >
            {/* {processing ? "Generating..." : "Generate"} */}
            Generate
          </button>
        </div>
        <div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              label="HD"
              checked={hd}
              className="sr-only peer"
              onChange={(e) => setHd(!hd)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-orange-300 dark:peer-focus:ring-primary-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-orange"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              HD
            </span>
          </label>
        </div>
      </div>
    </form>
  );
};

export default FormMimic;
