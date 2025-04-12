import { useEffect, useRef } from "react";

/**
 * Hook that handles click outside of the referenced element
 * @param {Function} callback - Function to call when clicked outside
 * @returns {Object} - Ref to attach to the element
 */
export function useClickOutside(callback) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
}
