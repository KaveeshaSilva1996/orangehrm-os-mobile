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
import {View, StyleSheet, Platform} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import MainLayout from 'layouts/MainLayout';
import withTheme, {WithTheme} from 'lib/hoc/withTheme';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {fetchAbout} from 'store/settings/about/actions';
import {selectAbout} from 'store/settings/about/selectors';
import Text from 'components/DefaultText';

import {navigate} from 'lib/helpers/navigation';
import {DEVICE_INFO} from 'screens';
import CardButton from 'screens/leave/components/CardButton';
import Icon from 'components/DefaultIcon';

class About extends React.Component<AboutProps> {
  constructor(props: AboutProps) {
    super(props);
    props.fetchAbout();
  }

  onPressDeviceInfo = () => {
    navigate(DEVICE_INFO);
  };

  onRefresh = () => {
    this.props.fetchAbout();
  };

  render() {
    const {theme, about} = this.props;

    return (
      <MainLayout onRefresh = {this.onRefresh}> 
      <View style={{marginLeft: 10,marginTop: 20}}>
        <View style={styles.detailsViewBlock}>
          <View style={styles.detailsViewLabel}>
            <Text>{'Organization Name'}</Text>
          </View>
          <View style={styles.detailsView}>
              <Text> {about?.OrganizationName}</Text>
          </View>
        </View>

        <View style={styles.detailsViewBlock}>
          <View style={styles.detailsViewLabel}>
            <Text>{'OrangeHRM Version'}</Text>
          </View>
          <View style={styles.detailsView}>
              <Text> {about?.OrangeHRMVersion}</Text>
          </View>
        </View>

        <View style={styles.detailsViewBlock}>
          <View style={styles.detailsViewLabel}>
            <Text>{'Organization Country'}</Text>
          </View>
          <View style={styles.detailsView}>
              <Text> {about?.OrganizationCountry}</Text>
          </View>
        </View>

        <View style={styles.detailsViewBlock}>
          <View style={styles.detailsViewLabel}>
            <Text>{'Date Format'}</Text>
          </View>
          <View style={styles.detailsView}>
              <Text> {about?.DateFormat}</Text>
          </View>
        </View>

        <View style={styles.detailsViewBlock}>
          <View style={styles.detailsViewLabel}>
            <Text>{'Language'}</Text>
          </View>
          <View style={styles.detailsView}>
              <Text> {about?.Language}</Text>
          </View>
        </View>
      </View>
      <View style={{marginTop: 24}}>
        <CardButton
          style={[
            styles.cardButton,
            {height: theme.spacing * 12},
            styles.marginForShadow,
          ]}
          onPress={this.onPressDeviceInfo}>
          <View style= {[styles.cardButtonContent]}>
            <View style= {styles.buttonLeftView}>
              <Icon name= {'cellphone-iphone'} />
              <Text style= {{paddingTop: theme.spacing * 0.5}}>
                {'Device Info'}
              </Text>
            </View>
            <Icon name= {'chevron-right'} />
          </View>
        </CardButton>
      </View>
      </MainLayout>
    );
  }
}

interface AboutProps extends WithTheme,
    ConnectedProps<typeof connector> {
  navigation: NavigationProp<ParamListBase>;
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  detailsView: {
    marginTop: 1,
    marginLeft: 10,
  },
  detailsViewBlock: {
    marginTop: 15,
    marginLeft: 10,
  },
  detailsViewLabel: {
    marginLeft: 10,
  },
  marginForShadow: {
    ...Platform.select({
      ios: {
        marginBottom: 2,
      },
    }),
  },
  cardButton: {
    borderRadius: 0,
  },
  buttonLeftView: {
    flexDirection: 'row',
  },
  cardButtonContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
});

const mapStateToProps = (state: RootState) => ({
  about: selectAbout(state),
});

const mapDispatchToProps = {
  fetchAbout,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const AboutWithTheme = withTheme<AboutProps>()(
  About, 
);

export default connector(AboutWithTheme);
