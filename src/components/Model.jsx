import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Scene from "./Scene";

export default function Model() {
  useGSAP(() => {
    gsap.fromTo(
      "#welcome",
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 2,
        // scale: 1.4,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <section className="mt-10 pt-20 bg-[#111827] h-screen overflow-hidden">
      <div className="screen-max-width">
        <div
          id="welcome"
          className="screen-max-width text-center text-6xl font-bold text-white"
        >
          Welcome
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full h-[75vh] overflow-hidden relative ">
            <Scene />
          </div>
        </div>
      </div>
    </section>
  );
}