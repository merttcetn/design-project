import { Architecture } from "./components/Architecture";
import { Exhibition } from "./components/Exhibition";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Journey } from "./components/Journey";
import { Nav } from "./components/Nav";
import { Numbers } from "./components/Numbers";
import { Problem } from "./components/Problem";
import { RevealObserver } from "./components/Reveal";
import { Rewrite } from "./components/Rewrite";
import { Team } from "./components/Team";
import { Tech } from "./components/Tech";
import { Ticker } from "./components/Ticker";

export default function Page() {
  return (
    <>
      <Nav />
      <Hero />
      <Ticker />
      <Problem />
      <Journey />
      <Numbers />
      <Rewrite />
      <Architecture />
      <Tech />
      <Team />
      <Exhibition />
      <Footer />
      <RevealObserver />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
