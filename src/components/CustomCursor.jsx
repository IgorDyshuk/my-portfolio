import { useEffect, useRef } from "react";
import "./CustomCursor.css";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "[role='button']",
  "input",
  "textarea",
  "select",
  "label",
  "[data-cursor='pointer']",
].join(",");

function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!hasFinePointer || prefersReducedMotion) {
      return undefined;
    }

    const dotEl = dotRef.current;
    const ringEl = ringRef.current;

    if (!dotEl || !ringEl) {
      return undefined;
    }

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dot = { ...target };
    const ring = { ...target };
    const scale = { dot: 1, ring: 1 };

    let rafId = 0;
    let isVisible = false;
    let isInteractive = false;
    let isPressed = false;

    const syncStateClasses = () => {
      dotEl.classList.toggle("is-visible", isVisible);
      ringEl.classList.toggle("is-visible", isVisible);
      dotEl.classList.toggle("is-interactive", isInteractive);
      ringEl.classList.toggle("is-interactive", isInteractive);
      dotEl.classList.toggle("is-pressed", isPressed);
      ringEl.classList.toggle("is-pressed", isPressed);
    };

    const setInteractiveFromTarget = (eventTarget) => {
      if (!(eventTarget instanceof Element)) {
        if (isInteractive) {
          isInteractive = false;
          syncStateClasses();
        }
        return;
      }

      const nextInteractive = Boolean(
        eventTarget.closest(INTERACTIVE_SELECTOR)
      );

      if (nextInteractive !== isInteractive) {
        isInteractive = nextInteractive;
        syncStateClasses();
      }
    };

    const animate = () => {
      dot.x += (target.x - dot.x) * 0.38;
      dot.y += (target.y - dot.y) * 0.38;
      ring.x += (target.x - ring.x) * 0.16;
      ring.y += (target.y - ring.y) * 0.16;

      const dotScaleTarget = isPressed ? 0.56 : isInteractive ? 0.72 : 1;
      const ringScaleTarget = isPressed ? 0.86 : isInteractive ? 1.5 : 1;

      // Smoothly ease hover/press state changes to avoid abrupt scale jumps.
      scale.dot += (dotScaleTarget - scale.dot) * 0.2;
      scale.ring += (ringScaleTarget - scale.ring) * 0.15;

      dotEl.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%) scale(${scale.dot})`;
      ringEl.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${scale.ring})`;

      rafId = window.requestAnimationFrame(animate);
    };

    const handleMouseMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      setInteractiveFromTarget(event.target);

      if (!isVisible) {
        isVisible = true;
        dot.x = target.x;
        dot.y = target.y;
        ring.x = target.x;
        ring.y = target.y;
        syncStateClasses();
      }
    };

    const handleMouseLeave = () => {
      if (!isVisible) {
        return;
      }
      isVisible = false;
      syncStateClasses();
    };

    const handleMouseEnter = () => {
      if (isVisible) {
        return;
      }
      isVisible = true;
      syncStateClasses();
    };

    const handleMouseDown = () => {
      if (isPressed) {
        return;
      }
      isPressed = true;
      syncStateClasses();
    };

    const handleMouseUp = () => {
      if (!isPressed) {
        return;
      }
      isPressed = false;
      syncStateClasses();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    syncStateClasses();
    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      root.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="custom-cursor custom-cursor-ring" />
      <div ref={dotRef} className="custom-cursor custom-cursor-dot" />
    </>
  );
}

export default CustomCursor;
