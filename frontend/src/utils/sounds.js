export const playSnapSound = () => {
  const a = new Audio('/assets/snap.wav');
  a.volume = 0.45;
  a.play().catch(()=>{});
};
