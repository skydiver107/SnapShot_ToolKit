export const handleImageError = (e: { target: { src: string; }; }) => {
  e.target.src = `/images/icons/solana.png`;
};