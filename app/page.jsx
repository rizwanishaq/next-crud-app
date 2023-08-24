"use client";
import { tools } from "@utils/routingTool";
import { useRouter } from "next/navigation";
import { cn } from "@utils/utils";

const Home = () => {
  const router = useRouter();
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Discovre & Share
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center">AI Knowledge</span>
      </h1>
      <p className="desc text-center">
        Unlock boundless potential with RiIsBiTech's dynamic full-stack
        knowledge and thrilling projects.
      </p>
      <div className="mt-1 prompt_layout">
        {tools.map((tool) => (
          <div
            className="flex justify-between items-start gap-5"
            key={tool.href}
          >
            <div
              onClick={() => router.push(tool.href)}
              className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center gap-x-4">
                <div className="p-2 w-fit rounded-m orange_gradient">
                  <tool.icon className="w-8 h-8 text-orange-700" />
                </div>
                <div className="font-semibold">{tool.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <Feed /> */}
    </section>
  );
};

export default Home;
