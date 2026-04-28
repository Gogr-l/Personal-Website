import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Timeline.css';

const Timeline = () => {
  const scrollRef = useRef(null);
  const fastTrackRef = useRef(null);
  const eventRefs = useRef({});
  const lastScrollLeftRef = useRef(0);
  const isAutoScrollingRef = useRef(false);
  const scrollAnimationIdRef = useRef(0);
  const [activeTick, setActiveTick] = useState('bio');
  const [scrollProgress, setScrollProgress] = useState(0);

  const events = useMemo(() => [
    {
      id: 'bio',
      year: '',
      title: 'Story',
      description: 'How I spot overlooked opportunities and turn them into practical systems.',
      variant: 'story',
      headline: 'Build The World',
      content: 'I notice practical problems hiding inside everyday work, then turn them into systems that create leverage. Window cleaning taught me to see field opportunities most people miss; Window Connect, Akulla, ConnectXR, and Avarri are all different versions of that same pattern: spot friction, clarify the need, and build a solution that makes action easier.',
      pillars: [
        {
          icon: 'opportunity',
          title: 'Opportunity Finder',
          text: 'I find value in overlooked details: broken window leads on job sites, scattered law-firm knowledge, awkward in-person networking, and real estate visuals that fail to move buyers.',
        },
        {
          icon: 'action',
          title: 'Action Oriented',
          text: 'I validate through real conversations, adapt when the market or technology pushes back, and keep building toward clear, useful outcomes.',
        },
        {
          icon: 'systems',
          title: 'Systems Builder',
          text: 'I turn those insights into repeatable frameworks, marketplaces, workflows, and product concepts designed to scale beyond one-off effort.',
        },
      ],
    },
    {
      id: 'was',
      year: '2018',
      title: 'Aerospace Scholars',
      description: 'A NASA-backed aerospace program where I helped design a Mars mission concept.',
      content: `As a high school junior, I was selected for the Washington Aerospace Scholars (WAS) program through The Museum of Flight, in partnership with NASA and the University of Washington. This selective, college-level experience is tailored for Washington state students passionate about STEM, emphasizing aerospace design, space exploration, and mission planning.

The program began with an intensive online curriculum from November to March, earning five UW credits. We explored air and space vehicle design, NASA's exploration strategies, and Earth/space science topics through rigorous aerospace math problems and virtual group challenges.

The real highlight was the optional summer residency at The Museum of Flight: a week of hands-on collaboration with NASA scientists, engineers, university students, and STEM professionals. Teams planned realistic human missions to Mars, covering trajectories, propulsion systems, resource allocation, and vehicle architecture. I served as propulsion team leader for our group, leading the design and optimization of the propulsion subsystem to ensure efficient thrust, fuel management, and reliable performance for the interplanetary journey.

Our team's mission concept stood out for its innovation, feasibility, and execution, earning us the Best Aerospace Startup award.`,
    },
    {
      id: 'wwl',
      year: '2020',
      title: 'Window Warriors',
      description: 'My first operating business and the foundation for how I learned execution.',
      content: `I started a window cleaning company not because it was flashy, but because it was straightforward and honest. Show up on time, deliver solid work, communicate clearly—and you get paid. Fall short, and you don't. No hiding behind fancy strategies or excuses. The loop was immediate and unforgiving.

That business became my crash course in real entrepreneurship. I learned how customers decide when it's their own money. Trust builds through reliability, not ads. Pricing has to work for everyone involved. I mastered scheduling, weekly revenue tracking, and taking payments any way they came—cash, check, app.

Word-of-mouth turned into my best (and free) marketing channel as the client list grew. Text follow-ups to past customers filled quiet months. Adding Christmas light installations doubled winter revenue without new customer hunts. The company funded my later ventures, but more than cash, it taught me that business boils down to consistent, high-quality execution over time.`,
    },
    {
      id: 'connectxr',
      year: '2024',
      title: 'ConnectXR',
      description: 'A mixed reality experiment for making in-person networking more natural.',
      content: `Networking IRL is often awkward. ConnectXR imagined fixing that with mixed reality: AR glasses show subtle digital icons above people nearby—shared interests, work history, mutual connections—without a word.

I dug into Bluetooth proximity, computer vision tracking, Apple Vision Pro limits, and iPhone camera hacks for an early prototype. The core idea was a "digital persona layer" overlaid on real space—like a dynamic, location-based Linktree visible only in AR.

It was more exploration than startup—pushing how future interfaces could make human connection smoother and more intuitive. It shifted how I view tech: not flashy gadgets, but invisible layers enhancing everyday life.`,
    },
    {
      id: 'akulla',
      year: '2024',
      title: 'Akulla Intelligence',
      description: 'An AI knowledge-base project built around a real operational pain point.',
      content: `In 2024, I partnered with my college roommate Curtis (Akulla Intelligence) to build an AI tool for McKinley Irvine Law. It started with a relationship and spotting a common pain: years of documents, procedures, and knowledge scattered across folders. Staff knew the info existed but wasted time hunting it.

We created a natural-language chatbot on top of their knowledge base—ask like you'd ask a colleague, get instant answers. Curtis led engineering; I identified the opportunity, built trust with the firm's leadership, clarified the problem, and connected the pieces.

The result: faster access, less friction for the team. It proved value in tech isn't just code—it's seeing the need, earning trust, defining the issue sharply, and assembling the right talent.`,
    },
    {
      id: 'avarri',
      year: '2025',
      title: 'Avarri',
      description: 'A design-heavy AI virtual staging case study shaped by customer discovery.',
      content: `I started Avarri as an AI powered virtual staging tool built for real estate agents. The product lets users upload photos of any room or home and quickly generate clean staged versions that make listings look more appealing to buyers.

The idea originally started with interior designers. I wanted to build a tool that let designers take a photo of a real room and precisely edit it by adding, replacing, or adjusting furniture, flooring, and decor. The goal was never just to make pretty pictures. I wanted something designers could actually use in their client workflow and present real design concepts to clients.

Early on I spent months talking directly to interior designers, consignment store owners, and furniture buyers. What stood out right away was how detail oriented they are. They care a lot about scale, lighting, material accuracy, and how everything fits together in a space. They did not want inspirational mood boards. They wanted control and precision. At the time the AI technology was not consistent enough for that level of detail. The outputs often broke spatial rules or looked unrealistic when making specific edits. That gap made me rethink the target market.

Real estate agents had a similar visual problem but they did not need the same level of precision. They just needed listings to look clean, staged, and appealing fast. This matched the current strengths of the technology much better. Working with a technical co founder, we shifted focus and built a simple fast web app for virtual staging. I led the business side including customer discovery, product direction, and user interviews while he handled development.

We iterated quickly based on real agent feedback. One of the biggest additions was bulk staging. Agents could upload an entire set of listing photos and apply a consistent style across all of them. We also added preset styles and custom prompt options so users could choose between speed and more control. We even explored features for the buyer side, such as letting buyer agents run a quick design quiz so clients could see the home restaged in their own taste. The goal was to create a stronger emotional connection between buyers and the property.

Along the way I made several important pivots. I originally considered adding a product marketplace where designers could upload items and earn commissions, but I cut that feature because it added too much complexity and pulled focus from the core value. I also narrowed the target audience down to residential real estate agents only. That clarity helped us make sharper product decisions.

Unfortunately we were not able to launch. We faced two main constraints. The AI still struggled with perfect consistency across multiple images and complex edits. Also my co founder took another job which paused development.

The biggest lesson from building Avarri is that the best product is not just about what the technology can do. It is about where the technology creates the most value for a specific user right now. Interior designers have the highest needs, but real estate agents were the better product market fit at this stage.

This project taught me how to validate ideas through constant customer conversations. It taught me how to make tough scoping decisions and stay focused on solving one clear problem really well. I learned when to pivot and when to say no to features that sounded good but hurt the core experience. These skills and business practices are what I will carry into every future project.`,
      variant: 'case-study',
      media: [
        {
          src: 'case-studies/avarri-pitch-examples.png',
          alt: 'Avarri pitch deck examples showing virtual staging before and after images',
          caption: 'These are examples from the pitch deck I used in the Milgard 2025 VIBE Business Plan competition. Avarri won 1st place for best pitch.',
          placement: 'hero',
        },
        {
          src: 'case-studies/avarri-digital-warehouse-mockup.png',
          alt: 'Initial mockup of Avarri digital warehouse for consignment stores',
          caption: 'This was an initial mock up of our digital warehouse for consignment stores.',
          placement: 'inline',
          afterParagraph: 2,
        },
        {
          images: [
            {
              src: 'case-studies/avarri-real-estate-before.png',
              alt: 'Empty listed home before virtual staging',
            },
            {
              src: 'case-studies/avarri-real-estate-after.png',
              alt: 'Listed home after virtual staging with furniture and decor',
            },
          ],
          caption: 'Demo used for our real estate agents showing before and afters of a listed home.',
          placement: 'inline',
          afterParagraph: 3,
        },
      ],
    },
    {
      id: 'windowconnect',
      year: '2025',
      title: 'Window Connect',
      description: 'A field-born lead marketplace idea connecting cleaners with repair companies.',
      content: `Window Connect came from what I saw every day on the job: broken windows, foggy panes, damaged frames—leads I could spot instantly but couldn't act on. Window cleaners are perfectly positioned to find repair work early, yet no system connects us to repair companies.

I sketched a platform where cleaners submit warm leads, it routes them smartly to shops, and both sides earn. I focused on seamless integration with repair workflows—subscription plus per-lead fees.

This was pure field-born insight. Being in the trenches reveals gaps outsiders never notice.`,
    },
    {
      id: 'vision',
      year: '',
      title: 'Vision',
      description: 'The direction I want to build toward next.',
      content: 'Where I see myself going and the impact I want to create. The future is built by those who imagine it first. Every pivot, every venture, every failure has been a lesson building toward something bigger.',
    },
  ], []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setScrollProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);
    lastScrollLeftRef.current = el.scrollLeft;

    if (isAutoScrollingRef.current) return;

    const scrollRect = el.getBoundingClientRect();
    const viewportCenter = scrollRect.left + scrollRect.width / 2;
    const centeredEvent = events.reduce((closest, evt) => {
      const eventEl = eventRefs.current[evt.id];
      if (!eventEl) return closest;

      const eventRect = eventEl.getBoundingClientRect();
      const eventCenter = eventRect.left + eventRect.width / 2;
      const distance = Math.abs(eventCenter - viewportCenter);

      if (!closest || distance < closest.distance) {
        return { id: evt.id, distance, width: eventRect.width, variant: evt.variant };
      }

      return closest;
    }, null);

    if (!centeredEvent) return;

    const activationRange = centeredEvent.variant === 'case-study'
      ? Math.min(centeredEvent.width * 0.08, 80)
      : centeredEvent.width / 2;
    setActiveTick((current) => (
      centeredEvent.distance <= activationRange && current !== centeredEvent.id
        ? centeredEvent.id
        : current
    ));
  }, [events]);

  const handleWheel = useCallback((e) => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const target = e.target instanceof Element ? e.target : null;
    if (target?.closest('.tl-case-study')) return;
    if (target?.closest('.tl-event__bottom')) return;

    const maxScroll = scrollEl.scrollWidth - scrollEl.clientWidth;
    if (maxScroll <= 0) return;

    const modeMultiplier = e.deltaMode === 1
      ? 16
      : e.deltaMode === 2
        ? window.innerHeight
        : 1;
    const dominantDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    const nextScrollLeft = Math.max(
      0,
      Math.min(maxScroll, scrollEl.scrollLeft + dominantDelta * modeMultiplier),
    );

    if (nextScrollLeft === scrollEl.scrollLeft) return;

    e.preventDefault();
    isAutoScrollingRef.current = false;
    scrollAnimationIdRef.current += 1;
    scrollEl.scrollLeft = nextScrollLeft;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollEventToCenter = useCallback((id, onComplete) => {
    const el = eventRefs.current[id];
    const scrollEl = scrollRef.current;
    if (!el || !scrollEl) {
      onComplete?.();
      return;
    }

    const sr = scrollEl.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    const start = scrollEl.scrollLeft;
    const target = start + er.left + er.width / 2 - (sr.left + sr.width / 2);
    const duration = 540;
    const startTime = performance.now();
    const animationId = scrollAnimationIdRef.current + 1;
    scrollAnimationIdRef.current = animationId;
    isAutoScrollingRef.current = true;

    const animate = (now) => {
      if (scrollAnimationIdRef.current !== animationId) return;

      const progress = Math.min((now - startTime) / duration, 1);
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      scrollEl.scrollLeft = start + (target - start) * eased;
      if (progress < 1) {
        window.requestAnimationFrame(animate);
      } else {
        window.setTimeout(() => {
          if (scrollAnimationIdRef.current !== animationId) return;

          isAutoScrollingRef.current = false;
          lastScrollLeftRef.current = scrollEl.scrollLeft;
          onComplete?.();
        }, 80);
      }
    };

    window.requestAnimationFrame(animate);
  }, []);

  const openEvent = useCallback((id) => {
    if (activeTick === id) {
      setActiveTick(null);
      return;
    }

    const targetEvent = events.find((evt) => evt.id === id);
    if (targetEvent?.variant === 'case-study') {
      setActiveTick(null);
      window.requestAnimationFrame(() => scrollEventToCenter(id, () => setActiveTick(id)));
      return;
    }

    setActiveTick(id);
    window.requestAnimationFrame(() => scrollEventToCenter(id));
  }, [activeTick, events, scrollEventToCenter]);

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

      if (el?.closest?.('.tl-header')) return;
      if (el?.closest?.('.tl-fast-track')) return;
      if (el?.closest?.('.tl-case-study')) return;

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
  const activeEvent = events.find((evt) => evt.id === activeTick);

  return (
    <div className="tl" onWheel={handleWheel}>
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

      {/* Header */}
      <header className="tl-header">
        <span className="tl-header__name">Dominic Martinez</span>
        <button
          className="tl-header__case-studies"
          type="button"
          onClick={() => openEvent('avarri')}
        >
          Case Studies
        </button>
      </header>

      <nav className="tl-fast-track" ref={fastTrackRef} aria-label="Fast track timeline navigation">
        <span className="tl-fast-track__label">Fast Track</span>
        <div className="tl-fast-track__items">
          {events.map((evt) => (
            <button
              key={evt.id}
              className={`tl-fast-track__item ${activeTick === evt.id ? 'active' : ''}`}
              type="button"
              onClick={() => openEvent(evt.id)}
              aria-label={`Go to ${evt.title}`}
            >
              <span className="tl-fast-track__title">{evt.title}</span>
              <span className="tl-fast-track__description">{evt.description}</span>
            </button>
          ))}
        </div>
      </nav>

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
                  onClick={() => openEvent(evt.id)}
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
                  {activeTick === evt.id && evt.variant !== 'case-study' && (
                    <motion.div
                      className={`tl-event__content ${evt.variant === 'story' ? 'tl-event__content--story' : ''}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {evt.variant === 'story' ? (
                        <section className="tl-story" aria-label="Story summary">
                          <h2 className="tl-story__headline">{evt.headline}</h2>
                          <p className="tl-story__intro">{evt.content}</p>
                          <div className="tl-story__pillars">
                            {evt.pillars.map((pillar) => (
                              <article className="tl-story__pillar" key={pillar.title}>
                                <span className={`tl-story__icon tl-story__icon--${pillar.icon}`} aria-hidden="true">
                                  {pillar.icon === 'action' && (
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
                                      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
                                      <path d="m21 3 1 11h-2" />
                                      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
                                      <path d="M3 4h8" />
                                    </svg>
                                  )}
                                </span>
                                <h3>{pillar.title}</h3>
                                <p>{pillar.text}</p>
                              </article>
                            ))}
                          </div>
                        </section>
                      ) : (
                        evt.content.split('\n\n').map((para, i) => (
                          <p key={i}>{para}</p>
                        ))
                      )}
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

      <AnimatePresence>
        {activeEvent?.variant === 'case-study' && (
          <motion.section
            className="tl-case-study"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            {activeEvent.media?.filter((item) => item.placement !== 'inline').map((item) => (
              <figure className="tl-case-study__figure" key={item.src}>
                <img
                  src={`${import.meta.env.BASE_URL}${item.src}`}
                  alt={item.alt}
                  className="tl-case-study__image"
                />
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
            <div className="tl-case-study__copy">
              {activeEvent.content.split('\n\n').map((para, i) => {
                const inlineMedia = activeEvent.media?.filter(
                  (item) => item.placement === 'inline' && item.afterParagraph === i,
                );

                return (
                  <div
                    className={`tl-case-study__entry ${inlineMedia?.length ? 'tl-case-study__entry--with-media' : ''}`}
                    key={i}
                  >
                    <p>{para}</p>
                    {inlineMedia?.map((item) => (
                      <figure className="tl-case-study__figure tl-case-study__figure--inline" key={item.src ?? item.caption}>
                        {item.images ? (
                          <div className="tl-case-study__image-pair">
                            {item.images.map((image) => (
                              <img
                                key={image.src}
                                src={`${import.meta.env.BASE_URL}${image.src}`}
                                alt={image.alt}
                                className="tl-case-study__image"
                              />
                            ))}
                          </div>
                        ) : (
                          <img
                            src={`${import.meta.env.BASE_URL}${item.src}`}
                            alt={item.alt}
                            className="tl-case-study__image"
                          />
                        )}
                        <figcaption>{item.caption}</figcaption>
                      </figure>
                    ))}
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

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
