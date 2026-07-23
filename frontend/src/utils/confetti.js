import confetti from 'canvas-confetti';

const MILESTONES = [3, 7, 14, 30, 50, 100, 200, 365];

export const isMilestone = (streak) => MILESTONES.includes(streak);

export const fireConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 75,
    origin: { y: 0.6 },
    colors: ['#6C5CE7', '#10B981', '#EAB308', '#FF9F43'],
  });
};
