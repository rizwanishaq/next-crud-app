import { ImageIcon, Bot, VideoIcon, FileImage } from "lucide-react";
export const tools = [
  {
    label: "Image Generation",
    icon: ImageIcon,
    href: "/generate-image",
  },
  {
    label: "Video Generation from Image",
    icon: FileImage,
    href: "/generate-video-from-image",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    href: "/generate-video",
  },
  {
    label: "TTS Avatar",
    icon: Bot,
    href: "/tts-avatar",
  },
];
