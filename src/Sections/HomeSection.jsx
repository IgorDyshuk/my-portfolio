import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HOME_WAVE_DESKTOP = {
  start: "top -30%",
  end: "bottom 8%",
  scrub: true,
  fade: {
    autoAlpha: 0,
    at: 0.1,
    duration: 0.3,
  },
  steps: {
    title: {
      yPercent: -30,
      at: 0,
      duration: 0.2,
    },
    infoText: {
      yPercent: -42,
      at: 0.07,
      duration: 0.2,
    },
    blogButton: {
      yPercent: -54,
      at: 0.14,
      duration: 0.2,
    },
    code: {
      yPercent: -78,
      at: 0.2,
      duration: 0.22,
    },
  },
};

const HOME_WAVE_MOBILE = {
  start: "top 8%",
  end: "bottom -5%",
  scrub: true,
  fade: {
    autoAlpha: 0.1,
    at: 0.14,
    duration: 0.22,
  },
  steps: {
    title: {
      yPercent: -16,
      at: 0,
      duration: 0.22,
    },
    infoText: {
      yPercent: -22,
      at: 0.07,
      duration: 0.22,
    },
    blogButton: {
      yPercent: -60,
      at: 0.16,
      duration: 0.25,
    },
    code: {
      yPercent: -60,
      at: 0.2,
      duration: 0.24,
    },
  },
};

function HomeSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const infoTextRef = useRef(null);
  const blogButtonRef = useRef(null);
  const codeRef = useRef(null);

  useGSAP(
    () => {
      const animatedText = sectionRef.current?.querySelector(".animated-text");
      const split = animatedText
        ? SplitText.create(animatedText, {
            type: "lines,words",
            linesClass: "paragraph-line",
          })
        : null;

      if (split) {
        gsap.from(split.words, {
          autoAlpha: 0,
          yPercent: 150,
          duration: 0.5,
          ease: "power1.out",
          stagger: 0.02,
        });
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const mm = gsap.matchMedia();

      const createWaveTimeline = (config) => {
        if (
          !sectionRef.current ||
          !titleRef.current ||
          !infoTextRef.current ||
          !blogButtonRef.current ||
          !codeRef.current
        ) {
          return null;
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: config.start,
            end: config.end,
            scrub: config.scrub,
          },
        });

        tl.to(
          contentRef.current,
          {
            autoAlpha: config.fade.autoAlpha,
            duration: config.fade.duration,
            ease: "none",
          },
          config.fade.at,
        );

        tl.to(
          titleRef.current,
          {
            yPercent: config.steps.title.yPercent,
            duration: config.steps.title.duration,
            ease: "none",
          },
          config.steps.title.at,
        );

        tl.to(
          infoTextRef.current,
          {
            yPercent: config.steps.infoText.yPercent,
            duration: config.steps.infoText.duration,
            ease: "none",
          },
          config.steps.infoText.at,
        );

        tl.to(
          blogButtonRef.current,
          {
            yPercent: config.steps.blogButton.yPercent,
            duration: config.steps.blogButton.duration,
            ease: "none",
          },
          config.steps.blogButton.at,
        );

        tl.to(
          codeRef.current,
          {
            yPercent: config.steps.code.yPercent,
            duration: config.steps.code.duration,
            ease: "none",
          },
          config.steps.code.at,
        );

        return tl;
      };

      if (!prefersReducedMotion) {
        mm.add("(max-width: 767px)", () => {
          const mobileWaveTl = createWaveTimeline(HOME_WAVE_MOBILE);
          return () => mobileWaveTl?.kill();
        });

        mm.add("(min-width: 768px)", () => {
          const desktopWaveTl = createWaveTimeline(HOME_WAVE_DESKTOP);
          return () => desktopWaveTl?.kill();
        });
      }

      return () => {
        split?.revert();
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-snap-section
      className="flex mt-20 md:mt-0 md:min-h-screen w-full items-center justify-center"
    >
      <div
        ref={contentRef}
        className="flex w-full flex-col lg:flex-row items-center justify-between"
      >
        <div className="max-w-md">
          <h1
            ref={titleRef}
            className="text-5xl sm:text-[80px] leading-[0.95] uppercase"
          >
            <span className="accent"> Frontend</span> <br />{" "}
            <span className="ml-0 lg:ml-4"> Developer</span>
          </h1>
          <div ref={blogButtonRef}>
            <p
              ref={infoTextRef}
              className="text-[18px] sm:text-base leading-[1.55] sm:leading-[1.45] animated-gradient-text tracking-wide"
            >
              Hi, I’m Igor, a Frontend Developer crafting modern web experiences
              that blend speed, visual quality, and maintainable code from
              launch to growth.
            </p>
            <button
              type="button"
              className="accent-bg accent-border accent-contrast accent-hover-glow accent-before group relative mt-7 inline-flex h-9 items-center justify-center gap-2 overflow-hidden rounded-md border px-6 font-semibold uppercase outline-none transition-all duration-300 ease-out hover:-translate-y-0.5 cursor-pointer before:absolute before:inset-0 before:translate-y-full before:transition-transform before:duration-300 before:ease-out before:content-[''] hover:before:translate-y-0"
            >
              <span className="relative z-10">My Blog</span>
            </button>
          </div>
        </div>

        <code
          ref={codeRef}
          className="mt-7 lg:mt-140 xl:mt-100 2xl:mt-140 flex max-w-md md:max-w-xl lg:max-w-sm flex-col text-left text-white"
        >
          <p className="text-[#00D1FF] font-bold text-sm tracking-widest">
            &lt;span&gt;
          </p>
          <p className="pl-2 text-[12px] lg:text-[14px] leading-5.5 tracking-widest md:tracking-widest lg:tracking-normal xl:tracking-widest animated-text block">
            Proficient in the latest web technologies and frameworks,
            continuously expanding my skill set to stay at the forefront of the
            industry.
          </p>
          <p className="accent font-bold text-sm tracking-widest">
            &lt;/span&gt;
          </p>
        </code>
      </div>
    </section>
  );
}

export default HomeSection;
