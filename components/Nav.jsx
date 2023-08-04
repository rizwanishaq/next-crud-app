"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Grip } from "lucide-react";

const Nav = () => {
  const isUserLoggedIn = true;

  const [toggleDropdown, setToggleDropdown] = useState(false);

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/assets/images/logo.svg"
          alt="Promptopia Logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">Promptopia</p>
      </Link>

      {/* Desktop  Navigation */}
      <div className="sm:flex hidden">
        <div className="flex gap-3 md:gap-5">
          <Link href="/create-prompt" className="black_btn">
            Create Post
          </Link>

          {/* <Link href="/profile"> */}
          <Grip />
          {/* </Link> */}
        </div>
      </div>

      {/* Mobile Navigation  */}
      <div className="sm:hidden flex relative">
        <div className="flex">
          <Grip onClick={() => setToggleDropdown((prev) => !prev)} />

          {toggleDropdown && (
            <div className="dropdown">
              <Link
                href="/create-prompt"
                className="dropdown_link"
                onClick={() => setToggleDropdown(false)}
              >
                Create Prompt
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;