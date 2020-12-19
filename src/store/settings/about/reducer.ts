import { FETCH_ABOUT_FINISHED, AboutState, AboutActionTypes } from './types';

const initialState: AboutState = {};

const aboutReducer = (
  state = initialState,
  action: AboutActionTypes,
): AboutState => {
  switch (action.type) {
    case FETCH_ABOUT_FINISHED:
      if (action.error) {
        return state;
      }
      return {
        ...state,
        about: action.payload
      };
    default:
      return state;
  }
};

export default aboutReducer;
