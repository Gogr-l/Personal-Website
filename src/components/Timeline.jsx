import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Timeline.css';

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
            <figure className="tl-case-study__figure tl-case-study__figure--hero" key={item.src}>
              {renderImage(item.src, item.alt, 'tl-case-study__image', item.caption)}
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
                item.layout === 'persona' ? 'tl-case-study__figure--persona' : '',
                item.wide ? 'tl-case-study__figure--wide' : '',
              ].filter(Boolean).join(' ')}
              key={item.src ?? item.caption}
            >
              {item.images ? (
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
              <figcaption>{item.caption}</figcaption>
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

    const activationRange = centeredEvent.width / 2;
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

    setActiveTick(id);
    window.requestAnimationFrame(() => scrollEventToCenter(id));
  }, [activeTick, events, scrollEventToCenter]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (document.querySelector('.tl-image-lightbox')) return;
      setActiveTick(null);
    };
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
      if (el?.closest?.('.tl-image-lightbox')) return;
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
                {evt.title}
              </button>
            ))}
          </div>
        </nav>
        <div className="tl-header__case-studies-wrap">
          <button
            className="tl-header__case-studies"
            type="button"
            aria-haspopup="menu"
          >
            Case Studies
          </button>
          <div className="tl-header__case-studies-menu" role="menu" aria-label="Case studies">
            <button
              type="button"
              className="tl-header__case-studies-item"
              role="menuitem"
              onClick={() => openEvent('avarri')}
            >
              Avarri
            </button>
            <button
              type="button"
              className="tl-header__case-studies-item"
              role="menuitem"
              onClick={() => openEvent('windowconnect')}
            >
              Window Connect
            </button>
          </div>
        </div>
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
                  {activeTick === evt.id && (
                    <motion.div
                      className={[
                        'tl-event__content',
                        evt.variant === 'story' ? 'tl-event__content--story' : '',
                        evt.variant === 'case-study' ? 'tl-event__content--case-study' : '',
                      ].filter(Boolean).join(' ')}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {evt.variant === 'case-study' ? (
                        <CaseStudyContent event={evt} />
                      ) : evt.variant === 'story' ? (
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
