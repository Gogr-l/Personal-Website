import { motion } from 'framer-motion';
import './ProjectCard.css';

const ProjectCard = ({ project, index }) => {
  const colors = [
    'var(--color-accent-1)',
    'var(--color-accent-2)',
    'var(--color-accent-3)',
    'var(--color-accent-4)',
  ];

  const accentColor = colors[index % colors.length];

  return (
    <motion.article
      className="project-card"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <motion.div
        className="project-card__inner"
        whileHover={{ y: -10 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Image */}
        <div className="project-card__image-wrapper">
          <div 
            className="project-card__image"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <span className="project-card__image-placeholder" style={{ color: accentColor }}>
              {project.emoji}
            </span>
          </div>
          <motion.div
            className="project-card__overlay"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="project-card__view">View Project →</span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="project-card__content">
          <div className="project-card__tags">
            {project.tags.map((tag) => (
              <span 
                key={tag} 
                className="project-card__tag"
                style={{ 
                  backgroundColor: `${accentColor}15`,
                  color: accentColor,
                  borderColor: `${accentColor}30`
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          
          <h3 className="project-card__title">{project.title}</h3>
          <p className="project-card__description">{project.description}</p>
          
          <motion.a
            href={project.link}
            className="project-card__link"
            style={{ color: accentColor }}
            whileHover={{ x: 5 }}
          >
            <span>Explore</span>
            <span className="project-card__link-arrow">→</span>
          </motion.a>
        </div>

        {/* Decorative corner */}
        <div 
          className="project-card__corner"
          style={{ background: `linear-gradient(135deg, ${accentColor}30, transparent)` }}
        />
      </motion.div>
    </motion.article>
  );
};

export default ProjectCard;

