import { useReducedMotion } from 'framer-motion';

export function useMotionTokens() {
  const prefersReducedMotion = useReducedMotion();
  
  return {
    getDuration: (duration: number) => prefersReducedMotion ? 0.01 : duration,
    getDelay: (delay: number) => prefersReducedMotion ? 0 : delay,
    getTransitionType: (type: 'spring' | 'tween' | 'inertia' | 'keyframes') => prefersReducedMotion ? 'tween' : type,
    prefersReducedMotion,
    shouldReduceMotion: prefersReducedMotion,
  };
}
