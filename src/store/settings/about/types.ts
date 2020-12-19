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

export interface About {
    OrganizationName: string,
    OrganizationCountry: string,
    OrangeHRMVersion: string,
    DateFormat: string,
    Language: string
} 

export interface AboutState{
    about ?: About,
}

export const FETCH_ABOUT = 'ABOUT_FETCH_ABOUT';
export const FETCH_ABOUT_FINISHED = 'ABOUT_FETCH_ABOUT_FINISHED';

export interface FetchAboutAction {
    type: typeof FETCH_ABOUT;
}
  
export interface FetchAboutFinishedAction {
    type: typeof FETCH_ABOUT_FINISHED;
    payload?: About;
    error: boolean;
}

export type AboutActionTypes =
  | FetchAboutAction
  | FetchAboutFinishedAction;
