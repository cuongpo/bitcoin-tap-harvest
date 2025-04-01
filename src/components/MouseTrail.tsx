
import React, { useState, useEffect } from 'react';

const MouseTrail: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const glowElement = document.createElement('div');
    glowElement.className = 'mouse-glow';
    document.body.appendChild(glowElement);

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      
      glowElement.style.left = `${x}px`;
      glowElement.style.top = `${y}px`;
      glowElement.style.opacity = '0.7';
      
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      glowElement.style.opacity = '0';
      setIsVisible(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeChild(glowElement);
    };
  }, []);

  return null;
};

export default MouseTrail;
