module.exports = {
  getInitData: () => {
    return {
      setsDone: {
        push: 0,
        pull: 0,
        squat: 0,
        ab: 0,
        accessory: 0,
      },
    };
  },

  getNextState: (
    state,
    achieved,
    { forceProgress = false } = {
      forceProgress: false,
    }
  ) => {
    return {
      push: achieved.push % 2,
      pull: achieved.pull % 2,
      squat: achieved.squat % 2,
      ab: achieved.ab % 2,
      accessory: achieved.accessory % 2,
    };
  },
};
