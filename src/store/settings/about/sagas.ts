import { takeEvery, put } from 'redux-saga/effects';
import { apiCall, apiGetCall, apiPostCall } from 'store/saga-effects/api';
import {
    openLoader,
    closeLoader,
    showSnackMessage,
} from 'store/saga-effects/globals';
import { FETCH_ABOUT, FETCH_ABOUT_FINISHED } from './types';
import { fetchAboutFinished } from './actions';
import { API_ENDPOINT_ABOUT } from 'services/endpoints'

function* fetchAbout() {
    try {
        yield openLoader();
        const response = yield apiCall(
            apiGetCall,
            API_ENDPOINT_ABOUT,
        );
        yield put(fetchAboutFinished(response.data));
    } catch (error) {
        yield put(fetchAboutFinished(undefined, true));
    } finally {
        yield closeLoader();
    }
}

export function* watchAboutActions() {
    yield takeEvery(FETCH_ABOUT, fetchAbout);
}
