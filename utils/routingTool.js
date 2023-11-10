import {
  ImageIcon,
  Bot,
  VideoIcon,
  FileImage,
  UserCog2,
  UserPlus,
} from "lucide-react";
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
  {
    label: "Real-time Avatar",
    icon: UserCog2,
    href: "/real-time-avatar",
  },
  {
    label: "Denoiser",
    icon: UserPlus,
    href: "/denoiser",
  },
  {
    label: "Speech-to-Text",
    icon: UserPlus,
    href: "/speech-to-text",
  },
];
