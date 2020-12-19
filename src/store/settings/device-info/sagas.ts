import { takeEvery, put } from 'redux-saga/effects';
import { apiCall, apiGetCall, apiPostCall } from 'store/saga-effects/api';
import {
    openLoader,
    closeLoader,
    showSnackMessage,
} from 'store/saga-effects/globals';
import { FETCH_DEVICE_INFO, FETCH_DEVICE_INFO_FINISHED } from './types';
import { fetchDeviceInfoFinished } from './actions';
import { API_ENDPOINT_ABOUT } from 'services/endpoints'

function* fetchDeviceInfo() {
    try {
        yield openLoader();
        // const response = yield apiCall(
        //     apiGetCall,
        //     API_ENDPOINT_ABOUT,
        // );
        yield put(fetchDeviceInfoFinished(response.data));
    } catch (error) {
        yield put(fetchDeviceInfoFinished(undefined, true));
    } finally {
        yield closeLoader();
    }
}

export function* watchDeviceInfoActions() {
    yield takeEvery(FETCH_DEVICE_INFO, fetchDeviceInfo);
}