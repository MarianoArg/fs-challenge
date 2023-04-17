import { Outlet } from "@remix-run/react";
import Logo from "~/assets/logo.svg";
import Person1 from "~/assets/person1.png";
import Person2 from "~/assets/person2.png";

export default function PublicLayout() {
  return (
    <main className="flex h-full min-h-screen w-full bg-white">
      <div className="relative hidden w-1/2 flex-wrap justify-center bg-gradient-to-b from-transparent to-skyBlue/[0.6] p-8 lg:flex">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex items-center gap-4">
            <img src={Logo} className="w-12" alt="Simpledo Logo" />
            <h1 className="text-5xl font-extrabold text-[#4B4BE0]">SimpleDo</h1>
          </div>
          <p className="mt-6 text-xl font-semibold text-slate-600">
            Get things done with ease - one task at a time!
          </p>
        </div>
        <div className="relative flex h-max grow-0 p-8">
          <div className="absolute inset-0 z-0 m-auto h-[250px] w-[500px]	rotate-12 rounded-[2rem] bg-[#57A4F7] mix-blend-overlay"></div>
          <div className="absolute inset-0 z-0 m-auto h-[250px] w-[500px]	-rotate-12 rounded-[2rem] bg-[#8453ED] mix-blend-overlay"></div>
          <img
            src={Person1}
            className="relative w-72"
            alt="Person taking notes"
          />
          <img
            src={Person2}
            className="relative w-72"
            alt="Person taking notes and pointing"
          />
        </div>
      </div>
      <div className="flex w-full flex-wrap items-center justify-center bg-paleGrey sm:pb-16 sm:pt-8 lg:w-1/2 lg:flex-col">
        <div className="flex items-center justify-center gap-4 lg:hidden">
          <img src={Logo} className="w-12" alt="Simpledo Logo" />
          <h1 className="text-5xl font-extrabold text-skyBlue">
            Simple<span className="text-coolPurple">Do</span>
          </h1>
        </div>
        <div className="flex h-max w-full grow-0 self-baseline">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
