import { FETCH_DEVICE_INFO_FINISHED, DeviceInfoState,DeviceInfoActionTypes } from './types';

const initialState: DeviceInfoState = {};


const deviceInfoReducer = (
    state = initialState,
    action: DeviceInfoActionTypes,
  ): DeviceInfoState => {
    switch (action.type) {
      case FETCH_DEVICE_INFO_FINISHED:
        if (action.error) {
          return state;
        }
        return {
          ...state,
          deviceInfo: action.payload
        };
      default:
        return state;
    }
  };

  export default deviceInfoReducer;