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

import React from 'react';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import withTheme, {WithTheme} from 'lib/hoc/withTheme';
import {View} from 'react-native';  
import ApplyLeave from 'screens/leave/ApplyLeave';  //change
import About from 'screens/settings/About';

import PickLeaveRequestDaysCalendar from 'screens/leave/PickLeaveRequestDaysCalendar';
import PickLeaveRequestDuration from 'screens/leave/PickLeaveRequestDuration';
import PickLeaveRequestPartialDays from 'screens/leave/PickLeaveRequestPartialDays';
import LeaveRequestSuccess from 'screens/leave/LeaveRequestSuccess';
import {
  ABOUT,
  DEVICE_INFO,
} from 'screens';
import HeaderMenuIcon from 'components/HeaderMenuIcon';
import HeaderBackIcon from 'components/HeaderBackIcon';
import {getHeaderStyle} from 'lib/helpers/header';
import {LeaveRequestSuccessParamList} from 'screens/leave/navigators';
import DeviceInfo from '../DeviceInfo';

const Stack = createStackNavigator();

class AboutNavigator extends React.Component<AboutNavigatorProps> {
  render() {

    const {theme, navigation} = this.props;
    const header = getHeaderStyle(theme);
    const headerMenuIcon = {
      headerLeft: () => <HeaderMenuIcon navigation={navigation} />,
    };
    const headerBackIcon = {
      headerLeft: () => <HeaderBackIcon navigation={navigation} />,
    };

    return (
      <Stack.Navigator
        initialRouteName={ABOUT}
        screenOptions={{
          ...header,
          ...headerBackIcon,
        }}
        keyboardHandlingEnabled={false}>
        <Stack.Screen
          name={ABOUT}
          component={About}
          options={{
            title: 'About',
            ...headerMenuIcon,
          }}
        />
        <Stack.Screen
          name={DEVICE_INFO}
          component={DeviceInfo}
          options={{
            title: 'Device Info',
          }}
        /> 
      </Stack.Navigator>
    );
  }
}

interface AboutNavigatorProps extends WithTheme {
  navigation: NavigationProp<ParamListBase>;
}



export default withTheme<AboutNavigatorProps>()(AboutNavigator);
