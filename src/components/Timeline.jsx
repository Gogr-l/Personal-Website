import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Timeline.css';

const Timeline = () => {
  const scrollRef = useRef(null);
  const eventRefs = useRef({});
  const [activeTick, setActiveTick] = useState('bio');
  const [scrollProgress, setScrollProgress] = useState(0);

  const events = useMemo(() => [
    {
      id: 'bio',
      year: '',
      title: 'Story',
      content: `I'm a Puget Sound based primal systems builder focused on turning overlooked opportunities into scalable revenue engines. Growing a window cleaning and holiday lighting business gave me a clear view of inefficiencies in home services and how to convert them into automated income channels. I built Window Connect to turn window cleaners into lead generators for repair companies, and I'm developing AVARRI, an AI-powered interior design tool for professionals. My work sits at the intersection of field operations, software, and automation. I keep a straightforward, instinct-driven approach, grounded in the Pacific Northwest. I value clarity, execution, and authenticity, and I focus on building practical systems that scale while staying real in a world that overcomplicates things.`,
    },
    {
      id: 'was',
      year: '2018',
      title: 'Aerospace Scholars',
      content: `As a high school junior, I was selected for the Washington Aerospace Scholars (WAS) program through The Museum of Flight, in partnership with NASA and the University of Washington. This selective, college-level experience is tailored for Washington state students passionate about STEM, emphasizing aerospace design, space exploration, and mission planning.

The program began with an intensive online curriculum from November to March, earning five UW credits. We explored air and space vehicle design, NASA's exploration strategies, and Earth/space science topics through rigorous aerospace math problems and virtual group challenges.

The real highlight was the optional summer residency at The Museum of Flight: a week of hands-on collaboration with NASA scientists, engineers, university students, and STEM professionals. Teams planned realistic human missions to Mars, covering trajectories, propulsion systems, resource allocation, and vehicle architecture. I served as propulsion team leader for our group, leading the design and optimization of the propulsion subsystem to ensure efficient thrust, fuel management, and reliable performance for the interplanetary journey.

Our team's mission concept stood out for its innovation, feasibility, and execution, earning us the Best Aerospace Startup award.`,
    },
    {
      id: 'wwl',
      year: '2020',
      title: 'Window Warriors',
      content: `I started a window cleaning company not because it was flashy, but because it was straightforward and honest. Show up on time, deliver solid work, communicate clearly—and you get paid. Fall short, and you don't. No hiding behind fancy strategies or excuses. The loop was immediate and unforgiving.

That business became my crash course in real entrepreneurship. I learned how customers decide when it's their own money. Trust builds through reliability, not ads. Pricing has to work for everyone involved. I mastered scheduling, weekly revenue tracking, and taking payments any way they came—cash, check, app.

Word-of-mouth turned into my best (and free) marketing channel as the client list grew. Text follow-ups to past customers filled quiet months. Adding Christmas light installations doubled winter revenue without new customer hunts. The company funded my later ventures, but more than cash, it taught me that business boils down to consistent, high-quality execution over time.`,
    },
    {
      id: 'college',
      year: '2022',
      title: 'College Journey',
      content: `I was accepted to Embry-Riddle Aeronautical University for rocket engineering. But I chose Gonzaga University instead, drawn to entrepreneurship and the chance to build ventures from the ground up.

My year at Gonzaga was valuable but expensive. I realized I needed a path that allowed more creative expression in design and innovation, so I targeted the University of Washington's architecture program.

I transferred to UW Tacoma and immersed myself in urban design. I deepened my GIS skills here, mapping spatial data, analyzing urban patterns, and modeling environmental systems. But I quickly encountered the limits of municipal bureaucracy.

That frustration prompted another shift to general business with a minor in innovation and design at the Milgard School of Business. This combination felt right, merging strategic thinking with creative iteration. The coursework sharpened my abilities in financial analysis, operational efficiency, user-centered problem-solving, and leading technical teams.`,
    },
    {
      id: 'connectxr',
      year: '2024',
      title: 'ConnectXR',
      content: `Networking IRL is often awkward. ConnectXR imagined fixing that with mixed reality: AR glasses show subtle digital icons above people nearby—shared interests, work history, mutual connections—without a word.

I dug into Bluetooth proximity, computer vision tracking, Apple Vision Pro limits, and iPhone camera hacks for an early prototype. The core idea was a "digital persona layer" overlaid on real space—like a dynamic, location-based Linktree visible only in AR.

It was more exploration than startup—pushing how future interfaces could make human connection smoother and more intuitive. It shifted how I view tech: not flashy gadgets, but invisible layers enhancing everyday life.`,
    },
    {
      id: 'akulla',
      year: '2024',
      title: 'Akulla Intelligence',
      content: `In 2024, I partnered with my college roommate Curtis (Akulla Intelligence) to build an AI tool for McKinley Irvine Law. It started with a relationship and spotting a common pain: years of documents, procedures, and knowledge scattered across folders. Staff knew the info existed but wasted time hunting it.

We created a natural-language chatbot on top of their knowledge base—ask like you'd ask a colleague, get instant answers. Curtis led engineering; I identified the opportunity, built trust with the firm's leadership, clarified the problem, and connected the pieces.

The result: faster access, less friction for the team. It proved value in tech isn't just code—it's seeing the need, earning trust, defining the issue sharply, and assembling the right talent.`,
    },
    {
      id: 'avarri',
      year: '2025',
      title: 'Avarri',
      content: `Avarri fused my love for AI, design, and solving real problems. Interior designers struggle to help clients visualize changes. I wanted to change that: upload a room photo, describe the update, instantly show a transformed version.

I interviewed dozens of designers to understand their process and visualization breakdowns. Built workflows with image models, prompts, and product libraries. Wrote plans, pitched, won the Milgard School of Business VIBE Incubator prize.

Then tech reality hit: generative AI creates stunning images but struggles with precise fidelity. That sparked the pivot: bigger opportunity in real estate virtual staging. Take empty or generic homes and personalize them for buyers—show not generic staging, but "your future home" based on their tastes, lifestyle, preferences.

Avarri captures my approach: start with real conversations, hit technical limits, listen to feedback and reality, then adapt quickly to where the value truly is. Iteration over assumption, every time.`,
    },
    {
      id: 'windowconnect',
      year: '2025',
      title: 'Window Connect',
      content: `Window Connect came from what I saw every day on the job: broken windows, foggy panes, damaged frames—leads I could spot instantly but couldn't act on. Window cleaners are perfectly positioned to find repair work early, yet no system connects us to repair companies.

I sketched a platform where cleaners submit warm leads, it routes them smartly to shops, and both sides earn. I focused on seamless integration with repair workflows—subscription plus per-lead fees.

This was pure field-born insight. Being in the trenches reveals gaps outsiders never notice.`,
    },
    {
      id: 'vision',
      year: '',
      title: 'Vision',
      content: 'Where I see myself going and the impact I want to create. The future is built by those who imagine it first. Every pivot, every venture, every failure has been a lesson building toward something bigger.',
    },
  ], []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setScrollProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);

  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setActiveTick(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Click outside the open event (background, spacers, etc.) closes it */
  useEffect(() => {
    if (!activeTick) return;
    const onDocClick = (e) => {
      const activeEl = eventRefs.current[activeTick];
      const t = e.target;
      if (!(t instanceof Node)) return;
      const el = t instanceof Element ? t : t.parentElement;

      if (el?.closest?.('.tl-header__name')) return;

      /* Expanded text for the open section — don’t close while reading */
      const activeBody = activeEl?.querySelector('.tl-event__content');
      if (activeBody?.contains(t)) return;

      /* Title buttons — toggle current or switch section */
      if (el?.closest?.('.tl-event__title')) return;

      setActiveTick(null);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [activeTick]);

  /* Center the active event horizontally when opening or switching sections */
  useEffect(() => {
    if (!activeTick) return;
    const el = eventRefs.current[activeTick];
    const scrollEl = scrollRef.current;
    if (!el || !scrollEl) return;

    const center = () => {
      const sr = scrollEl.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      const delta = er.left + er.width / 2 - (sr.left + sr.width / 2);
      scrollEl.scrollBy({ left: delta, behavior: 'smooth' });
    };

    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(center);
    });
    return () => window.cancelAnimationFrame(id);
  }, [activeTick]);

  // Background opacity — 6 stages: ground → trees → sky → atmosphere → space → moon
  const p = scrollProgress;
  const ground   = Math.max(0, 1 - p * 5);
  const trees    = Math.max(0, Math.min(1, (p - 0.05) * 5, (0.35 - p) * 5));
  const sky      = Math.max(0, Math.min(1, (p - 0.2) * 5,  (0.55 - p) * 5));
  const atmo     = Math.max(0, Math.min(1, (p - 0.4) * 5,  (0.72 - p) * 5));
  const space    = Math.max(0, Math.min(1, (p - 0.58) * 5,  (0.88 - p) * 5));
  const moon     = Math.max(0, Math.min(1, (p - 0.78) * 5));

  // Moon scrolls in from the top-right corner
  const moonEnter = Math.max(0, Math.min(1, (p - 0.65) * 3));
  const moonY = (1 - moonEnter) * -40;
  const moonX = (1 - moonEnter) * 40;

  return (
    <div className="tl">
      {/* Backgrounds */}
      <div className="tl-bg">
        <div className="tl-bg__layer tl-bg__ground"      style={{ opacity: ground }} />
        <div className="tl-bg__layer tl-bg__trees"        style={{ opacity: trees }} />
        <div className="tl-bg__layer tl-bg__sky"          style={{ opacity: sky }} />
        <div className="tl-bg__layer tl-bg__atmosphere"   style={{ opacity: atmo }} />
        <div className="tl-bg__layer tl-bg__space"        style={{ opacity: space }} />
        <div className="tl-bg__layer tl-bg__moon"         style={{ opacity: moon }} />
      </div>

      {/* Moon image — scrolls in from bottom-right */}
      <div
        className="tl-moon"
        style={{
          opacity: moonEnter,
          transform: `translate(${moonX}%, ${moonY}%)`,
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg"
          alt="Moon"
          className="tl-moon__img"
        />
        <div className="tl-moon__gloss" />
      </div>

      {/* Name — fixed top-left */}
      <header className="tl-header">
        <span className="tl-header__name">Dominic Martinez</span>
      </header>

      {/* Scrollable area */}
      <div className="tl-scroll" ref={scrollRef}>
        <div className="tl-track">
          <div className="tl-spacer" />

          {events.map((evt) => (
            <div
              key={evt.id}
              className="tl-event"
              ref={(node) => {
                if (node) eventRefs.current[evt.id] = node;
                else delete eventRefs.current[evt.id];
              }}
            >
              {/* TOP: title & year above the line */}
              <div className="tl-event__top">
                <button
                  className={`tl-event__title ${activeTick === evt.id ? 'active' : ''}`}
                  onClick={() => setActiveTick(activeTick === evt.id ? null : evt.id)}
                >
                  {evt.title}
                </button>
                {evt.year
                  ? <span className="tl-event__year">{evt.year}</span>
                  : <span className="tl-event__year-placeholder">&nbsp;</span>
                }
              </div>

              {/* CENTER: dot on the line */}
              <div className="tl-event__dot-wrap">
                <span className={`tl-event__dot ${activeTick === evt.id ? 'active' : ''}`} />
              </div>

              {/* BOTTOM: expanded content below the line */}
              <div className="tl-event__bottom">
                <AnimatePresence>
                  {activeTick === evt.id && (
                    <motion.div
                      className="tl-event__content"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {evt.content.split('\n\n').map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}

          {/* Spacer end */}
          <div className="tl-spacer" />
        </div>

        {/* Continuous timeline line */}
        <div className="tl-line" />
      </div>

      {/* Progress */}
      <div className="tl-progress">
        <div className="tl-progress__track">
          <div className="tl-progress__fill" style={{ width: `${scrollProgress * 100}%` }} />
        </div>
      </div>

      {/* Hint */}
      <motion.div
        className="tl-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Scroll →
      </motion.div>
    </div>
  );
};

export default Timeline;
