import { useEffect, useRef, useState } from "react";
import "../../styles/CustomCursor.css";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isAttract, setIsAttract] = useState(false);
  const attractElementRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);

  // First mount effect - set initial position based on mouse position
  useEffect(() => {
    const initialSetup = () => {
      // Set initial position to center of screen to avoid top-left corner issue
      const initialX = window.innerWidth / 2;
      const initialY = window.innerHeight / 2;

      mousePosition.current = { x: initialX, y: initialY };

      // Mark as ready after a small delay to ensure DOM is fully loaded
      setTimeout(() => {
        setIsReady(true);

        // Apply initial position
        if (cursorRef.current && cursorRingRef.current) {
          cursorRef.current.style.transform = `translate(${initialX}px, ${initialY}px)`;
          cursorRingRef.current.style.transform = `translate(${initialX}px, ${initialY}px)`;
          cursorRef.current.style.opacity = "1";
          cursorRingRef.current.style.opacity = "1";
        }
      }, 500);
    };

    initialSetup();

    // Add listener for mousemove to update initial position if mouse moves before setup completes
    const onInitialMouseMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };

      if (cursorRef.current && cursorRingRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursorRingRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    window.addEventListener("mousemove", onInitialMouseMove);

    return () => {
      window.removeEventListener("mousemove", onInitialMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!isReady || !cursorRef.current || !cursorRingRef.current) return;

    document.body.style.cursor = "none";

    const onMouseMove = (e) => {
      const { clientX, clientY } = e;

      // Store the mouse position
      mousePosition.current = { x: clientX, y: clientY };

      // Handle magnetic attraction effect
      if (isAttract && attractElementRef.current) {
        // This is handled in animation frame
      } else {
        // Normal cursor movement
        cursorRef.current.style.transform = `translate(${clientX}px, ${clientY}px)`;
        cursorRingRef.current.style.transform = `translate(${clientX}px, ${clientY}px)`;
      }
    };

    const onMouseDown = () => {
      if (!cursorRef.current || !cursorRingRef.current) return;
      cursorRef.current.classList.add("cursor-click");
      cursorRingRef.current.classList.add("cursor-ring-click");
    };

    const onMouseUp = () => {
      if (!cursorRef.current || !cursorRingRef.current) return;
      cursorRef.current.classList.remove("cursor-click");
      cursorRingRef.current.classList.remove("cursor-ring-click");
    };

    // Check for clickable elements to change cursor style
    const onMouseOver = (e) => {
      const targetElement = e.target;
      const isClickable =
        targetElement.tagName.toLowerCase() === "a" ||
        targetElement.tagName.toLowerCase() === "button" ||
        targetElement.tagName.toLowerCase() === "input" ||
        targetElement.tagName.toLowerCase() === "textarea" ||
        targetElement.tagName.toLowerCase() === "select" ||
        targetElement.closest("a") ||
        targetElement.closest("button") ||
        targetElement.onclick ||
        window.getComputedStyle(targetElement).cursor === "pointer";

      if (isClickable) {
        setIsPointer(true);
      }

      // Check for magnetic attraction elements
      const isAttractElement =
        targetElement.classList.contains("cursor-attract") ||
        targetElement.classList.contains("cursor-attract-text") ||
        targetElement.classList.contains("cursor-attract-button") ||
        targetElement.closest(".cursor-attract") ||
        targetElement.closest(".cursor-attract-text") ||
        targetElement.closest(".cursor-attract-button");

      if (isAttractElement) {
        setIsAttract(true);
        attractElementRef.current =
          isAttractElement === true
            ? targetElement
            : targetElement.closest(".cursor-attract") ||
              targetElement.closest(".cursor-attract-text") ||
              targetElement.closest(".cursor-attract-button");
      }
    };

    const onMouseOut = (e) => {
      const targetElement = e.target;
      const relatedTarget = e.relatedTarget;

      // Only reset pointer if we're not moving to another clickable element
      const movingToClickable =
        relatedTarget &&
        (relatedTarget.tagName.toLowerCase() === "a" ||
          relatedTarget.tagName.toLowerCase() === "button" ||
          relatedTarget.closest("a") ||
          relatedTarget.closest("button"));

      if (!movingToClickable) {
        setIsPointer(false);
      }

      // Check if we're leaving an attraction element
      const isLeavingAttract =
        targetElement.classList.contains("cursor-attract") ||
        targetElement.classList.contains("cursor-attract-text") ||
        targetElement.classList.contains("cursor-attract-button") ||
        targetElement.closest(".cursor-attract") ||
        targetElement.closest(".cursor-attract-text") ||
        targetElement.closest(".cursor-attract-button");

      if (isLeavingAttract) {
        setIsAttract(false);
        attractElementRef.current = null;
      }
    };

    // Ensure cursor is visible when mouse enters window
    const onMouseEnter = (e) => {
      if (!cursorRef.current || !cursorRingRef.current) return;
      cursorRef.current.style.opacity = "1";
      cursorRingRef.current.style.opacity = "1";

      // Update position
      mousePosition.current = { x: e.clientX, y: e.clientY };
      cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      cursorRingRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    // Hide cursor when mouse leaves window
    const onMouseLeave = () => {
      if (!cursorRef.current || !cursorRingRef.current) return;
      cursorRef.current.style.opacity = "0";
      cursorRingRef.current.style.opacity = "0";
    };

    // Magnetic attraction animation
    const animateMagneticCursor = () => {
      if (!cursorRef.current || !cursorRingRef.current) return;

      if (isAttract && attractElementRef.current) {
        const rect = attractElementRef.current.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;

        // Calculate distance between mouse and element center
        const distanceX = mousePosition.current.x - elementCenterX;
        const distanceY = mousePosition.current.y - elementCenterY;

        // Determine how much to move the cursor (stronger attraction closer to element)
        const attractStrength = Math.min(rect.width, rect.height) * 0.3;
        const maxDistance = Math.max(rect.width, rect.height) * 1.5;
        const distance = Math.sqrt(
          distanceX * distanceX + distanceY * distanceY
        );

        if (distance < maxDistance) {
          // Calculate attraction factor - stronger closer to element
          const attractFactor =
            1 - Math.min(1, Math.max(0, distance / maxDistance));

          // Calculate new cursor position with attraction
          const attractX =
            mousePosition.current.x -
            (distanceX * attractFactor * attractStrength) / 100;
          const attractY =
            mousePosition.current.y -
            (distanceY * attractFactor * attractStrength) / 100;

          // Move cursors
          cursorRingRef.current.style.transform = `translate(${attractX}px, ${attractY}px)`;

          // Main dot cursor follows mouse more closely
          cursorRef.current.style.transform = `translate(${mousePosition.current.x}px, ${mousePosition.current.y}px)`;
        } else {
          // Regular cursor movement when far from element
          cursorRef.current.style.transform = `translate(${mousePosition.current.x}px, ${mousePosition.current.y}px)`;
          cursorRingRef.current.style.transform = `translate(${mousePosition.current.x}px, ${mousePosition.current.y}px)`;
        }
      }

      animationFrameId.current = requestAnimationFrame(animateMagneticCursor);
    };

    // Store animation frame ID for cleanup
    const animationFrameId = { current: null };
    animationFrameId.current = requestAnimationFrame(animateMagneticCursor);

    // Add event listeners
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver, true);
    document.addEventListener("mouseout", onMouseOut, true);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      // Remove event listeners
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver, true);
      document.removeEventListener("mouseout", onMouseOut, true);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.body.style.cursor = "auto";

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isReady, isAttract, isPointer]);

  return (
    <>
      <div
        ref={cursorRef}
        className={`custom-cursor ${isPointer ? "pointer" : ""}`}
        style={{ opacity: 0 }} // Start hidden, will be shown after initialization
      />
      <div
        ref={cursorRingRef}
        className={`custom-cursor-ring ${isPointer ? "pointer" : ""} ${
          isAttract ? "attract" : ""
        }`}
        style={{ opacity: 0 }} // Start hidden, will be shown after initialization
      />
    </>
  );
};

export default CustomCursor;
