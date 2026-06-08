import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Timeline.css';

const stopMediaEvent = (e) => {
  e.stopPropagation();
};

const TimelineVideo = ({ className, src, poster, aspectRatio }) => (
  <video
    className={className}
    src={src}
    poster={poster}
    style={aspectRatio ? { aspectRatio } : undefined}
    controls
    playsInline
    preload="metadata"
    onPointerDown={stopMediaEvent}
    onClick={stopMediaEvent}
  />
);

const CaseStudyImage = ({ src, alt, className, onExpand }) => (
  <button
    type="button"
    className="tl-case-study__image-btn"
    onClick={onExpand}
    aria-label={`View larger: ${alt}`}
  >
    <img src={src} alt={alt} className={className} />
  </button>
);

const ImageLightbox = ({ image, onClose }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      e.stopImmediatePropagation();
      onClose();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  return createPortal(
    <motion.div
      className="tl-image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <button
        type="button"
        className="tl-image-lightbox__close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
      >
        ×
      </button>
      <motion.img
        className="tl-image-lightbox__img"
        src={image.src}
        alt={image.alt}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
      />
      {image.caption ? <p className="tl-image-lightbox__caption">{image.caption}</p> : null}
    </motion.div>,
    document.body,
  );
};

const CaseStudyContent = ({ event }) => {
  const baseUrl = import.meta.env.BASE_URL;
  const heroMedia = event.media?.filter((item) => item.placement === 'hero') ?? [];
  const [expandedImage, setExpandedImage] = useState(null);

  const expandImage = useCallback((image) => {
    setExpandedImage(image);
  }, []);

  const closeImage = useCallback(() => {
    setExpandedImage(null);
  }, []);

  const renderImage = (src, alt, className, caption) => (
    <CaseStudyImage
      src={`${baseUrl}${src}`}
      alt={alt}
      className={className}
      onExpand={() => expandImage({ src: `${baseUrl}${src}`, alt, caption })}
    />
  );

  return (
    <div className="tl-case-study__layout">
      <AnimatePresence>
        {expandedImage && (
          <ImageLightbox key={expandedImage.src} image={expandedImage} onClose={closeImage} />
        )}
      </AnimatePresence>

      {heroMedia.length > 0 && (
        <div className="tl-case-study__hero">
          {heroMedia.map((item) => (
            <figure
              className={[
                'tl-case-study__figure',
                'tl-case-study__figure--hero',
                item.type === 'video' ? 'tl-case-study__figure--video' : '',
              ].filter(Boolean).join(' ')}
              key={item.src ?? item.caption}
            >
              {item.type === 'video' ? (
                <TimelineVideo
                  className="tl-case-study__video"
                  src={`${baseUrl}${item.src}`}
                  poster={item.poster ? `${baseUrl}${item.poster}` : undefined}
                  aspectRatio={item.aspectRatio}
                />
              ) : (
                renderImage(item.src, item.alt, 'tl-case-study__image', item.caption)
              )}
              {item.caption ? <figcaption>{item.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      )}

      <div className="tl-case-study__copy">
        {event.content.split('\n\n').map((para, i) => {
          const inlineMedia = event.media?.filter(
            (item) => item.placement === 'inline' && item.afterParagraph === i,
          );
          const isHeading = para.length < 120 && !/[.!?]$/.test(para.trim());
          const isPersonaStack = inlineMedia?.some((item) => item.layout === 'persona');
          const isStack = inlineMedia?.some((item) => item.layout === 'stack');

          const figureNodes = inlineMedia?.map((item) => (
            <figure
              className={[
                'tl-case-study__figure',
                'tl-case-study__figure--inline',
                item.type === 'video' ? 'tl-case-study__figure--video' : '',
                item.layout === 'persona' ? 'tl-case-study__figure--persona' : '',
                item.wide ? 'tl-case-study__figure--wide' : '',
              ].filter(Boolean).join(' ')}
              key={item.src ?? item.caption}
            >
              {item.type === 'video' ? (
                <TimelineVideo
                  className="tl-case-study__video"
                  src={`${baseUrl}${item.src}`}
                  poster={item.poster ? `${baseUrl}${item.poster}` : undefined}
                  aspectRatio={item.aspectRatio}
                />
              ) : item.images ? (
                <div className="tl-case-study__image-pair">
                  {item.images.map((image) => (
                    <CaseStudyImage
                      key={image.src}
                      src={`${baseUrl}${image.src}`}
                      alt={image.alt}
                      className="tl-case-study__image"
                      onExpand={() => expandImage({
                        src: `${baseUrl}${image.src}`,
                        alt: image.alt,
                        caption: item.caption,
                      })}
                    />
                  ))}
                </div>
              ) : (
                renderImage(item.src, item.alt, 'tl-case-study__image', item.caption)
              )}
              {item.caption ? <figcaption>{item.caption}</figcaption> : null}
            </figure>
          ));

          return (
            <div
              className={[
                'tl-case-study__entry',
                isHeading ? 'tl-case-study__entry--heading' : '',
                isPersonaStack ? 'tl-case-study__entry--persona' : '',
                isStack ? 'tl-case-study__entry--stack' : '',
              ].filter(Boolean).join(' ')}
              key={i}
            >
              {isHeading ? (
                <h3 className="tl-case-study__heading">{para}</h3>
              ) : (
                <p>{para}</p>
              )}
              {isPersonaStack ? (
                <div className="tl-case-study__persona-stack">{figureNodes}</div>
              ) : (
                figureNodes
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const WideContent = ({ event }) => {
  const baseUrl = import.meta.env.BASE_URL;
  const heroMedia = event.media?.filter((item) => item.placement === 'hero') ?? [];

  return (
    <>
      {heroMedia.length > 0 && (
        <div className="tl-wide__hero">
          {heroMedia.map((item) => (
            <figure className="tl-wide__figure tl-wide__figure--hero" key={item.src ?? item.caption}>
              {item.type === 'video' ? (
                <TimelineVideo
                  className="tl-wide__video"
                  src={`${baseUrl}${item.src}`}
                  poster={item.poster ? `${baseUrl}${item.poster}` : undefined}
                  aspectRatio={item.aspectRatio}
                />
              ) : (
                <img
                  src={`${baseUrl}${item.src}`}
                  alt={item.alt ?? ''}
                  className="tl-wide__image"
                />
              )}
              {item.caption ? <figcaption>{item.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      )}
      {event.content.split('\n\n').map((para, i) => {
    const inlineMedia = event.media?.filter(
      (item) => item.placement === 'inline' && item.afterParagraph === i,
    );

    return (
      <div className="tl-wide__entry" key={i}>
        <p>{para}</p>
        {inlineMedia?.map((item) => (
          <figure className="tl-wide__figure" key={item.src ?? item.caption}>
            {item.type === 'video' ? (
              <TimelineVideo
                className="tl-wide__video"
                src={`${baseUrl}${item.src}`}
                poster={item.poster ? `${baseUrl}${item.poster}` : undefined}
                aspectRatio={item.aspectRatio}
              />
            ) : (
              <img
                src={`${baseUrl}${item.src}`}
                alt={item.alt ?? ''}
                className="tl-wide__image"
              />
            )}
            {item.caption ? <figcaption>{item.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
    );
  })}
    </>
  );
};

const EventPanelContent = ({ event }) => {
  const baseUrl = import.meta.env.BASE_URL;

  if (event.variant === 'case-study') {
    return <CaseStudyContent event={event} />;
  }

  if (event.variant === 'wide') {
    return <WideContent event={event} />;
  }

  if (event.variant === 'story') {
    return (
      <section className="tl-story" aria-label="Story summary">
        <h2 className="tl-story__headline">{event.headline}</h2>
        {event.storyImage && (
          <img
            className="tl-story__image"
            src={`${baseUrl}${event.storyImage.src}`}
            alt={event.storyImage.alt}
          />
        )}
        <div className="tl-story__intro-block">
          {event.content.split('\n\n').map((para, i) => (
            <p
              key={i}
              className={`tl-story__intro${i === 0 ? ' tl-story__intro--lead' : ''}`}
            >
              {para.split('\n').map((line, j, lines) => (
                <span key={j}>
                  {line}
                  {j < lines.length - 1 && <br />}
                </span>
              ))}
            </p>
          ))}
        </div>
        {event.contact && (
          <div className="tl-story__contact">
            <span className="tl-story__contact-label">{event.contact.label}</span>
            <a
              className="tl-story__contact-email"
              href={`mailto:${event.contact.email}`}
            >
              {event.contact.email}
            </a>
          </div>
        )}
      </section>
    );
  }

  return event.content.split('\n\n').map((para, i) => (
    <p key={i}>{para}</p>
  ));
};

const Timeline = () => {
  const scrollRef = useRef(null);
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
      title: 'About',
      description: 'How I spot overlooked opportunities and turn them into practical systems.',
      variant: 'story',
      headline: 'Build The World',
      storyImage: {
        src: 'images/build-the-world-quest.png',
        alt: 'Dominic Martinez wearing a VR headset',
      },
      content: `Level 99 idea guy. Currently working on business number #4. $100,000+ entrepreneurial revenues. Future visionary and space exploration enthusiast.

It started with the Washington Aerospace Scholars program. NASA's response to America's aerospace talent shortage, it pulled high school juniors into serious air and space training. I ran propulsion as team leader, designing rocket systems at the Museum of Flight. That hands-on engineering mindset never left. I still build and launch homemade rockets, pilot FPV drones, and rapid-prototype wild concepts with Grok Imagine, Tinkercad, and Trellis. I even created a slick Grok commercial to channel that same energy.

At 17 I started Washington Window Warriors with door-knocking and a water-fed pole. It grew into a premium window cleaning, holiday lighting, and roof services business serving upper-tier homes in Tacoma, Gig Harbor, and Lakewood, clearing over $100k in revenue.

That same drive carried into everything else. I shipped a RAG-based AI chatbot at Akula Intelligence for McKinley Irvin Law. Co-founded AVARRI, the AI virtual staging platform that took 1st place for "Best Pitch" at VIBE 2025. Now I'm onto Window Connect, a SaaS platform that turns window cleaners into scouts feeding Pella, glaziers, and storm repair companies high quality leads. It earned 2nd place "Best Business Plan" at VIBE 2026. At the same time I'm prototyping "CXR" on the Meta Quest 3S: a consent-first AR social overlay using phone BLE beacons, person detection, and depth raycasting so nearby opt-in users get floating world-anchored profile cards with bios, interests, and links. It turns awkward stranger moments into natural, interest-aligned conversations.

I'm finishing my BBA in Business Administration with a minor in Innovation & Design at UW Tacoma. Fitness, longevity habits, and PNW life keep the machine sharp.`,
      contact: {
        label: 'Contact',
        email: 'martinezwdominic@gmail.com',
      },
    },
    {
      id: 'wwl',
      year: '2020',
      title: 'Window Warriors',
      url: 'https://wa-cleaning.com',
      description: 'My first operating business and the foundation for how I learned execution.',
      variant: 'case-study',
      content: `At 17 I started Washington Window Warriors with door-knocking and a water-fed pole. It grew into a premium window cleaning, holiday lighting, and roof services business serving upper-tier homes in Tacoma, Gig Harbor, and Lakewood, clearing over $100k in revenue. Show up on time, deliver solid work, communicate clearly, and you get paid. Fall short, and you do not. That immediate feedback loop became my crash course in real entrepreneurship.

Beyond residential routes, we took on large-format lighting projects that most small operators avoid. The work pushed us into event installs, multi-story commercial buildings, and permanent roofline systems that had to look flawless from the ground and hold up through Pacific Northwest weather.

Lakewold Gardens Winter Glow

We handled lighting for Lakewold Gardens' Winter Glow event, one of the South Sound's signature holiday experiences. That meant lighting long garden paths, architectural features, and signature structures so thousands of visitors could walk through a cohesive winter landscape after dark. We outlined brick walkways, wrapped the estate manor, and lit the iconic dome structure at the end of the main path. Warm white accents on the buildings paired with cool blue uplighting in the tree canopy to create the layered glow Winter Glow is known for.

Commercial Permanent Lighting

We have also installed permanent commercial lighting at Harbor Heights in Olympia and Jefferson Flat in Tacoma. Harbor Heights is a large multi-wing residential complex where we outlined entire rooflines with permanent warm-white LED systems so the building reads clean and elevated at night year-round, not just during the holidays.

Jefferson Flat was a different scale of challenge: steep metal roof sections, rooftop railings, and multi-story edges overlooking downtown Tacoma. The installs required harnessed work on sloped surfaces and along high parapet lines with the Tacoma Dome and city skyline in the background. Those jobs taught us how to plan cable runs, coordinate with property management, and execute safely on buildings where there is zero margin for sloppy work.

Word-of-mouth became our best marketing channel as the client list grew. Text follow-ups to past customers filled quiet months. Holiday and permanent lighting doubled winter revenue without new customer hunts. Window Warriors funded later ventures, but more than cash it taught me that business boils down to consistent, high-quality execution over time.`,
      media: [
        {
          images: [
            {
              src: 'case-studies/window-warriors-lakewold-path.png',
              alt: 'Lakewold Gardens Winter Glow brick pathway lined with warm lights leading to a lit dome structure',
            },
            {
              src: 'case-studies/window-warriors-lakewold-manor.png',
              alt: 'Lakewold Gardens estate manor wrapped in warm white holiday lights with blue-lit evergreens',
            },
          ],
          caption: 'Lakewold Gardens Winter Glow — pathway lighting and estate manor install for the annual event.',
          placement: 'inline',
          afterParagraph: 3,
        },
        {
          src: 'case-studies/window-warriors-harbor-heights.png',
          alt: 'Harbor Heights apartment complex in Olympia at night with permanent warm white roofline lighting',
          placement: 'inline',
          wide: true,
          afterParagraph: 5,
        },
        {
          images: [
            {
              src: 'case-studies/window-warriors-jefferson-flat-roof.png',
              alt: 'Window Warriors installer on a sloped metal roof at Jefferson Flat with the Tacoma Dome in the background',
            },
            {
              src: 'case-studies/window-warriors-jefferson-flat-railing.png',
              alt: 'Harnessed Window Warriors crew member installing permanent lights along a high-rise rooftop railing at Jefferson Flat in Tacoma',
            },
          ],
          placement: 'inline',
          afterParagraph: 5,
        },
      ],
    },
    {
      id: 'connectxr',
      year: '2024',
      title: 'Connect XR',
      variant: 'wide',
      description: 'Early MR networking prototype bridging physical presence with digital identity.',
      content: `I am currently in the early stages of prototyping Connect XR, a theoretical mixed reality networking platform that explores how AR, VR, and AI can transform real-world social environments into interactive digital spaces by bridging physical presence with our complete digital identities.

The core challenge I have been reflecting on is one I encounter regularly in professional and social settings. Real-world networking continues to feel inefficient and awkward. Whether at conferences, university campuses, coworking spaces, startup events, airport lounges, or casual coffee shops, people often struggle to identify relevant connections, hesitate to initiate conversations, miss valuable opportunities, and quickly forget names and shared interests afterward. Meanwhile, our digital identities remain fragmented across LinkedIn, personal websites, portfolios, social profiles, and online communities, existing entirely apart from the physical moments when they could create the greatest impact. Most current XR experiences prioritize entertainment, gaming, or solitary productivity, leaving a significant gap: there is no robust social layer that makes human connection in mixed reality feel natural, contextual, and ambient.

Connect XR represents my conceptual response to this gap. In theory, the platform would function as an AR-native social layer, allowing people wearing XR devices or using a simple phone-based MVP to discover and interact with nearby individuals through subtle spatial digital overlays. As you look at or gesture toward someone in your field of view, their profile would appear anchored in real space around them. You would instantly see contextual information such as their name and professional background, shared interests or mutual connections, links to social profiles, recent projects or achievements, AI-powered compatibility signals, thoughtful conversation starters drawn from genuine common ground, and a frictionless way to connect. The goal is to make networking feel intelligent and effortless rather than forced or transactional. At its heart, Connect XR would act like a spatial Linktree for people, dynamically bringing fragmented digital identities into the physical world precisely when and where they matter most.

Theoretically, the system would operate through an integrated pipeline. It would begin with nearby user detection via Bluetooth Low Energy and peer-to-peer communication. Computer vision, spatial positioning, signal strength analysis, and motion correlation would then associate detected devices with the actual people in view. Clean AR overlays would follow each person as they move, displaying profile previews, interest indicators, and connect buttons that remain anchored in real space. An AI context engine would analyze interests, career paths, social graph overlaps, and shared experiences to surface meaningful signals and smart conversation starters in real time. Instead of simply seeing a name, the experience might reveal that the person nearby is building in climate tech, that you both studied business, or that you follow the same venture capital firms.

At this early prototyping stage, I am focusing development on the Meta Quest because it offers full camera access and broad accessibility. I am actively building a functional demo that will test nearby user detection, reliable person-device matching, dynamic spatial AR overlays on real people, and the full AI-driven contextual experience in actual social settings. This hands-on work will allow me to validate the core concepts, gather real-world feedback, and refine the interaction design before expanding further.

My long-term vision for Connect XR is to establish it as the foundational spatial social network layer across the broader XR ecosystem. Eventually it could run smoothly on a range of devices, including Apple Vision Pro, Meta AR glasses, Android XR hardware, and lightweight everyday smart glasses. In essence, I am working toward a future in which digital identity exists naturally in physical space around every person, making human connection dramatically easier, smarter, and more meaningful.

In one sentence, Connect XR is the AR-native social layer that helps you discover, understand, and instantly connect with the right people around you in the real world. I look forward to sharing the first working Meta Quest prototype soon and would welcome conversations with others exploring spatial computing, social XR, or AI.`,
      media: [
        {
          type: 'video',
          src: 'videos/connectxr-concept-demo-720p.mp4',
          poster: 'videos/connectxr-concept-demo-poster.jpg',
          aspectRatio: '1280 / 720',
          caption: 'Connect XR concept demo — early vision for spatial AR networking overlays in the physical world.',
          placement: 'hero',
        },
      ],
    },
    {
      id: 'akulla',
      year: '2024',
      title: 'Akulla Intelligence',
      variant: 'case-study',
      description: 'An AI knowledge-base project built around a real operational pain point.',
      content: `At the end of my sophomore year I was visiting my old roommate Curtis at Gonzaga and we kept circling back to the same idea of starting something together in the fast-moving world of consumer artificial intelligence. Curtis has a rare gift for technical architecture and system design so I knew I wanted him involved from the start. Around the same time I was having parallel conversations with my friend Jack at UW Tacoma who mentioned that his dad Mr. McKinley was exploring AI options for the family law firm. That connection felt too promising to ignore. Jack and I sat down with Mr. McKinley and he challenged us directly on why two students with no prior technical track record should be trusted with work inside his firm. I was failing my CS 101 class at the time so the conversation was tough but it pushed us to get concrete. Later that day we got Curtis on the phone and landed on a focused concept. We would build a chatbot that pulled directly from the firm's employee handbook so staff could ask normal questions in plain language and receive instant accurate answers instead of hunting through folders or static PDFs.

We turned that concept into a formal written proposal dated December 21 2024 which I co-authored with Curtis Carlson and Jack McKinley. The document outlined a clear three-phase approach starting with a proof-of-concept trained solely on the existing employee handbook followed by iteration based on internal feedback and later expansion into additional resources like style guides HR bulletins and curated legal references. It specified a natural-language interface accessible through a web portal and emphasized secure handling of all data. The proposal also laid out hosting options including a secure subdomain on Akula infrastructure integration into the firm's own systems or deployment through a compliant third-party service. Mr. McKinley and his team liked the practicality of the starter project and we moved forward.

Once we had the green light Curtis took the lead on the engineering while Jack and I handled quality control relationship management and day-to-day communication with the client. The system we delivered is a retrieval-augmented generation setup hosted on Microsoft Azure. It uses Azure Cognitive Search to index the handbook content and OpenAI models to generate responses grounded in that source material. One of the most important details we documented in the operational guide I helped create is a simple but effective formatting convention for any new documents added later. We insert clear markers like Page 1 Begins and Page 1 Ends directly into the source files so the chatbot can always cite the exact original page when it answers a question. This small step prevents the common problem of broken references after PDFs are converted and it gives the law firm confidence that every answer is traceable.

The interface itself is fully customizable through environment variables so the firm can update titles logos favicons and even toggle features like chat history or share buttons without touching any code. Authentication is handled through Microsoft Entra ID with managed identities to keep access secure while still allowing straightforward internal use. The entire solution lives inside a dedicated Azure resource group that includes the App Service hosting the web application a Key Vault for secrets and the AI project workspace that connects everything together. I was not writing the models or managing the infrastructure but I made sure the technical choices stayed aligned with what the client actually needed and that the final product matched the vision we sold them.

In the end we delivered a working system and sold it to McKinley Irvin Law for several thousand dollars. The result is a practical tool that removes daily friction for the team by giving them on-demand access to policies procedures and guidelines in a conversational format. For me the project was a full-circle entrepreneurial experience that started with late-night conversations in a dorm room moved through a tough client pitch and ended with a profitable exit we built ourselves while still in college. It reinforced that the most valuable work in technology is often not the code itself but the ability to spot a real operational pain point earn trust with the people who live with it every day define the problem clearly and bring the right skills together to solve it. Curtis handled the deep technical architecture. I focused on connecting the opportunity the client and the execution. That connector role is the one I continue to play and this project remains one of the clearest examples of why it matters.`,
      media: [
        {
          type: 'video',
          src: 'videos/mckinley-irvin-demo-720p.mp4',
          poster: 'videos/mckinley-irvin-demo-poster.jpg',
          aspectRatio: '960 / 656',
          caption: 'McKinley Irvin Law chatbot demo — handbook Q&A in the delivered interface.',
          placement: 'hero',
        },
      ],
    },
    {
      id: 'avarri',
      year: '2025',
      title: 'Avarri',
      url: 'https://avarri.design',
      description: 'An AI virtual staging product that evolved from real estate photos into a live Seldens sales workflow.',
      content: `I started Avarri as an AI powered virtual staging tool for real estate agents. The first version let users upload photos of a room or listing and generate cleaner staged versions that made the space easier for buyers to imagine.

The idea originally started with interior designers. I wanted to build a tool that let designers take a real room photo and precisely edit furniture, flooring, materials, and decor. That early concept helped me win 1st place for best pitch at the Milgard 2025 VIBE Business Plan Competition, but customer discovery quickly showed me that designers needed more precision than image models could reliably provide at the time.

I spent months talking with interior designers, consignment store owners, furniture buyers, and real estate agents. Designers cared deeply about scale, material accuracy, lighting, and exact placement. Real estate agents had a similar visual problem, but their bar was different: they needed listings to look clean, staged, and appealing fast. That pushed Avarri toward a simpler real estate workflow with bulk staging, preset styles, and custom prompt controls.

After stepping away from Avarri for a while, I came back with a more specific problem: what if a Seldens sales rep could walk into a customer's home, pull up real Seldens inventory on a phone, and show that furniture in the actual room during the meeting? That question became Live, a vendor-specific staging workflow built around Seldens' product catalog instead of generic furniture prompts.

For Live, I built a catalog sync pipeline that pulls Seldens' public Shopify feed, mirrors product images into Supabase as optimized WebP assets, and upserts thousands of products into the app with every available product angle. That multi-angle reference set matters because the AI can work from real geometry, materials, and proportions instead of guessing from a single hero photo. Removed SKUs are marked unavailable instead of disappearing, and the sync can run on a schedule or be triggered manually.

I also rebuilt the browsing experience around how a rep would actually sell. The Live catalog supports search, sorting, product filters, sale and in-stock toggles, and a persistent "My Selection" tray. Reps can browse products, save a working set, drill into details, take or upload a room photo from a phone, and keep the appointment moving without losing context.

The core feature is Stage in room. A rep selects real Seldens pieces, adds optional notes like "sectional facing the windows" or "keep the existing rug," and generates a staged scene. Under the hood, a planner model reads the room photo and product angles, decides where each piece should go, and chooses the best reference views. A renderer then uses the room, staging plan, and ordered product references to produce a single staged photograph. The results are not perfect yet, but the end-to-end workflow works and gives reps a much more concrete way to discuss design choices with customers.

Live is still early and access is gated while the workflow is validated, but the product now has a real vertical slice: more than 2,500 Seldens products, multi-angle references, mobile capture, staged room generation, editing, downloads, saved results, and project/library flows. The next challenge is consistency: tighter room preservation, more deterministic regenerations, and better iteration on existing staged outputs.

The biggest lesson from Avarri is that the best product is not just about what the technology can do. It is about pointing the technology at the right sales motion. Live is not just Avarri with a product grid. It is Avarri focused on one vendor, one catalog, one rep workflow, and one moment that matters: helping a customer see Seldens furniture in their own room while the decision is still being made.`,
      variant: 'case-study',
      media: [
        {
          type: 'video',
          src: 'videos/avarri-live-mode.mp4',
          poster: 'videos/avarri-live-mode-poster.jpg',
          aspectRatio: '1476 / 1080',
          caption: 'Avarri live mode prototype. Using Seldens live furniture catalog for virtual staging.',
          placement: 'hero',
        },
        {
          src: 'case-studies/avarri-pitch-examples.png',
          alt: 'Avarri pitch deck examples showing virtual staging before and after images',
          caption: 'These are examples from the pitch deck I used in the Milgard 2025 VIBE Business Plan competition. Avarri won 1st place for best pitch.',
          placement: 'inline',
          afterParagraph: 1,
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
      url: 'https://www.windowconnect.app',
      description: 'A two-sided referral marketplace connecting window cleaners with repair companies.',
      variant: 'case-study',
      content: `I built Window Connect to solve a simple but expensive gap in the home services market: window cleaners regularly notice damaged windows, rotting frames, fogged seals, and cracked glass, but there is no easy way for them to turn those observations into qualified repair referrals. At the same time, window repair companies need warm, local leads that are more trustworthy than generic ad leads. Window Connect connects those two groups through a referral workflow where cleaners submit damage leads, repair companies receive matched opportunities, and payments are tracked through the platform.

User Research Section: Insights from Eugene (Window Repair Company Owner)

As part of our early validation process for Window Connect, I conducted a detailed 90-minute discovery call with Eugene, owner of a well-established residential window repair and replacement company in the South Sound area. Eugene represents our core demand-side user: a hands-on operator who balances high-volume service with a strong reputation for honesty and quality. I walked him through the current prototype, explained the $60 lead model ($45 to the cleaner), the preferred partner routing, and the mobile submission flow for cleaners.

Key Feedback & Pain Points Identified

Eugene showed genuine interest in the platform but pushed back on several aspects of the initial model. Lead Quality Over Volume: He views single-pane or minor glass-only repairs as low-value and often not worth pursuing aggressively. He's willing to pay significantly more — $150–$200 — for qualified full-house replacement leads (older windows, multiple panes, clear customer interest). Minor leads feel like a step backward compared to his current inbound word-of-mouth business. Incentive Misalignment: While he understands the need to pay cleaners, he emphasized that cleaners must be trained and incentivized to spot high-potential opportunities (e.g., single-pane windows, hard-to-operate windows, wood rot, windows 20+ years old). He offered practical qualifying questions cleaners could ask homeowners during intake: "How old are your windows?" and "Do they open and close easily?" Mutual Value & Reciprocity: Eugene proposed creative win-win structures beyond simple lead fees: free or discounted window cleaning promos bundled with full replacements to fill cleaners' slower winter schedules; reciprocal lead flow (window jobs back to cleaners for every replacement closed); and preferred partner relationships where reliable cleaners get consistent work and priority routing. Feature Gaps Highlighted: strong need for lead filters on the company dashboard (minimum number of windows, window age, residential only, damage type); better photo and measurement guidance for cleaners to reduce wasted trips; visibility into cleaner performance and lead quality ratings; and ability for companies to build direct, trusted relationships with top cleaners.

What Worked Well

Eugene liked the warm referral angle — a cleaner who is already trusted in the home has a huge credibility advantage. He also appreciated the preferred partner model (cleaners choosing their company) because it rewards good behavior and builds real relationships rather than a random rotation system like Angie's List. He explicitly said the concept has legs and could evolve into something bigger than generic lead gen platforms, especially if we focus on honest, high-quality matches in the window niche.

Actionable Learnings & Product Implications

This conversation was extremely valuable and directly shaped our roadmap: shift toward qualified leads with educational resources, checklists, photo guidelines, and age/intent qualifiers; move beyond flat $60 leads toward tiered or subscription plus performance bonuses for premium leads; build network effect tools like tipping, preferred partner favoritism, and reciprocal job flow; add cleaner enablement with training materials, scripts, and post-job inspection reports; and treat Eugene's openness to testing once filters are added as a validation signal for product-market fit with the right companies.

Bottom line: Eugene reinforced that Window Connect's biggest differentiator is the distributed field intelligence from cleaners who are already inside homes. Success won't come from volume alone but from quality, trust, and mutual business growth between cleaners and repair companies.

At the center of the system is a role-based experience for three types of users: cleaners, repair companies, and admins. Cleaners can submit leads and track referrals, companies can manage their lead inbox and update lead outcomes, and admins can oversee disputes, payment holds, payouts, and unassigned leads. The system uses authentication and role protection so each user lands in the right dashboard and only sees the workflow meant for their role.

The most important system is the lead routing engine. When a cleaner enters a ZIP code or uses device location, Window Connect checks which repair companies serve that area. It considers whether the company is accepting leads, whether it is within its monthly lead or cash budget, whether it has a Google rating, and when it last received a lead. The result is a round-robin style assignment with a slight rating bias, so distribution is fair while still rewarding stronger companies. Cleaners can also have a preferred repair company, and the system checks whether that preferred company serves the ZIP and is currently available.

Systems Specifications

The cleaner submit lead page is designed to be fast in the field. I structured it so the cleaner starts with location, because ZIP code determines whether the lead can be matched immediately. They can use their device location or manually enter a ZIP code, and once the location is confirmed, the page shows the matched repair company inline. From there, the cleaner uploads photos, selects the issue type, enters the number of damaged windows, adds optional notes, and provides the customer's name and phone number. Before submitting, the cleaner must confirm the homeowner gave permission to share their contact information with a repair company.

The submit page also handles edge cases directly in the interface. If the preferred company is paused, outside the ZIP, or unavailable, the cleaner sees a clear warning and can switch to auto-match. If there are no companies in the ZIP yet, the cleaner can still submit the lead for review, and the system saves it as unassigned so an admin can match it later. After submission, the cleaner sees a success state that confirms whether the lead went to a company and reminds them they can earn $45 once the lead is approved.

For repair companies, the lead inbox is the main working surface. I designed it as a compact list of assigned opportunities with high-signal information: customer name, issue type, status, submission time, address, phone or email, and number of damaged windows. At the top, companies see summary stats like total leads, leads received this week, and leads left based on their budget settings. This gives the company a quick sense of pipeline volume before they even open an individual lead.

Each lead card links to a dedicated lead detail page. When a company clicks a lead, the system loads the full lead record, related cleaner information, uploaded photos, status history, and any existing tip or report state. Opening the lead also marks it as viewed by the company, which lets the inbox distinguish fresh leads from ones the company has already reviewed. This creates a simple operational rhythm: new leads arrive in the inbox, the company opens the details, contacts the customer, and updates the lead as it moves through the sales process.

The company lead detail page is built around actionability. At the top, the company sees quick status actions like Contacted, Scheduled, Won, Lost, or Invalid. Below that, the main card shows the photos first, because visual proof is one of the biggest advantages of cleaner-sourced referrals. The page then shows customer contact buttons, address, issue type, damaged window count, submission time, preferred contact time, cleaner notes, and a "referred by" section. There is also a warm outreach tip that reminds the repair company to mention the cleaner by name, which helps turn a cold call into a trusted introduction.

I also built a reporting and dispute path into the lead detail page. If a repair company believes a lead is invalid, duplicated, unreachable, or otherwise problematic, they can report the issue. That creates a lead report for admin review and flags the related payment hold as disputed and extended, which prevents automatic capture while the issue is investigated. This protects repair companies from bad leads while still keeping the referral workflow accountable.

I designed the repair company analytics page to give companies a clear view of whether Window Connect is actually producing value for them. Instead of only showing a list of leads, the page turns their activity into business metrics: total leads, new leads, won leads, conversion rate, estimated repair value, and billing-related totals. I wanted repair companies to quickly understand how many opportunities they received, how many turned into jobs, and where each lead stands in the funnel. The page also helps companies connect their lead spend to potential revenue, which makes the platform feel less like an inbox and more like a performance dashboard for their referral channel.

The billing system is designed around trust between both sides. When a lead is assigned to a company, the system creates a $60 payment hold using Stripe manual capture. The hold gives the repair company time to review and work the lead, while preserving the cleaner's expected $45 payout if the lead is approved. If there is no dispute, the hold can be captured and the cleaner payout record is created. If there is a dispute, the admin can review before money moves.

The platform also supports tips from repair companies to cleaners. On older leads, the company may see a prompt asking whether the lead converted and offering a way to tip the referring cleaner. Tips are charged to the company's saved card and transferred through Stripe Connect. This gives companies a direct way to reward high-quality referral partners, and it reinforces the network effect: cleaners who are rewarded are more likely to keep choosing that company.

The cleaner "Payouts" page is where field techs see whether referral work is actually turning into money. Window Connect pays $45 per approved lead after a 14-day verification period; that rule is front and center so cleaners know what "pending" means versus money they can touch.

If someone has not finished bank setup, the page walks them through Stripe Connect onboarding: a clear "set up / continue" path, plus a "still needed" checklist when Stripe is blocking payouts (ID, bank account, TOS, etc.). This matters because cleaners will abandon the product if payouts feel vague; here the blocker is named instead of hidden behind a generic error.

Once connected, the page splits money into available versus pending balance. Available is what they can withdraw; pending holds earnings still in verification or in flight at Stripe. A short help popover explains that split so people do not assume the app "lost" their cash. There is a withdraw-to-bank action for available funds (with a minimum so tiny transfers do not break), and a Stripe dashboard link for power users who want the full account view. "Withdrawal history" lists past transfers with status pills (pending, processing, completed, failed) so there is an audit trail for reference with support.

Below that, "lead payouts" ties dollars back to real work: each row shows the customer/location context, when the payout was created, amount, and status (e.g. pending vs paid vs rejected).

Finally, a compact "how payouts work" section restates the business rules (including automatic deposits every two weeks vs manual withdraw), and "report issue" is visible at the bottom so friction in payouts can become a support ticket.

Overall, Window Connect turns an informal referral behavior into a structured marketplace. Cleaners get a simple mobile-friendly way to monetize observations they already make on the job. Repair companies get warm, local, photo-backed leads with customer contact information and context. Admins get the oversight needed to manage disputes, billing, payouts, and unassigned leads. The result is a system where every lead has a clear path from field observation to company follow-up to payment.`,
      media: [
        {
          type: 'video',
          src: 'videos/window-connect-case-study-720p.mp4',
          poster: 'videos/window-connect-case-study-poster.jpg',
          caption: 'Window Connect case study overview.',
          placement: 'hero',
        },
        {
          src: 'case-studies/window-connect-persona-supply.png',
          alt: 'Target customer persona for Tyler Brooks, independent window cleaner on the supply side',
          caption: 'Supply-side persona: Tyler Brooks — independent window cleaner who spots damage in the field.',
          placement: 'inline',
          afterParagraph: 0,
          layout: 'persona',
        },
        {
          src: 'case-studies/window-connect-persona-demand.png',
          alt: 'Target customer persona for Eugene, window repair company owner on the demand side',
          caption: 'Demand-side persona: Eugene — residential window repair and replacement operator in the South Sound.',
          placement: 'inline',
          afterParagraph: 0,
          layout: 'persona',
        },
        {
          src: 'case-studies/window-connect-new-lead.png',
          alt: 'Window Connect mobile New Lead form with location, photos, issue details, customer contact, and submit lead',
          caption: 'Cleaner submit flow: ZIP or location, photo upload, issue type, customer details, and homeowner consent.',
          placement: 'inline',
          layout: 'stack',
          afterParagraph: 13,
        },
        {
          src: 'case-studies/window-connect-lead-detail.png',
          alt: 'Window Connect lead detail for Marriott Tacoma Downtown showing status actions, cracked glass photos, outreach tip, and referral from Brennan Hamlin',
          caption: 'Company lead detail: status workflow, photos, job context, warm-outreach tip, cleaner notes, and referral source.',
          placement: 'inline',
          layout: 'stack',
          afterParagraph: 17,
        },
        {
          src: 'case-studies/window-connect-analytics.png',
          alt: 'Window Connect analytics dashboard with lead KPIs, damage mix, ZIP performance, and lead spend summary',
          caption: 'Company analytics: lead volume, status mix, damage types, ZIP and issue performance, plus lead spend and cost per won lead.',
          placement: 'inline',
          layout: 'stack',
          wide: true,
          afterParagraph: 19,
        },
        {
          src: 'case-studies/window-connect-payouts.png',
          alt: 'Window Connect mobile payouts screen with available balance, withdrawal history, and per-lead payout status',
          caption: 'Cleaner payouts: available and pending balance, withdraw to bank, withdrawal history, and lead payout rows.',
          placement: 'inline',
          layout: 'stack',
          afterParagraph: 23,
        },
      ],
    },
  ], []);

  const activeEvent = useMemo(
    () => events.find((evt) => evt.id === activeTick) ?? null,
    [events, activeTick],
  );

  useEffect(() => {
    if (activeTick) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTick]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setScrollProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);
    lastScrollLeftRef.current = el.scrollLeft;
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
    setActiveTick(id);
    window.requestAnimationFrame(() => scrollEventToCenter(id));
  }, [scrollEventToCenter]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (document.querySelector('.tl-image-lightbox')) return;
      setActiveTick(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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

      {/* Header */}
      <header className="tl-header">
        <span className="tl-header__name">Dominic Martinez</span>
        <nav className="tl-fast-track" aria-label="Fast track timeline navigation">
          <div className="tl-fast-track__items">
            {events.map((evt) => (
              <button
                key={evt.id}
                className={`tl-fast-track__item ${activeTick === evt.id ? 'active' : ''}`}
                type="button"
                onClick={() => openEvent(evt.id)}
                aria-label={`Go to ${evt.title}`}
                aria-current={activeTick === evt.id ? 'true' : undefined}
              >
                <span className="tl-fast-track__label">{evt.title}</span>
                <span className="tl-fast-track__description">{evt.description}</span>
              </button>
            ))}
          </div>
        </nav>
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
                {evt.url ? (
                  <a
                    href={evt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`tl-event__title tl-event__title--linked ${activeTick === evt.id ? 'active' : ''}`}
                    aria-label={`${evt.title} (opens website)`}
                  >
                    {evt.title}
                  </a>
                ) : (
                  <button
                    type="button"
                    className={`tl-event__title ${activeTick === evt.id ? 'active' : ''}`}
                    onClick={() => openEvent(evt.id)}
                  >
                    {evt.title}
                  </button>
                )}
                {evt.year
                  ? <span className="tl-event__year">{evt.year}</span>
                  : <span className="tl-event__year-placeholder">&nbsp;</span>
                }
              </div>

              {/* CENTER: dot on the line */}
              <div className="tl-event__dot-wrap">
                <span className={`tl-event__dot ${activeTick === evt.id ? 'active' : ''}`} />
              </div>

            </div>
          ))}

          {/* Spacer end */}
          <div className="tl-spacer" />
        </div>

        {/* Continuous timeline line */}
        <div className="tl-line" />
      </div>

      <div className="tl-content-viewport">
        <AnimatePresence mode="wait">
          {activeEvent && (
            <motion.div
              key={activeEvent.id}
              className={[
                'tl-event__content',
                activeEvent.variant === 'story' ? 'tl-event__content--story' : '',
                activeEvent.variant === 'case-study' ? 'tl-event__content--case-study' : '',
                activeEvent.variant === 'wide' ? 'tl-event__content--wide' : '',
              ].filter(Boolean).join(' ')}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <EventPanelContent event={activeEvent} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Timeline;
