import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";

function HomeSection() {
  useGSAP(() => {
    const split = SplitText.create(".animated-text", {
      type: "lines,words",
      linesClass: "paragraph-line",
    });

    gsap.from(split.words, {
      autoAlpha: 0,
      yPercent: 150,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.02,
    });

    return () => split.revert();
  }, []);
  return (
    <section className="flex min-h-screen w-full items-center justify-center">
      <div className="flex w-full flex-col lg:flex-row items-center justify-between">
        <div className="max-w-md">
          <h1 className="text-5xl sm:text-[80px] leading-[0.95] uppercase">
            <span className="text-[#00D1FF]"> Frontend</span> <br />{" "}
            <span className="ml-0 lg:ml-4"> Developer</span>
          </h1>
          <p className="text-[18px] sm:text-base leading-[1.55] sm:leading-[1.45] animated-gradient-text tracking-wide">
            Hi, I’m Igor, a Frontend Developer crafting modern web experiences
            that blend speed, visual quality, and maintainable code from launch
            to growth.
          </p>
          <button
            type="button"
            className="group relative mt-7 inline-flex h-9 items-center justify-center gap-2 overflow-hidden rounded-md border border-[#00D1FF]/60 bg-[#00D1FF] px-6 font-semibold text-[#04121c] uppercase outline-none transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,209,255,0.28)] cursor-pointer before:absolute before:inset-0 before:translate-y-full before:bg-[#8bf0ff] before:transition-transform before:duration-300 before:ease-out before:content-[''] hover:before:translate-y-0"
          >
            <span className="relative z-10">My Blog</span>
          </button>
        </div>

        <code className="mt-7 lg:mt-140 xl:mt-100 2xl:mt-140 flex max-w-md md:max-w-xl lg:max-w-sm flex-col text-left text-white">
          <p className="text-[#00D1FF] font-bold text-sm tracking-widest">
            &lt;span&gt;
          </p>
          <p className="pl-2 text-[12px] lg:text-[14px] leading-5.5 tracking-widest md:tracking-widest lg:tracking-normal xl:tracking-widest animated-text block">
            Proficient in the latest web technologies and frameworks,
            continuously expanding my skill set to stay at the forefront of the
            industry.
          </p>
          <p className="text-[#00D1FF] font-bold text-sm tracking-widest">
            &lt;/span&gt;
          </p>
        </code>
      </div>
    </section>
  );
}

export default HomeSection;
