export const rand = () => {
  const val = Math.random() * 1000;
  return Math.floor(val).toString();
};;

export const nextRand = (val) => {
  return (+val + +rand()).toString();
};
