import { motion } from 'framer-motion';
import './Contact.css';

const Contact = () => {
  const socialLinks = [
    { 
      name: 'Email', 
      icon: '✉️', 
      href: 'mailto:hello@example.com',
      label: 'hello@example.com',
      color: 'var(--color-accent-1)'
    },
    { 
      name: 'GitHub', 
      icon: '🐙', 
      href: 'https://github.com',
      label: '@yourusername',
      color: 'var(--color-accent-3)'
    },
    { 
      name: 'LinkedIn', 
      icon: '💼', 
      href: 'https://linkedin.com',
      label: '/in/yourusername',
      color: 'var(--color-accent-4)'
    },
    { 
      name: 'Twitter', 
      icon: '🐦', 
      href: 'https://twitter.com',
      label: '@yourusername',
      color: 'var(--color-accent-2)'
    },
  ];

  return (
    <section id="contact" className="contact">
      {/* Background decoration */}
      <div className="contact__bg">
        <motion.div
          className="contact__blob contact__blob--1"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="contact__blob contact__blob--2"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="contact__container">
        <motion.div
          className="contact__content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="contact__label">Get in Touch</span>
          <h2 className="contact__title">
            Let's create something
            <span className="gradient-text"> amazing together</span>
          </h2>
          <p className="contact__subtitle">
            Have a project in mind or just want to chat? I'm always excited 
            to hear about new ideas and opportunities.
          </p>

          <motion.a
            href="mailto:hello@example.com"
            className="contact__cta"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="contact__cta-text">Say Hello</span>
            <span className="contact__cta-icon">👋</span>
          </motion.a>
        </motion.div>

        <motion.div
          className="contact__links"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              target={link.name !== 'Email' ? '_blank' : undefined}
              rel={link.name !== 'Email' ? 'noopener noreferrer' : undefined}
              className="contact__link"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index + 0.4 }}
              whileHover={{ y: -5, scale: 1.02 }}
              style={{ '--accent': link.color }}
            >
              <span className="contact__link-icon">{link.icon}</span>
              <div className="contact__link-info">
                <span className="contact__link-name">{link.name}</span>
                <span className="contact__link-label">{link.label}</span>
              </div>
              <span className="contact__link-arrow">→</span>
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        className="contact__footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <p className="contact__footer-text">
          Designed & built with <span className="contact__heart">♥</span> by Dom
        </p>
        <p className="contact__footer-year">© {new Date().getFullYear()}</p>
      </motion.footer>
    </section>
  );
};

export default Contact;

