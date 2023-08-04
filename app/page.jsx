import Feed from "@components/Feed";
import Image from "next/image";

const Home = () => {
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

      <Feed />
    </section>
  );
};

export default Home;
