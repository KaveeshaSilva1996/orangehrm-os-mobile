import { FETCH_DEVICE_INFO, FETCH_DEVICE_INFO_FINISHED,FetchDeviceInfoAction, FetchDeviceInfoFinishedAction, DeviceInfo } from './types';

export const fetchAbout = (): FetchDeviceInfoAction => ({
    type: FETCH_DEVICE_INFO,
});

export const fetchDeviceInfoFinished = (
    payload?: DeviceInfo,
    error: boolean = false,
): FetchDeviceInfoFinishedAction => ({
    type: FETCH_DEVICE_INFO_FINISHED,
    payload,
    error,
});
