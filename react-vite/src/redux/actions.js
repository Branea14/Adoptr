export const triggerNavigationRefresh = () => ({
    type: "TRIGGER_NAVIGATION_REFRESH"
  });

  const initialState = {
    refreshTriggered: false,
  };

  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case "TRIGGER_NAVIGATION_REFRESH":
        return {
          ...state,
          refreshTriggered: !state.refreshTriggered, // Toggle the state to trigger the refresh
        };
      default:
        return state;
    }
  };

  export default reducer;
