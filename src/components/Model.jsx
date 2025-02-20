import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Model() {
  useGSAP(() => {
    gsap.to("#welcome", {
      opacity: 1,
      y: -30,
      ease: "back.inOut",
    });
  }, []);

  return (
    <section className="mt-10 pt-20 bg-[#111827] ">
      <div
        id="welcome"
        className="screen-max-width text-center text-5xl text-white font-semibold hover:tracking-widest transition-all "
      >
        Welcome
      </div>
    </section>
  );
}
