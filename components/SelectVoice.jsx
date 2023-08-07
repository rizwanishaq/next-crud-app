"use client";

const SelectVoice = ({ voices, setVoice }) => {
  return (
    <>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Select a voice
      </label>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={(e) => setVoice(e.target.value)}
      >
        {voices.map((voice) => (
          <option key={voice} value={voice}>
            {voice}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectVoice;
