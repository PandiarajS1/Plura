import { ModeToggle } from "@/globals/mode-toggle";
import { currentUser, UserButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  user?: null | User;
};

const Navigation = ({ user }: Props) => {
  return (
    <main className="p-4 flex items-center justify-between relative">
      <aside className="flex items-center gap-2">
        <Image
          src={"/assests/logo.png"}
          width={40}
          height={40}
          alt="plura logo"
        />
        <span className="text-xl font-bold">Plura.</span>
      </aside>
      <nav
        className="hidden md:block absolute left-[50%] top-[50%] 
      transform translate-x-[-50%] translate-y-[-50%]"
      >
        <ul className="flex justify-center items-center gap-8">
          <Link href={"#"}>Pricing</Link>
          <Link href={"#"}>About</Link>
          <Link href={"#"}>Documentation</Link>
          <Link href={"#"}>Features</Link>
        </ul>
      </nav>
      <aside className="flex gap-4 items-center">
        <ModeToggle />
        <Link
          href={"/agency"}
          className="bg-primary text-white text-center p-1.5 px-4 rounded-md hover:bg-primary/80"
        >
          {user ? "Dashboard" : "Get Started"}
        </Link>
        <UserButton />
      </aside>
    </main>
  );
};

export default Navigation;
