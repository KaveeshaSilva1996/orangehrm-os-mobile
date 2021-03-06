/*
 * This file is part of OrangeHRM
 *
 * Copyright (C) 2020 onwards OrangeHRM (https://www.orangehrm.com/)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import {call, takeEvery, put} from 'redux-saga/effects';
import {
  FETCH_TOKEN,
  LOGOUT,
  FETCH_MY_INFO,
  CHECK_INSTANCE,
  FetchTokenAction,
  CheckInstanceAction,
  FetchEnabledModulesAction,
  FETCH_ENABLED_MODULES,
} from 'store/auth/types';
import {authenticate} from 'services/authentication';
import {
  checkInstance as checkInstanceRequest,
  checkInstanceCompatibility,
  checkRemovedEndpoints,
  checkDeprecatedEndpoints,
  getEnabledModules,
} from 'services/instance-check';
import {
  USERNAME,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  SCOPE,
  TOKEN_TYPE,
  EXPIRES_AT,
} from 'services/storage';
import {
  openLoader,
  closeLoader,
  showSnackMessage,
} from 'store/saga-effects/globals';
import {apiCall, apiGetCall} from 'store/saga-effects/api';
import {
  storageSetMulti,
  selectAuthParams,
  selectInstanceUrl,
} from 'store/saga-effects/storage';
import {
  fetchMyInfoFinished,
  checkInstanceFinished,
  fetchEnabledModulesFinished,
} from 'store/auth/actions';
import {getExpiredAt} from 'store/auth/helper';
import {AuthParams} from 'store/storage/types';
import {TYPE_ERROR, TYPE_WARN} from 'store/globals/types';
import {getMessageAlongWithGenericErrors} from 'services/api';
import {API_ENDPOINT_MY_INFO, prepare} from 'services/endpoints';
import {AuthenticationError} from 'services/errors/authentication';
import {InstanceCheckError} from 'services/errors/instance-check';

function* checkInstance(action?: CheckInstanceAction) {
  try {
    yield openLoader();
    const instanceUrl: string = yield selectInstanceUrl();
    const response: Response = yield call(checkInstanceRequest, instanceUrl);

    if (response.ok) {
      const data = yield call([response, response.json]);

      checkInstanceCompatibility(data);
      checkRemovedEndpoints(data);
      const usingDeprecatedEndpoints = checkDeprecatedEndpoints(data);
      if (usingDeprecatedEndpoints) {
        yield showSnackMessage('Please Update the Application.', TYPE_WARN);
      }

      yield* fetchEnabledModules();

      yield put(checkInstanceFinished());
    } else {
      yield showSnackMessage(
        'Invalid URL. Mobile App Is Supported With OrangeHRM Open Source 4.5 Version Onwards.',
        TYPE_ERROR,
      );
    }
  } catch (error) {
    if (action) {
      yield put(checkInstanceFinished(true));
      yield showSnackMessage(
        getMessageAlongWithGenericErrors(
          error,
          'Invalid URL. Mobile App Is Supported With OrangeHRM Open Source 4.5 Version Onwards.',
        ),
        TYPE_ERROR,
      );
    } else {
      throw error;
    }
  } finally {
    yield closeLoader();
  }
}

function* fetchEnabledModules(action?: FetchEnabledModulesAction) {
  try {
    if (action) {
      yield openLoader();
    }
    const instanceUrl: string = yield selectInstanceUrl();
    const response: Response = yield call(getEnabledModules, instanceUrl);

    if (response.ok) {
      const responseData = yield call([response, response.json]);

      if (responseData.data) {
        yield put(fetchEnabledModulesFinished(responseData.data));
        if (!responseData.data.modules.mobile) {
          // Logout in case loggedin user
          yield* logout();
          throw new InstanceCheckError(
            'The Mobile App Is Not Enabled, Please Contact Your System Administrator.',
          );
        }
      } else {
        throw new InstanceCheckError('Failed to Load Enabled Modules.');
      }
    } else {
      throw new InstanceCheckError('Failed to Load Enabled Modules.');
    }
  } catch (error) {
    if (error instanceof InstanceCheckError && action === undefined) {
      throw error;
    }
    yield showSnackMessage(
      getMessageAlongWithGenericErrors(
        error,
        'Failed to Load Enabled Modules.',
      ),
      TYPE_ERROR,
    );
    yield put(fetchEnabledModulesFinished(undefined, true));
  } finally {
    if (action) {
      yield closeLoader();
    }
  }
}

function* fetchAuthToken(action: FetchTokenAction) {
  try {
    yield openLoader();
    yield* checkInstance();

    const authParams: AuthParams = yield selectAuthParams();

    if (authParams.instanceUrl !== null) {
      const response: Response = yield call(
        authenticate,
        authParams.instanceUrl,
        action.username,
        action.password,
      );

      const data = yield call([response, response.json]);
      if (data.error) {
        if (data.error === 'authentication_failed') {
          throw new AuthenticationError(data.error_description);
        } else {
          throw new AuthenticationError('Invalid Credentials.');
        }
      } else {
        yield storageSetMulti({
          [USERNAME]: action.username,
          [ACCESS_TOKEN]: data.access_token,
          [REFRESH_TOKEN]: data.refresh_token,
          [TOKEN_TYPE]: data.token_type,
          [SCOPE]: data.scope,
          [EXPIRES_AT]: getExpiredAt(data.expires_in),
        });
      }
    } else {
      yield showSnackMessage('Instance URL is empty.', TYPE_ERROR);
    }
  } catch (error) {
    yield showSnackMessage(
      getMessageAlongWithGenericErrors(error, 'Authentication Failed.'),
      TYPE_ERROR,
    );
  } finally {
    yield closeLoader();
  }
}

function* logout() {
  try {
    yield openLoader();
    yield storageSetMulti({
      [USERNAME]: null,
      [ACCESS_TOKEN]: null,
      [REFRESH_TOKEN]: null,
      [TOKEN_TYPE]: null,
      [SCOPE]: null,
      [EXPIRES_AT]: null,
    });
  } catch (error) {
    yield showSnackMessage('Failed to Perform Action.', TYPE_ERROR);
  } finally {
    yield closeLoader();
  }
}

function* fetchMyInfo() {
  try {
    yield* fetchEnabledModules();

    const response = yield apiCall(
      apiGetCall,
      prepare(API_ENDPOINT_MY_INFO, {}, {withPhoto: true}),
    );
    if (response.data) {
      yield put(fetchMyInfoFinished(response.data));
    } else {
      yield put(fetchMyInfoFinished(undefined, true));
    }
  } catch (error) {
    if (error instanceof InstanceCheckError) {
      yield showSnackMessage(
        getMessageAlongWithGenericErrors(error, 'Failed to Check Instance.'),
        TYPE_ERROR,
      );
    }
    yield put(fetchMyInfoFinished(undefined, true));
  }
}

export function* watchAuthActions() {
  yield takeEvery(FETCH_TOKEN, fetchAuthToken);
  yield takeEvery(LOGOUT, logout);
  yield takeEvery(FETCH_MY_INFO, fetchMyInfo);
  yield takeEvery(CHECK_INSTANCE, checkInstance);
  yield takeEvery(FETCH_ENABLED_MODULES, fetchEnabledModules);
}
