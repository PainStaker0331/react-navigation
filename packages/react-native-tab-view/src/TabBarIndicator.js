/* @flow */

import * as React from 'react';
import { StyleSheet, I18nManager } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

import memoize from './memoize';
import type { Route, SceneRendererProps, NavigationState } from './types';

export type Props<T> = {|
  ...SceneRendererProps,
  navigationState: NavigationState<T>,
  width: number,
  style?: ViewStyleProp,
|};

const { max, min, multiply } = Animated;

export default class TabBarIndicator<T: Route> extends React.Component<
  Props<T>
> {
  _getTranslateX = memoize(
    (position: Animated.Node<number>, routes: Route[], width: number) =>
      multiply(
        max(min(position, routes.length - 1), 0),
        width * (I18nManager.isRTL ? -1 : 1)
      )
  );

  render() {
    const { width, position, navigationState, style } = this.props;
    const { routes } = navigationState;

    const translateX = this._getTranslateX(position, routes, width);

    return (
      <Animated.View
        style={[
          styles.indicator,
          { width: `${100 / routes.length}%` },
          // If layout is not available, use `left` property for positioning the indicator
          // This avoids rendering delay until we are able to calculate translateX
          width
            ? { transform: [{ translateX }] }
            : { left: `${(100 / routes.length) * navigationState.index}%` },
          style,
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: '#ffeb3b',
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 2,
  },
});
