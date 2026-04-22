import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Mobile-only About section reveal settings.
const ABOUT_MOBILE_ANIMATION = {
  useScrub: true,
  headline: {
    fromY: 52,
    start: "top 85%",
    end: "top 5%",
    scrub: true,
    duration: 1,
    ease: "power3.out",
  },
  info: {
    fromY: 60,
    start: "top 90%",
    end: "top 10%",
    scrub: true,
    duration: 2,
    ease: "power1.out",
    stagger: 0.08,
  },
};

// Desktop/tablet About section reveal settings.
const ABOUT_DESKTOP_ANIMATION = {
  useScrub: true,
  headline: {
    fromY: 46,
    start: "top 85%",
    end: "top 62%",
    scrub: true,
    duration: 0.9,
    ease: "power1.out",
  },
  info: {
    fromY: 36,
    start: "top 96%",
    end: "top 34%",
    scrub: true,
    duration: 0.8,
    ease: "power1.out",
    stagger: 0.1,
  },
};

// Mobile-only About info exit settings.
const ABOUT_MOBILE_EXIT_ANIMATION = {
  useScrub: true,
  fade: {
    autoAlpha: 0.01,
    at: 0.7,
    duration: 2,
  },
  info: {
    toY: -50,
    start: "bottom 35%",
    end: "bottom -20%",
    scrub: true,
    duration: 3,
    ease: "power1.out",
    stagger: 0.08,
  },
};

// Desktop/tablet About info exit settings.
const ABOUT_DESKTOP_EXIT_ANIMATION = {
  useScrub: true,
  fade: {
    autoAlpha: 0.05,
    at: 0.4,
    duration: 2,
  },
  info: {
    toY: -30,
    start: "top 8%",
    end: "top -40%",
    scrub: true,
    duration: 0.8,
    ease: "power1.out",
    stagger: 0.1,
  },
};

