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

export interface DeviceInfo {
    deviceOS: string,
    OSVersion: string
} 

export interface DeviceInfoState{
    deviceInfo ?: DeviceInfo,
}

export const FETCH_DEVICE_INFO = 'DEVICE_INFO_FETCH_ABOUT';
export const FETCH_DEVICE_INFO_FINISHED = 'DEVICE_INFO_FETCH_DEVICE_INFO_FINISHED';

export interface FetchDeviceInfoAction {
    type: typeof FETCH_DEVICE_INFO;
}
  
export interface FetchDeviceInfoFinishedAction {
    type: typeof FETCH_DEVICE_INFO_FINISHED;
    payload?: DeviceInfo;
    error: boolean;
}

export type DeviceInfoActionTypes =
  | FetchDeviceInfoAction
  | FetchDeviceInfoFinishedAction;
