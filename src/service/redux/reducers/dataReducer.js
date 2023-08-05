const initialState = {
  needsRefresh: false
};
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "REFRESH":
      return {
        ...state,
        needsRefresh: action.payload
      };

    default:
      return state;
  }
};

export default dataReducer;
