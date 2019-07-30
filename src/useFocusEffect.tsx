import * as React from 'react';
import useNavigation from './useNavigation';

type EffectCallback = (() => undefined) | (() => () => void);

export default function useFocusEffect(callback: EffectCallback) {
  const navigation = useNavigation();

  React.useEffect(() => {
    let isFocused = false;
    let cleanup: (() => void) | undefined;

    // We need to run the effect on intial render/dep changes if the screen is focused
    if (navigation.isFocused()) {
      cleanup = callback();
      isFocused = true;
    }

    const unsubscribeFocus = navigation.addListener('focus', () => {
      // If callback was already called for focus, avoid calling it again
      // The focus event may also fire on intial render, so we guard against runing the effect twice
      if (isFocused) {
        return;
      }

      cleanup && cleanup();
      cleanup = callback();
      isFocused = true;
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      cleanup && cleanup();
      cleanup = undefined;
      isFocused = false;
    });

    return () => {
      cleanup && cleanup();
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [callback, navigation]);
}
