const initialState = {
  loading: false
};

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "STATE_LOADING":
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export default reducer;
