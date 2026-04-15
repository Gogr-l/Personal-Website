import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import './Projects.css';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A modern shopping experience with real-time inventory, seamless checkout, and beautiful product showcases.',
      tags: ['React', 'Node.js', 'Stripe'],
      emoji: '🛍️',
      link: '#',
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Collaborative workspace with drag-and-drop boards, real-time updates, and smart notifications.',
      tags: ['Next.js', 'PostgreSQL', 'WebSocket'],
      emoji: '📋',
      link: '#',
    },
    {
      id: 3,
      title: 'Weather Dashboard',
      description: 'Beautiful weather visualizations with 7-day forecasts, location search, and animated weather icons.',
      tags: ['Vue.js', 'D3.js', 'API'],
      emoji: '🌤️',
      link: '#',
    },
    {
      id: 4,
      title: 'Music Streaming UI',
      description: 'A sleek audio player interface with playlist management, visualizers, and social features.',
      tags: ['React', 'Web Audio', 'Canvas'],
      emoji: '🎵',
      link: '#',
    },
  ];

  return (
    <section id="projects" className="projects">
      <div className="projects__container">
        <motion.div
          className="projects__header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="projects__label">Selected Work</span>
          <h2 className="projects__title">
            Things I've <span className="gradient-text">Built</span>
          </h2>
          <p className="projects__subtitle">
            A collection of projects that showcase my skills in creating 
            beautiful, functional digital experiences.
          </p>
        </motion.div>

        <div className="projects__grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <motion.div
          className="projects__cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="projects__github-link"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="projects__github-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </span>
            <span>See more on GitHub</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;

