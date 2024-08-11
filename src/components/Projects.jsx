import React, { useEffect, useState, useRef } from 'react';
import { projects } from './data';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Projects({ setActiveProject }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const paragraphsRef = useRef([]);

  const handleMouseOver = (index) => {
    setHoveredIndex(index);
    setActiveProject(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setActiveProject(null);
  };

  useEffect(() => {
    paragraphsRef.current.forEach((pEl) => {
      const spans = pEl.querySelectorAll('span');
      gsap.fromTo(
        spans,
        { y: 120 },
        {
          y: 0,
          duration: 1.5,
          ease: 'power4.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: pEl,
            start: 'top 80%',
            end: 'top 50%',
            scrub: false,
          },
        }
      );
    });
  }, []);

  // Function to wrap each letter in <span> and add spacing between words
  const wrapLettersAndAddSpacing = (text) => {
    // Use regex to split text into letters and spaces
    const wordsWithSpaces = text.split(/(\s+)/); // Split by spaces and keep them

    return wordsWithSpaces.map((chunk, index) => {
      if (chunk.trim().length === 0) {
        // If it's a space, render it as-is
        return <span key={index}>&nbsp;</span>;
      } else {
        // Otherwise, wrap each letter in a <span>
        return chunk.split('').map((letter, letterIndex) => (
          <span key={`${index}-${letterIndex}`} className="inline-block">
            {letter}
          </span>
        ));
      }
    });
  };

  return (
    <div className='relative mix-blend-difference z-10 text-white h-screen w-full'>
      <ul onMouseLeave={handleMouseLeave}>
        {projects.map((project, i) => (
          <li
            key={project.title}
            onMouseOver={() => handleMouseOver(i)}
            className={`text-[4vw] p-5 overflow-hidden transition-opacity duration-300 ease-in-out ${hoveredIndex === i ? 'opacity-30' : 'opacity-100'}`}
          >
            <p className="overflow-hidden" ref={(el) => (paragraphsRef.current[i] = el)}>
              {wrapLettersAndAddSpacing(project.title)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
