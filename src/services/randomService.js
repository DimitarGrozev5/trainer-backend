const rand = () => {
  const val = Math.random() * 1000;
  return Math.floor(val).toString();
};

exports.rand = rand;

exports.nextRand = (val) => {
  return (+val + +rand()).toString();
};
