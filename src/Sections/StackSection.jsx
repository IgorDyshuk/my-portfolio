import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import stackIcon from "../assets/stack-icon.svg";
import StackRender from "../components/StackRender";
import { STACK_TECH, STACK_TOOLS } from "../data/stackData";

gsap.registerPlugin(ScrollTrigger);

const STACK_REVEAL_MOBILE = {
  frontend: {
    fromY: 36,
    fadeFrom: 0,
    start: "top 86%",
    end: "top 20%",
    scrub: true,
    labelDuration: 3,
    itemsDuration: 2,
    stagger: 1,
    ease: "sine.inOut",
  },
  tools: {
    fromY: 36,
    fadeFrom: 0,
    start: "top 90%",
    end: "top 54%",
    scrub: true,
    labelDuration: 3,
    itemsDuration: 2,
    stagger: 1,
    ease: "sine.inOut",
  },
};

const STACK_REVEAL_DESKTOP = {
  frontend: {
    fromY: 30,
    fadeFrom: 0,
    start: "top 86%",
    end: "top 40%",
    scrub: true,
    labelDuration: 3,
    itemsDuration: 2,
    stagger: 1,
    ease: "sine.inOut",
  },
  tools: {
    fromY: 28,
    fadeFrom: 0,
    start: "top 80%",
    end: "top 60%",
    scrub: true,
    labelDuration: 3,
    itemsDuration: 2,
    stagger: 1,
    ease: "power1.inOut",
  },
};

const STACK_EXIT_MOBILE = {
  start: "top -90%",
  end: "bottom -110%",
  scrub: true,
  yPercent: -50,
  fadeTo: -4,
};

const STACK_EXIT_DESKTOP = {
  start: "top -5%",
  end: "bottom -30%",
  scrub: true,
  yPercent: -50,
  fadeTo: -1.5,
};

function StackSection() {
  const sectionRef = useRef(null);
  const frontendLabelRef = useRef(null);
  const frontendListRef = useRef(null);
  const toolsLabelRef = useRef(null);
  const toolsListRef = useRef(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const mm = gsap.matchMedia();
      const timelines = [];

      if (prefersReducedMotion) {
        return () => mm.revert();
      }

      const createGroupReveal = ({ labelRef, listRef, config }) => {
        if (!labelRef.current || !listRef.current) {
          return null;
        }

        const items = Array.from(listRef.current.children);
        if (!items.length) {
          return null;
        }

        gsap.set([labelRef.current, ...items], {
          y: config.fromY,
          autoAlpha: config.fadeFrom,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: labelRef.current,
            start: config.start,
            end: config.end,
            scrub: config.scrub,
          },
        });

        tl.to(labelRef.current, {
          y: 0,
          autoAlpha: 1,
          duration: config.labelDuration,
          ease: config.ease,
        }).to(
          items,
          {
            y: 0,
            autoAlpha: 1,
            duration: config.itemsDuration,
            stagger: config.stagger,
            ease: config.ease,
          },
          ">",
        );

        return tl;
      };

      const createSectionExit = (config) => {
        if (!sectionRef.current) {
          return null;
        }

        return gsap.to(sectionRef.current, {
          yPercent: config.yPercent,
          autoAlpha: config.fadeTo,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: config.start,
            end: config.end,
            scrub: config.scrub,
          },
        });
      };

      mm.add("(max-width: 767px)", () => {
        const frontendTl = createGroupReveal({
          labelRef: frontendLabelRef,
          listRef: frontendListRef,
          config: STACK_REVEAL_MOBILE.frontend,
        });
        const toolsTl = createGroupReveal({
          labelRef: toolsLabelRef,
          listRef: toolsListRef,
          config: STACK_REVEAL_MOBILE.tools,
        });
        const exitTl = createSectionExit(STACK_EXIT_MOBILE);

        if (frontendTl) timelines.push(frontendTl);
        if (toolsTl) timelines.push(toolsTl);
        if (exitTl) timelines.push(exitTl);

        return () => {
          frontendTl?.kill();
          toolsTl?.kill();
          exitTl?.kill();
        };
      });

      mm.add("(min-width: 768px)", () => {
        const frontendTl = createGroupReveal({
          labelRef: frontendLabelRef,
          listRef: frontendListRef,
          config: STACK_REVEAL_DESKTOP.frontend,
        });
        const toolsTl = createGroupReveal({
          labelRef: toolsLabelRef,
          listRef: toolsListRef,
          config: STACK_REVEAL_DESKTOP.tools,
        });
        const exitTl = createSectionExit(STACK_EXIT_DESKTOP);

        if (frontendTl) timelines.push(frontendTl);
        if (toolsTl) timelines.push(toolsTl);
        if (exitTl) timelines.push(exitTl);

        return () => {
          frontendTl?.kill();
          toolsTl?.kill();
          exitTl?.kill();
        };
      });

      return () => {
        timelines.forEach((timeline) => timeline.kill());
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="mt-18">
      <div className="flex items-center gap-2">
        <img
          src={stackIcon}
          alt=""
          aria-hidden="true"
          className="h-5 w-5 animate-spin [animation-duration:1s] text-white opacity-70"
        />
        <h1 className="uppercase pt-1">My Stack</h1>
      </div>
      <div className="flex flex-col md:flex-row items-start mt-8">
        <h1
          ref={frontendLabelRef}
          className="flex-3 uppercase text-4xl pb-8 md:pb-0"
        >
          Frontend
        </h1>
        <div
          ref={frontendListRef}
          className="flex-4 flex flex-wrap gap-8 gap-y-8"
        >
          {STACK_TECH.map((stack) => (
            <StackRender key={stack.id} stack={stack} />
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start mt-20">
        <h1
          ref={toolsLabelRef}
          className="flex-3 uppercase text-4xl pb-8 md:pb-0"
        >
          Tools
        </h1>
        <div ref={toolsListRef} className="flex-4 flex flex-wrap gap-8 gap-y-8">
          {STACK_TOOLS.map((stack) => (
            <StackRender key={stack.id} stack={stack} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default StackSection;
