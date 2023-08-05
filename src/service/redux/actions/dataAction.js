export const dataRefresh = (needsRefresh) => {
  return {
    type: "REFRESH",
    payload: needsRefresh
  };
};