function AboutSection() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const infoTriggerRef = useRef(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const mm = gsap.matchMedia();

      if (prefersReducedMotion) {
        return () => mm.revert();
      }

      const runAboutReveal = (config, exitConfig) => {
        const infoItems = gsap.utils.toArray(".about-info-reveal");
        if (
          !headlineRef.current ||
          !infoItems.length ||
          !infoTriggerRef.current
        ) {
          return undefined;
        }

        gsap.set(headlineRef.current, {
          autoAlpha: 0,
          y: config.headline.fromY,
        });

        const textInfoItems = infoItems.filter(
          (item) => item.textContent?.trim().length > 0,
        );
        const nonTextInfoItems = infoItems.filter(
          (item) => !textInfoItems.includes(item),
        );
        const infoSplits = textInfoItems.map((item) =>
          SplitText.create(item, {
            type: "lines",
            linesClass: "about-info-line",
          }),
        );
        const infoLines = infoSplits.flatMap((split) => split.lines);

        gsap.set(nonTextInfoItems, {
          autoAlpha: 0,
          y: config.info.fromY,
        });
        gsap.set(infoLines, {
          autoAlpha: 0,
          y: config.info.fromY,
        });

        const headlineTrigger = config.useScrub
          ? {
              trigger: headlineRef.current,
              start: config.headline.start,
              end: config.headline.end,
              scrub: config.headline.scrub,
            }
          : {
              trigger: headlineRef.current,
              start: config.headline.start,
              once: true,
            };

        const headlineTl = gsap.timeline({
          scrollTrigger: headlineTrigger,
        });

        headlineTl.to(headlineRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: config.headline.duration ?? 0.9,
          ease: config.headline.ease ?? "power3.out",
        });

        const infoTrigger = config.useScrub
          ? {
              trigger: infoTriggerRef.current,
              start: config.info.start,
              end: config.info.end,
              scrub: config.info.scrub,
            }
          : {
              trigger: infoTriggerRef.current,
              start: config.info.start,
              once: true,
            };

        const infoTl = gsap.timeline({
          scrollTrigger: infoTrigger,
          markers: true,
        });

        if (nonTextInfoItems.length) {
          infoTl.to(
            nonTextInfoItems,
            {
              autoAlpha: 1,
              y: 0,
              duration: config.info.duration ?? 0.8,
              ease: config.info.ease ?? "power1.out",
              stagger: config.info.stagger ?? 0.1,
            },
            0,
          );
        }

        if (infoLines.length) {
          infoTl.to(
            infoLines,
            {
              autoAlpha: 1,
              y: 0,
              duration: config.info.duration ?? 0.8,
              ease: config.info.ease ?? "power1.out",
              stagger: config.info.stagger ?? 0.1,
            },
            0,
          );
        }

        const infoExitTrigger = exitConfig.useScrub
          ? {
              trigger: infoTriggerRef.current,
              start: exitConfig.info.start,
              end: exitConfig.info.end,
              scrub: exitConfig.info.scrub,
            }
          : {
              trigger: infoTriggerRef.current,
              start: exitConfig.info.start,
              once: true,
            };

        const infoExitTl = gsap.timeline({
          scrollTrigger: infoExitTrigger,
        });

        const infoExitTargets = [...nonTextInfoItems, ...infoLines];
        if (infoExitTargets.length) {
          infoExitTl.to(
            infoExitTargets,
            {
              autoAlpha: exitConfig.fade.autoAlpha,
              duration: exitConfig.fade.duration,
              ease: "none",
            },
            exitConfig.fade.at,
          );
        }

        if (nonTextInfoItems.length) {
          infoExitTl.to(
            nonTextInfoItems,
            {
              y: exitConfig.info.toY,
              duration: exitConfig.info.duration ?? 0.8,
              ease: exitConfig.info.ease ?? "power1.out",
              stagger: exitConfig.info.stagger ?? 0.1,
            },
            0,
          );
        }

        if (infoLines.length) {
          infoExitTl.to(
            infoLines,
            {
              y: exitConfig.info.toY,
              duration: exitConfig.info.duration ?? 0.8,
              ease: exitConfig.info.ease ?? "power1.out",
              stagger: exitConfig.info.stagger ?? 0.1,
            },
            0,
          );
        }

        return () => {
          headlineTl.kill();
          infoTl.kill();
          infoExitTl.kill();
          infoSplits.forEach((split) => split.revert());
        };
      };

      mm.add("(max-width: 767px)", () =>
        runAboutReveal(ABOUT_MOBILE_ANIMATION, ABOUT_MOBILE_EXIT_ANIMATION),
      );
      mm.add("(min-width: 768px)", () =>
        runAboutReveal(ABOUT_DESKTOP_ANIMATION, ABOUT_DESKTOP_EXIT_ANIMATION),
      );

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-snap-section
      className="w-full pb-24 pt-35 sm:pb-32 sm:pt-20"
    >
      <div className="space-y-12 sm:space-y-16">
        <h2
          ref={headlineRef}
          className="text-3xl md:text-5xl leading-none lg:leading-[0.98] pt-0.5 mb-10 sm:mb-18 font-medium tracking-[0.01em] animated-gradient-text"
        >
          I design with people first, shaping each project around real user
          behavior, clear goals, and the context where the
        </h2>

        <div ref={infoTriggerRef} className="my-7">
          <p className="about-info-reveal text-sm leading-none text-gray-400 pb-3">
            This is me.
          </p>

          <div className="about-info-reveal h-0.25 w-full bg-white/65" />

          <div className="info-blocks grid gap-4 mt-7 md:mt-7 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
            <div className="space-y-4">
              <h2 className="about-info-reveal text-3xl sm:text-4xl font-semibold tracking-tight text-white ">
                I&apos;m Igor.
              </h2>
              <p className="about-info-reveal max-w-md text-sm sm:text-[18px] text-white/75">
                Frontend developer building modern, responsive web interfaces
                with clean UI, stable architecture, and measurable performance.
              </p>
            </div>

            <div className="space-y-4 max-w-100 text-sm sm:text-[18px] text-white/75">
              <p className="about-info-reveal">
                Based in Europe, I work on product interfaces from concept to
                release, turning business ideas into clear and intuitive
                interactions.
              </p>
              <p className="about-info-reveal">
                My approach combines accessibility, performance, and
                maintainability, so teams can ship fast without creating
                long-term technical friction.
              </p>
              <p className="about-info-reveal">
                I focus on the details users notice immediately: hierarchy,
                spacing, typography, and motion that makes every screen feel
                purposeful.
              </p>
            </div>
          </div>
        </div>

        <div className="about-info-reveal mt-13 md:mt-18 w-full text-center accent sm:text-base lg:text-2xl">
          I CAN’T STOP TURNING IDEAS INTO CLEAN INTERFACES.
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
