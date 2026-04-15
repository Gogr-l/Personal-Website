import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  const titleWords = ['Creative', 'Developer'];
  
  const floatingShapes = [
    { id: 1, emoji: '✦', delay: 0, x: '10%', y: '20%' },
    { id: 2, emoji: '◆', delay: 0.5, x: '85%', y: '15%' },
    { id: 3, emoji: '○', delay: 1, x: '75%', y: '70%' },
    { id: 4, emoji: '✧', delay: 1.5, x: '15%', y: '75%' },
    { id: 5, emoji: '△', delay: 2, x: '90%', y: '45%' },
  ];

  return (
    <section className="hero">
      {/* Floating decorative shapes */}
      {floatingShapes.map((shape) => (
        <motion.span
          key={shape.id}
          className="hero__shape"
          style={{ left: shape.x, top: shape.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.6, 
            scale: 1,
            y: [0, -20, 0],
          }}
          transition={{
            opacity: { delay: shape.delay + 0.5, duration: 0.5 },
            scale: { delay: shape.delay + 0.5, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
            y: { delay: shape.delay + 1, duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }}
        >
          {shape.emoji}
        </motion.span>
      ))}

      <div className="hero__container">
        <motion.div 
          className="hero__badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="hero__badge-dot"></span>
          <span>Available for work</span>
        </motion.div>

        <div className="hero__title-wrapper">
          <motion.h1 className="hero__greeting"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Hey, I'm Dom
          </motion.h1>
          
          <h2 className="hero__title">
            {titleWords.map((word, wordIndex) => (
              <span key={word} className="hero__title-word">
                {word.split('').map((letter, letterIndex) => (
                  <motion.span
                    key={letterIndex}
                    className="hero__title-letter"
                    initial={{ opacity: 0, y: 100, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.4 + (wordIndex * 0.3) + (letterIndex * 0.03),
                      ease: [0.34, 1.56, 0.64, 1]
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h2>
        </div>

        <motion.p 
          className="hero__description"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          I craft delightful digital experiences through code, 
          turning complex ideas into elegant, user-friendly interfaces.
        </motion.p>

        <motion.div 
          className="hero__cta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <motion.a 
            href="#projects" 
            className="hero__button hero__button--primary"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View My Work</span>
            <span className="hero__button-arrow">→</span>
          </motion.a>
          
          <motion.a 
            href="#contact" 
            className="hero__button hero__button--secondary"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            Get in Touch
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div 
          className="hero__scroll-line"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span>Scroll</span>
      </motion.div>
    </section>
  );
};

export default Hero;

