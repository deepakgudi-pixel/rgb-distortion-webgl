'use client';
import { useEffect, useState } from "react";
import Projects from "@/components/Projects";
import Lenis from 'lenis';
import Scene from "@/components/Scene";

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    console.log("Active project in Home:", activeProject);
  }, [activeProject]);

  return (
    <main>
      <Scene activeProject={activeProject} />
      <div className="h-[80vh]"></div>
      <Projects setActiveProject={setActiveProject} />
      <div className="h-[80vh]"></div>
    </main>
  );
}
