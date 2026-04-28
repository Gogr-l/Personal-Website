import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SolarSystem.css';

const SolarSystem = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const sections = [
    {
      id: 'story',
      name: 'Story',
      subtitle: 'THE BEGINNING',
      description: 'Every journey has an origin. This is where my story begins — the experiences, dreams, and moments that shaped who I am today. A narrative of growth, discovery, and endless curiosity.',
      color: '#FFB627',
      details: null,
    },
    {
      id: 'domlabs',
      name: 'DomLabs',
      subtitle: 'BUILDING VENTURES',
      description: 'From concept to reality. Building ventures that solve real problems and create lasting value. The thrill of turning ambitious ideas into thriving businesses that make a difference.',
      color: '#FF6B35',
      details: [
        {
          title: 'Washington Window Warriors LLC',
          year: '2020',
          content: `I started a window cleaning company not because it was flashy, but because it was straightforward and honest. Show up on time, deliver solid work, communicate clearly—and you get paid. Fall short, and you don't. No hiding behind fancy strategies or excuses. The loop was immediate and unforgiving.

That business became my crash course in real entrepreneurship. I learned how customers decide when it's their own money. Trust builds through reliability, not ads. Pricing has to work for everyone involved. I mastered scheduling, weekly revenue tracking, and taking payments any way they came—cash, check, app. I saw how small operational slips add up fast, so organization became non-negotiable.

Word-of-mouth turned into my best (and free) marketing channel as the client list grew. Text follow-ups to past customers filled quiet months. Adding Christmas light installations doubled winter revenue without new customer hunts. The company funded my later ventures, but more than cash, it taught me that business boils down to consistent, high-quality execution over time.`,
          image: null,
        },
        {
          title: 'Christmas Light Installations',
          year: '',
          content: `Expanding into holiday lights leveled me up. I was suddenly on multi-story roofs, managing tricky lines, real safety risks, heavy equipment, and clients who wanted professional polish—not just labor.

Safety and operations became part of the product I sold. I learned precise techniques (magnetic clips on flashing, efficient roof movement), minimized on-site time, and presented myself as someone reliable for complex jobs. It forced real planning—contingencies for weather, gear logistics, no more winging it. That discipline stuck.`,
          image: null,
        },
        {
          title: 'Window Connect',
          year: '2025',
          content: `Window Connect came from what I saw every day on the job: broken windows, foggy panes, damaged frames—leads I could spot instantly but couldn't act on. Window cleaners are perfectly positioned to find repair work early, yet no system connects us to repair companies.

I sketched a platform where cleaners submit warm leads, it routes them smartly to shops, and both sides earn. I focused on seamless integration with repair workflows—subscription plus per-lead fees.

This was pure field-born insight. Being in the trenches reveals gaps outsiders never notice.`,
          image: null,
        },
        {
          title: 'ConnectXR',
          year: '2024',
          content: `Networking IRL is often awkward. ConnectXR imagined fixing that with mixed reality: AR glasses show subtle digital icons above people nearby—shared interests, work history, mutual connections—without a word.

I dug into Bluetooth proximity, computer vision tracking, Apple Vision Pro limits, and iPhone camera hacks for an early prototype. The core idea was a "digital persona layer" overlaid on real space—like a dynamic, location-based Linktree visible only in AR.

It was more exploration than startup—pushing how future interfaces could make human connection smoother and more intuitive. It shifted how I view tech: not flashy gadgets, but invisible layers enhancing everyday life.`,
          image: null,
        },
        {
          title: 'Akulla Intelligence & McKinley Irvine Law AI',
          year: '2024',
          content: `In 2024, I partnered with my college roommate Curtis (Akulla Intelligence) to build an AI tool for McKinley Irvine Law. It started with a relationship and spotting a common pain: years of documents, procedures, and knowledge scattered across folders. Staff knew the info existed but wasted time hunting it.

We created a natural-language chatbot on top of their knowledge base—ask like you'd ask a colleague, get instant answers. Curtis led engineering; I identified the opportunity, built trust with the firm's leadership, clarified the problem, and connected the pieces.

The result: faster access, less friction for the team. It proved value in tech isn't just code—it's seeing the need, earning trust, defining the issue sharply, and assembling the right talent. AI shines brightest solving practical, everyday operational headaches in traditional businesses.`,
          image: null,
        },
        {
          title: 'Avarri',
          year: '2025',
          content: `Avarri fused my love for AI, design, and solving real problems. Interior designers struggle to help clients visualize changes—talking, sketching, hoping they "get it." I wanted to change that: upload a room photo, describe the update, instantly show a transformed version.

I interviewed dozens of designers to understand their process, client communication pain, and visualization breakdowns. Built workflows with image models, prompts, and product libraries. Wrote plans, pitched, won the Milgard School of Business VIBE Incubator prize. Iterated hard—dropped ideas like commissions when feedback said no.

Then tech reality hit: generative AI creates stunning images but struggles with precise fidelity (exact furniture, true finishes, spatial accuracy). For pros needing reliability, it fell short.

That sparked the pivot: bigger opportunity in real estate virtual staging. Take empty or generic homes and personalize them for buyers—show not generic staging, but "your future home" based on their tastes, lifestyle, preferences.

We built around personal ontology: input buyer style → generate tailored visualizations. It evolved from designer tool to personalization engine for home buying—helping people see themselves in a space before committing.

Avarri captures my approach: start with real conversations, hit technical limits, listen to feedback and reality, then adapt quickly to where the value truly is. Iteration over assumption, every time.`,
          image: null,
        },
      ],
    },
    {
      id: 'academia',
      name: 'Academia',
      subtitle: 'PURSUIT OF KNOWLEDGE',
      description: 'My academic journey has been full of pivots, each one guiding me closer to where technical skills, creative design, and business execution intersect. It built a foundation in analytical thinking, leadership, and practical problem-solving that I draw on every day in my ventures.',
      color: '#7B61FF',
      details: [
        {
          title: 'Washington Aerospace Scholars Program',
          year: '2018–2020',
          content: `As a high school junior, I was selected for the Washington Aerospace Scholars (WAS) program through The Museum of Flight, in partnership with NASA and the University of Washington. This selective, college-level experience is tailored for Washington state students passionate about STEM, emphasizing aerospace design, space exploration, and mission planning.

The program began with an intensive online curriculum from November to March, earning five UW credits. We explored air and space vehicle design, NASA's exploration strategies, and Earth/space science topics through rigorous aerospace math problems and virtual group challenges.

The real highlight was the optional summer residency at The Museum of Flight: a week of hands-on collaboration with NASA scientists, engineers, university students, and STEM professionals. Teams planned realistic human missions to Mars, covering trajectories, propulsion systems, resource allocation, and vehicle architecture. I served as propulsion team leader for our group, leading the design and optimization of the propulsion subsystem to ensure efficient thrust, fuel management, and reliable performance for the interplanetary journey.

Our team's mission concept stood out for its innovation, feasibility, and execution, earning us the Best Aerospace Startup award. This experience fueled my early interest in rocket engineering while teaching me how to lead under pressure, collaborate across disciplines, and turn technical constraints into effective solutions. Those skills translate directly to entrepreneurship.`,
          image: null,
        },
      ],
    },
    {
      id: 'projects',
      name: 'Projects',
      subtitle: 'CREATIVE WORKS',
      description: 'A collection of creative and technical endeavors. Each project represents a new world to explore, problems to solve, and meaningful experiences to craft for users everywhere.',
      color: '#4A9FD4',
      details: null,
    },
    {
      id: 'interests',
      name: 'Interests',
      subtitle: 'PASSIONS & HOBBIES',
      description: 'The pursuits that fuel creativity beyond work. Music, art, and the endless exploration of new experiences. These passions shape perspective and inspire innovation.',
      color: '#F7C331',
      details: null,
    },
    {
      id: 'vision',
      name: 'Vision',
      subtitle: 'LOOKING AHEAD',
      description: 'Where I see myself going and the impact I want to create. The future is built by those who imagine it first.',
      color: '#00D4AA',
      details: null,
    },
  ];

  const navigateTo = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Calculate position - items flow from right to left
  const getItemStyle = (index) => {
    const diff = index - currentIndex;

    // Current item (center)
    if (diff === 0) {
      return { x: '0%', opacity: 1, scale: 1, zIndex: 10 };
    }
    
    // Next item (to the right)
    if (diff === 1) {
      return { x: '350px', opacity: 0.35, scale: 0.4, zIndex: 5 };
    }
    
    // Two ahead (far right, barely visible)
    if (diff === 2) {
      return { x: '550px', opacity: 0.15, scale: 0.3, zIndex: 3 };
    }
    
    // Previous item (to the left, fading out)
    if (diff === -1) {
      return { x: '-350px', opacity: 0.2, scale: 0.35, zIndex: 5 };
    }

    // Hidden items
    if (diff > 2) {
      return { x: '700px', opacity: 0, scale: 0.25, zIndex: 0 };
    }
    
    return { x: '-500px', opacity: 0, scale: 0.25, zIndex: 0 };
  };

  const currentSection = sections[currentIndex];

  return (
    <section className="solar-system">
      {/* Sparse stars */}
      <div className="solar-system__stars">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="solar-system__star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              '--size': `${Math.random() * 1.5 + 0.5}px`,
            }}
          />
        ))}
      </div>

      {/* Content - Left side */}
      <div className="solar-system__content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection.id}
            className="solar-system__content-inner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <span className="solar-system__subtitle">{currentSection.subtitle}</span>
            <div className="solar-system__divider" style={{ background: currentSection.color }} />
            <p className="solar-system__description">{currentSection.description}</p>
            
            <motion.button
              className="solar-system__cta"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              EXPLORE
            </motion.button>

            {/* Details section for Business */}
            {currentSection.details && (
              <div className="solar-system__details">
                {currentSection.details.map((item, idx) => (
                  <article key={idx} className="solar-system__detail-item">
                    <header className="solar-system__detail-header">
                      <h3 className="solar-system__detail-title">{item.title}</h3>
                      {item.year && <span className="solar-system__detail-year">{item.year}</span>}
                    </header>
                    <div className="solar-system__detail-content">
                      {item.content.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>
                    {/* Image placeholder - add images here later */}
                    {item.image && (
                      <div className="solar-system__detail-image">
                        <img src={item.image} alt={item.title} />
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Word carousel - Right side */}
      <div className="solar-system__carousel">
        {sections.map((section, index) => {
          const style = getItemStyle(index);
          const isCenter = index === currentIndex;
          const isClickable = index > currentIndex && index <= currentIndex + 2;
          const canGoBack = index === currentIndex - 1;

          return (
            <motion.button
              key={section.id}
              className={`solar-system__word ${isCenter ? 'solar-system__word--center' : ''}`}
              onClick={() => navigateTo(index)}
              disabled={isAnimating || isCenter || (!isClickable && !canGoBack)}
              animate={{
                x: style.x,
                opacity: style.opacity,
                scale: style.scale,
              }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              whileHover={(isClickable || canGoBack) && !isAnimating ? { scale: style.scale * 1.08 } : {}}
              style={{ 
                zIndex: style.zIndex,
                '--word-color': section.color,
              }}
            >
              {section.name}
            </motion.button>
          );
        })}
      </div>

      {/* Progress indicator */}
      <div className="solar-system__progress">
        <span className="solar-system__progress-current">{String(currentIndex + 1).padStart(2, '0')}</span>
        <span className="solar-system__progress-sep">/</span>
        <span className="solar-system__progress-total">{String(sections.length).padStart(2, '0')}</span>
      </div>

      {/* Navigation hint */}
      <div className="solar-system__hint">
        Click to navigate →
      </div>
    </section>
  );
};

export default SolarSystem;
