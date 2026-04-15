import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  const skills = [
    { name: 'JavaScript', level: 95 },
    { name: 'React', level: 90 },
    { name: 'Node.js', level: 85 },
    { name: 'CSS/Sass', level: 92 },
    { name: 'TypeScript', level: 80 },
    { name: 'Python', level: 75 },
  ];

  const funFacts = [
    { emoji: '☕', text: 'Powered by coffee' },
    { emoji: '🎮', text: 'Gamer at heart' },
    { emoji: '🎸', text: 'Music enthusiast' },
    { emoji: '🌱', text: 'Always learning' },
  ];

  return (
    <section id="about" className="about">
      <div className="about__container">
        <div className="about__grid">
          {/* Left Column - Image/Visual */}
          <motion.div
            className="about__visual"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="about__image-wrapper">
              <div className="about__image">
                <span className="about__avatar">👨‍💻</span>
              </div>
              <div className="about__image-decoration about__image-decoration--1"></div>
              <div className="about__image-decoration about__image-decoration--2"></div>
              <div className="about__image-decoration about__image-decoration--3"></div>
            </div>

            {/* Fun facts floating around */}
            <div className="about__fun-facts">
              {funFacts.map((fact, index) => (
                <motion.div
                  key={fact.text}
                  className="about__fun-fact"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <span className="about__fun-fact-emoji">{fact.emoji}</span>
                  <span className="about__fun-fact-text">{fact.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            className="about__content"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="about__label">About Me</span>
            <h2 className="about__title">
              A developer who loves
              <span className="gradient-text"> turning ideas into reality</span>
            </h2>

            <div className="about__text">
              <p>
                Hey there! I'm a passionate developer with a love for creating 
                beautiful, intuitive digital experiences. When I'm not coding, 
                you'll find me exploring new technologies, contributing to open 
                source, or perfecting my coffee brewing skills.
              </p>
              <p>
                I believe that great software is a blend of solid engineering 
                and thoughtful design. Every project is an opportunity to learn 
                something new and push creative boundaries.
              </p>
            </div>

            {/* Skills */}
            <div className="about__skills">
              <h3 className="about__skills-title">Skills & Technologies</h3>
              <div className="about__skills-grid">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    className="about__skill"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="about__skill-header">
                      <span className="about__skill-name">{skill.name}</span>
                      <span className="about__skill-level">{skill.level}%</span>
                    </div>
                    <div className="about__skill-bar">
                      <motion.div
                        className="about__skill-progress"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

