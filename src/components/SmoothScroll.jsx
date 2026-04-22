import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

function SmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 2,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 0.7,
    });

    const update = (time) => {
      lenis.raf(time * 1000);
    };

    const sections = gsap.utils.toArray("[data-snap-section]");
    let snapPoints = [];
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    let snapArmed = !isMobile;
    let lastInputAt = 0;

    const armSnap = () => {
      snapArmed = true;
      lastInputAt = Date.now();
    };

    window.addEventListener("touchstart", armSnap, { passive: true });
    window.addEventListener("wheel", armSnap, { passive: true });
    window.addEventListener("keydown", armSnap);

    const onRefresh = () => {
      lenis.resize();
      const maxScroll = ScrollTrigger.maxScroll(window);

      if (!maxScroll) {
        snapPoints = [0];
        return;
      }

      snapPoints = sections
        .map((section) => section.offsetTop / maxScroll)
        .map((value) => Math.min(Math.max(value, 0), 1))
        .sort((a, b) => a - b);
    };

    lenis.on("scroll", ScrollTrigger.update);
    ScrollTrigger.addEventListener("refresh", onRefresh);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const snapTrigger =
      !isMobile && sections.length > 1
        ? ScrollTrigger.create({
            trigger: document.body,
            start: 0,
            end: "max",
            snap: {
              snapTo: (progress) => {
                if (!snapArmed) {
                  return progress;
                }
                if (Date.now() - lastInputAt > 180) {
                  return progress;
                }
                return snapPoints.length
                  ? gsap.utils.snap(snapPoints, progress)
                  : progress;
              },
              duration: { min: 0.05, max: 0.12 },
              delay: 0,
              directional: true,
              ease: "power4.out",
              inertia: false,
            },
          })
        : null;

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("touchstart", armSnap);
      window.removeEventListener("wheel", armSnap);
      window.removeEventListener("keydown", armSnap);
      lenis.off("scroll", ScrollTrigger.update);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(update);
      snapTrigger?.kill();
      lenis.destroy();
    };
  }, []);

  return null;
}

export default SmoothScroll;
