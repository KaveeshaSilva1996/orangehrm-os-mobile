import {RootState} from 'store';
import {createSelector} from 'reselect';

import { DeviceInfo, DeviceInfoState } from './types';


export const selectdeviceInfoState = (state: RootState) => state.deviceInfo;

export const selectAbout = createSelector<
  RootState,
  DeviceInfoState,
  DeviceInfo | undefined
>([selectdeviceInfoState], (deviceInfo) => deviceInfo.deviceInfo);
 