import {
  FC,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollReveal.css";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  disabled?: boolean;
  containerClassName?: string;
  textClassName?: string;
}

const ScrollReveal: FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  disabled = false,
  containerClassName = "",
  textClassName = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  // Split only strings into words; non-string children render as-is.
  const content = useMemo<ReactNode>(() => {
    if (typeof children !== "string") return children;
    return children.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (disabled) {
      gsap.set(el, { rotate: 0 });
      el.querySelectorAll<HTMLElement>(".word").forEach((w) => {
        gsap.set(w, { opacity: 1, filter: "blur(0px)" });
      });
      return;
    }

    const scrollerEl =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : null;

    const scroller = scrollerEl ?? undefined;

    if (scrollerEl && scrollerEl.scrollHeight <= scrollerEl.clientHeight) {
      gsap.set(el, { rotate: 0 });
      el.querySelectorAll<HTMLElement>(".word").forEach((w) =>
        gsap.set(w, { opacity: 1, filter: "blur(0px)" }),
      );
      return;
    }

    const triggers: ScrollTrigger[] = [];

    const rotateTween = gsap.fromTo(
      el,
      { transformOrigin: "0% 50%", rotate: baseRotation },
      {
        ease: "none",
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      },
    );
    if (rotateTween.scrollTrigger) triggers.push(rotateTween.scrollTrigger);

    const wordElements = el.querySelectorAll<HTMLElement>(".word");
    if (wordElements.length > 0) {
      const opacityTween = gsap.fromTo(
        wordElements,
        { opacity: baseOpacity, willChange: "opacity" },
        {
          ease: "none",
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: "top bottom-=20%",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
      if (opacityTween.scrollTrigger) triggers.push(opacityTween.scrollTrigger);

      if (enableBlur) {
        const blurTween = gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: "none",
            filter: "blur(0px)",
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top bottom-=20%",
              end: "bottom bottom",
              scrub: true,
            },
          },
        );
        if (blurTween.scrollTrigger) triggers.push(blurTween.scrollTrigger);
      }
    }

    triggersRef.current = triggers;

    return () => {
      // Kill ONLY this instance's triggers — never ScrollTrigger.getAll(),
      // which would tear down every other entry's reveal.
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    blurStrength,
    disabled,
    content,
  ]);

  return (
    <div
      ref={containerRef}
      className={`scroll-reveal ${containerClassName}`.trim()}
    >
      <div className={`scroll-reveal-text ${textClassName}`.trim()}>
        {content}
      </div>
    </div>
  );
};

export default ScrollReveal;
