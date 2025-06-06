import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

export interface FooterProps {
  /**
   * Company name to display in the copyright notice
   */
  companyName?: string;
  
  /**
   * Year for the copyright notice
   */
  copyrightYear?: number;
  
  /**
   * Social media links to display
   */
  socialLinks?: Array<{
    platform: 'twitter' | 'github' | 'linkedin' | string;
    url: string;
    label: string;
  }>;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  companyName = 'YourBrand',
  copyrightYear = new Date().getFullYear(),
  socialLinks = [
    { platform: 'twitter', url: 'https://twitter.com', label: 'Twitter' },
    { platform: 'github', url: 'https://github.com', label: 'GitHub' },
    { platform: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' }
  ],
  className = '',
}) => {
  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };
  
  const socialIconVariants = {
    hover: { 
      scale: 1.15,
      y: -3,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };
  
  const heartBeatVariants = {
    animate: {
      scale: [1, 1.12, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "easeInOut"
      }
    }
  };
  
  // Render icon based on platform
  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <FaTwitter />;
      case 'github':
        return <FaGithub />;
      case 'linkedin':
        return <FaLinkedin />;
      default:
        return <FaTwitter />;
    }
  };
  
  return (
    <motion.footer 
      className={`mt-auto py-6 bg-bg-surface border-t border-border ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Copyright */}
          <motion.div 
            className="mb-4 md:mb-0 text-center md:text-left"
            variants={itemVariants}
          >
            <div className="mb-2">
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                {companyName}
              </span>
            </div>
            <p className="text-sm text-text-muted">
              © {copyrightYear} {companyName}. All rights reserved.
            </p>
          </motion.div>
          
          {/* Social Links */}
          <motion.div 
            className="flex gap-4 items-center"
            variants={itemVariants}
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-primary transition-colors p-2"
                aria-label={link.label}
                variants={socialIconVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {renderSocialIcon(link.platform)}
              </motion.a>
            ))}
          </motion.div>
        </div>
        
        {/* Made with love line */}
        <motion.div 
          className="text-center text-xs text-text-muted mt-6 pt-4 border-t border-border/40"
          variants={itemVariants}
        >
          <p className="flex items-center justify-center gap-1.5">
            Made with 
            <motion.span 
              className="text-primary" 
              variants={heartBeatVariants}
              animate="animate"
            >
              <FaHeart />
            </motion.span> 
            using our <span className="text-primary-dark dark:text-primary-light font-medium">Design System</span>
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer; 