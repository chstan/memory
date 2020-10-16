import { useRouter } from "next/router";
import {useCallback, useContext, useDebugValue, useEffect, useRef, useState } from "react";
import KeyManager, {KeyCombo, KeyComboHandler, SubscriptionOptions } from "../common/KeyManager";
import {CB, KeyboardBoundAction, NAVIGATION_URLS } from "../common/types";
import { localStateContext } from "../state/context";
import { LocalState } from "../state/initialState";

export const useInterval = (callback: CB, intervalDelay = 1000, cleanup: CB | null = null) => {
  const cachedCallback = useRef<CB>();

  useEffect(() => {
    cachedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!Number.isNaN(intervalDelay)) {
      let id: number | null = null;
      const { current } = cachedCallback;

      if (current) {
        id = window.setInterval(() => current(), intervalDelay);
      }

      return () => {
        if (id !== null) {
          clearInterval(id);
        }
        if (cleanup) {
          cleanup();
        }
      };
    }
  }, [intervalDelay]);
};


export const useEventListener = (callback: CB, trigger = "mousedown", scope: HTMLElement | null = null) => {
  // note, we do not monitor changes in the callback because in function
  // components callbacks are constructed *during* render

  const actualScope = scope === null ? document : scope;

  useEffect(() => {
    actualScope.addEventListener(trigger, callback);

    return () => {
      actualScope.removeEventListener(trigger, callback);
    };
  }, [trigger, scope]);
};


export function usePrevious<T>(value: T) : T | null {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export const useOnActivationChordPressed = (handler: CB | null = null) => {
  const appLocalState = useLocalStateContext();
  const isPressed = appLocalState.isActivationChordPressed;
  const previousIsPressed = usePrevious(isPressed);

  useEffect(() => {
    if (!previousIsPressed && isPressed && (handler !== null)) {
      handler();
    }
  }, [isPressed, previousIsPressed, handler]);
};

export const useChordForAction = (action: KeyboardBoundAction, handler: KeyComboHandler, options?: any) => {
  const localState = useLocalStateContext();
  const activationChord =  localState.activationChord.join(",")
  const combos = localState.chordsForActions[action];
  const flatCombo = combos.map(c => `${activationChord},${c.join(",")}`).join("|");

  useDebugValue([action, flatCombo, handler, options]);
  
  useEffect(() => {
    const subscription = KeyManager.subscribe(flatCombo, handler, options);
    return () => {
      KeyManager.unsubscribe(subscription);
    };
  }, [flatCombo, handler]);

  return combos.map(c => c.join(",")).join("|");
}

export const useChord = (combo: KeyCombo, handler: KeyComboHandler, requiresActivation: boolean, options?: SubscriptionOptions) => {
  useDebugValue([combo, handler, options]);
  const localState = useLocalStateContext();

  let builtCombo = combo;
  if (requiresActivation) {
    builtCombo = `${localState.activationChord.join(",")},${builtCombo}`;
  }

  useEffect(() => {
    const subscription = KeyManager.subscribe(builtCombo, handler, options || null);
    return () => {
      KeyManager.unsubscribe(subscription);
    };
  }, [builtCombo, handler, options]);
};


export const useKeyListener = (handler: KeyComboHandler, options?: any) => {
  useDebugValue(handler, options);

  useEffect(() => {
    const subscription = KeyManager.subscribeAll(handler, options);
    return () => {
      KeyManager.unsubscribe(subscription);
    };
  });
};

export const useNavigationAction = (action: KeyboardBoundAction) => {
  if (!NAVIGATION_URLS.hasOwnProperty(action)) {
    throw new Error(`Unknown navigation action ${action}`);
  }
  const href = (NAVIGATION_URLS as any)[action] as string;

  const router = useRouter();
  const routingCallback = useCallback(() => router.push(href), [href])
  useChordForAction(action as unknown as KeyboardBoundAction, routingCallback);
}

export function useLocalStateContext(): LocalState {
  return useContext(localStateContext());
}


export default {
  useInterval,
  useEventListener,
  usePrevious,
  useChord,
  useLocalStateContext,
  useOnActivationChordPressed,
  useNavigationAction,
};