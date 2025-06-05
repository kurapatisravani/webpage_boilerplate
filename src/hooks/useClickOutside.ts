import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Hook that handles click outside of the passed ref
 * @param ref Reference to the element to detect clicks outside of
 * @param callback Function to call when a click outside is detected
 * @param ignoreRefs Optional array of refs to ignore clicks on
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback: () => void,
  ignoreRefs: RefObject<HTMLElement>[] = []
): void {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click was outside the ref element
      if (ref.current && !ref.current.contains(event.target as Node)) {
        // Check if the click was on any of the ignore refs
        const isIgnored = ignoreRefs.some(
          ignoreRef => ignoreRef.current && ignoreRef.current.contains(event.target as Node)
        );
        
        if (!isIgnored) {
          callback();
        }
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback, ignoreRefs]);
} 