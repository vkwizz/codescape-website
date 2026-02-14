// components/ProjectSlider.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './ProjectSlider.module.css';

const SLIDES = [
  {
    name: "E-Commerce",
    color: "#667eea",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80"
  },
  {
    name: "AI Dashboard",
    color: "#f093fb",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"
  },
  {
    name: "Healthcare",
    color: "#4facfe",
    image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600&q=80"
  },
  {
    name: "Banking App",
    color: "#fa709a",
    image: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=600&q=80"
  },
  {
    name: "IoT Platform",
    color: "#30cfd0",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80"
  },
  {
    name: "EdTech",
    color: "#a8edea",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80"
  }
];

const AUTOPLAY_DELAY = 4000;

const throttle = (callback, limit) => {
  let waiting = false;
  return function (...args) {
    if (!waiting) {
      callback.apply(this, args);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
};

const debounce = (func, wait, immediate) => {
  let timeout;
  return function (...args) {
    const context = this;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export default function ProjectSlider() {
  const sliderRef = useRef(null);
  const titleRef = useRef(null);
  const imagesRef = useRef(null);
  const cursorRef = useRef(null);
  const currentRef = useRef(0);
  const animatingRef = useRef(false);
  const slideElsRef = useRef([]);
  const currentLineRef = useRef(null);
  const cursorVisibleRef = useRef(false);
  const autoPlayIdRef = useRef(null);
  const cursorMoveXRef = useRef(null);
  const cursorMoveYRef = useRef(null);
  const reducedMotionRef = useRef(false);

  const total = SLIDES.length;

  const mod = (n) => {
    return ((n % total) + total) % total;
  };

  const preloadImages = () => {
    SLIDES.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  };

  const buildCursor = () => {
    if (!cursorRef.current || !sliderRef.current) return;
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50, opacity: 0 });
    cursorMoveXRef.current = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.5,
      ease: "power3"
    });
    cursorMoveYRef.current = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.5,
      ease: "power3"
    });
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayIdRef.current = setInterval(() => {
      if (!animatingRef.current) go("next");
    }, AUTOPLAY_DELAY);
  };

  const stopAutoPlay = () => {
    if (autoPlayIdRef.current) {
      clearInterval(autoPlayIdRef.current);
      autoPlayIdRef.current = null;
    }
  };

  const setTitle = (text) => {
    if (!titleRef.current) return;
    titleRef.current.innerHTML = "";
    const line = document.createElement("div");
    [...text].forEach((ch) => {
      const span = document.createElement("span");
      span.textContent = ch === " " ? "\u00A0" : ch;
      line.appendChild(span);
    });
    titleRef.current.appendChild(line);
    currentLineRef.current = line;
  };

  const animateTitle = (newText, direction) => {
    if (!titleRef.current || !currentLineRef.current) return gsap.timeline();
    
    const h = titleRef.current.offsetHeight;
    const dir = direction === "next" ? 1 : -1;
    const oldLine = currentLineRef.current;
    const oldChars = [...oldLine.querySelectorAll("span")];

    titleRef.current.style.height = h + "px";
    oldLine.style.cssText = "position:absolute;top:0;left:0;width:100%";

    const newLine = document.createElement("div");
    newLine.style.cssText = "position:absolute;top:0;left:0;width:100%";
    [...newText].forEach((ch) => {
      const span = document.createElement("span");
      span.textContent = ch === " " ? "\u00A0" : ch;
      newLine.appendChild(span);
    });
    titleRef.current.appendChild(newLine);

    const newChars = [...newLine.querySelectorAll("span")];
    gsap.set(newChars, { y: h * dir });

    const duration = reducedMotionRef.current ? 0.01 : 1;
    const stagger = reducedMotionRef.current ? 0 : 0.04;

    const tl = gsap.timeline({
      onComplete: () => {
        oldLine.remove();
        newLine.style.cssText = "";
        gsap.set(newChars, { clearProps: "all" });
        titleRef.current.style.height = "";
        currentLineRef.current = newLine;
      }
    });

    tl.to(oldChars, { y: -h * dir, stagger: stagger, duration: duration, ease: "expo.inOut" }, 0);
    tl.to(newChars, { y: 0, stagger: stagger, duration: duration, ease: "expo.inOut" }, 0);

    return tl;
  };

  const makeSlide = (idx) => {
    const div = document.createElement("div");
    div.className = styles.slider__slide;
    const img = document.createElement("img");
    img.src = SLIDES[idx].image;
    img.alt = SLIDES[idx].name;
    img.width = 600;
    img.height = 420;
    div.appendChild(img);
    return div;
  };

  const getSlideProps = (step) => {
    if (!imagesRef.current) return {};
    const h = imagesRef.current.offsetHeight;
    const absStep = Math.abs(step);
    const positions = [
      { x: -0.35, y: -0.95, rot: -30, s: 1.35, b: 16, o: 0 },
      { x: -0.18, y: -0.5, rot: -15, s: 1.15, b: 8, o: 0.55 },
      { x: 0, y: 0, rot: 0, s: 1, b: 0, o: 1 },
      { x: -0.06, y: 0.5, rot: 15, s: 0.75, b: 6, o: 0.55 },
      { x: -0.12, y: 0.95, rot: 30, s: 0.55, b: 14, o: 0 }
    ];
    const idx = Math.max(0, Math.min(4, step + 2));
    const p = positions[idx];

    return {
      x: p.x * h,
      y: p.y * h,
      rotation: p.rot,
      scale: p.s,
      blur: p.b,
      opacity: p.o,
      zIndex: absStep === 0 ? 3 : absStep === 1 ? 2 : 1
    };
  };

  const positionSlide = (slide, step) => {
    const props = getSlideProps(step);
    gsap.set(slide, {
      xPercent: -50,
      yPercent: -50,
      x: props.x,
      y: props.y,
      rotation: props.rotation,
      scale: props.scale,
      opacity: props.opacity,
      filter: `blur(${props.blur}px)`,
      zIndex: props.zIndex
    });
  };

  const buildCarousel = () => {
    if (!imagesRef.current || imagesRef.current.offsetHeight === 0) return;
    imagesRef.current.innerHTML = "";
    slideElsRef.current = [];

    for (let step = -1; step <= 1; step++) {
      const idx = mod(currentRef.current + step);
      const slide = makeSlide(idx);
      imagesRef.current.appendChild(slide);
      positionSlide(slide, step);
      slideElsRef.current.push({ el: slide, step: step });
    }
  };

  const animateCarousel = (direction) => {
    if (!imagesRef.current || imagesRef.current.offsetHeight === 0) return gsap.timeline();

    const shift = direction === "next" ? -1 : 1;
    const enterStep = direction === "next" ? 2 : -2;
    const newIdx = direction === "next" ? mod(currentRef.current + 2) : mod(currentRef.current - 2);

    const newSlide = makeSlide(newIdx);
    imagesRef.current.appendChild(newSlide);
    positionSlide(newSlide, enterStep);
    slideElsRef.current.push({ el: newSlide, step: enterStep });

    slideElsRef.current.forEach((s) => {
      s.step += shift;
    });

    const duration = reducedMotionRef.current ? 0.01 : 1.2;

    const tl = gsap.timeline({
      onComplete: () => {
        slideElsRef.current = slideElsRef.current.filter((s) => {
          if (Math.abs(s.step) >= 2) {
            s.el.remove();
            return false;
          }
          return true;
        });
      }
    });

    slideElsRef.current.forEach((s) => {
      const props = getSlideProps(s.step);
      s.el.style.zIndex = props.zIndex;

      tl.to(s.el, {
        x: props.x,
        y: props.y,
        rotation: props.rotation,
        scale: props.scale,
        opacity: props.opacity,
        filter: `blur(${props.blur}px)`,
        duration: duration,
        ease: "power3.inOut"
      }, 0);
    });

    return tl;
  };

  const go = (direction) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    startAutoPlay();

    const nextIdx = direction === "next" ? mod(currentRef.current + 1) : mod(currentRef.current - 1);

    const master = gsap.timeline({
      onComplete: () => {
        currentRef.current = nextIdx;
        animatingRef.current = false;
      }
    });

    master.to(sliderRef.current, {
      backgroundColor: SLIDES[nextIdx].color,
      duration: reducedMotionRef.current ? 0.01 : 1.2,
      ease: "power2.inOut"
    }, 0);

    master.add(animateTitle(SLIDES[nextIdx].name, direction), 0);
    master.add(animateCarousel(direction), 0);
  };

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    preloadImages();
    setTitle(SLIDES[0].name);
    if (sliderRef.current) {
      gsap.set(sliderRef.current, { backgroundColor: SLIDES[0].color });
    }
    buildCarousel();
    buildCursor();
    startAutoPlay();

    // Event handlers
    const onWheel = throttle((e) => {
      if (animatingRef.current) return;
      go(e.deltaY > 0 ? "next" : "prev");
    }, 1800);

    let touchStartY = 0;
    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = throttle((e) => {
      if (animatingRef.current) return;
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 40) return;
      go(diff > 0 ? "next" : "prev");
    }, 1800);

    const onKeyDown = (e) => {
      if (animatingRef.current) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") go("next");
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") go("prev");
    };

    const onMouseMove = (e) => {
      if (!cursorVisibleRef.current) {
        gsap.to(cursorRef.current, { opacity: 1, duration: 0.3 });
        cursorVisibleRef.current = true;
      }
      if (cursorMoveXRef.current) cursorMoveXRef.current(e.clientX);
      if (cursorMoveYRef.current) cursorMoveYRef.current(e.clientY);
    };

    const onMouseLeave = () => {
      gsap.to(cursorRef.current, { opacity: 0, duration: 0.3 });
      cursorVisibleRef.current = false;
    };

    const onResize = debounce(() => {
      if (!animatingRef.current && imagesRef.current && imagesRef.current.offsetHeight > 0) {
        slideElsRef.current.forEach((s) => {
          positionSlide(s.el, s.step);
        });
      }
    }, 300);

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        animatingRef.current = false;
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("mousemove", onMouseMove, { passive: true });
      slider.addEventListener("mouseleave", onMouseLeave);
    }

    return () => {
      stopAutoPlay();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (slider) {
        slider.removeEventListener("mousemove", onMouseMove);
        slider.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, []);

  return (
    <section ref={sliderRef} className={styles.slider}>
      <div className={styles.slider__header}>
        <button className={styles.slider__menu} aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <span className={styles.slider__label}>CODESCAPE '26 — PROJECTS</span>
      </div>

      <div className={styles.slider__body}>
        <div className={styles.slider__left}>
          <h2 ref={titleRef} className={styles.slider__title} aria-live="polite"></h2>
          <div className={styles.slider__footer}>
            <div className={styles.slider__info}>
              <p className={styles.slider__description}>
                OUR LATEST PROJECTS<br />
                SHOWCASING INNOVATION<br />
                AND EXCELLENCE
              </p>
              <p className={styles.slider__location}>
                SCROLL TO EXPLORE<br />
                MORE CASE STUDIES
              </p>
            </div>
          </div>
        </div>
        <div className={styles.slider__right}>
          <div ref={imagesRef} className={styles.slider__images}></div>
        </div>
      </div>

      <div ref={cursorRef} className={styles.slider__cursor} aria-hidden="true">
        +
      </div>
    </section>
  );
}
