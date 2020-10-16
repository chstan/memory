import keycode from "keycode";
import {MMap} from "./sanity";

interface KeyHandlerData {
  stack: KeyRecord[],
  eventStack: EventRecord[],
  event: KeyboardEvent,
  kind: KeyEventKind,
}
export type KeyComboHandler = (keyData: KeyHandlerData) => void;
export type KeyCombo = string;
type CodePoint = string;
type KeyRecord = {
  code: CodePoint,
  pressed: boolean,
  pressedTimes: Date[],
  releasedTime: null | Date,
}

type EventRecord = [CodePoint, boolean, Date];

export enum KeyEventKind {
  KeyDown = "KeyDown",
  KeyUp = "KeyUp",
  ChordUp = "ChordUp",
}

export interface SubscriptionOptions {
  [KeyEventKind.KeyDown]: boolean,
  [KeyEventKind.KeyUp]: boolean,
  [KeyEventKind.ChordUp]: boolean,
  stateMachine: boolean,
  alwaysFire: boolean,
  allowStackRepeats: boolean,
  key?: KeyCombo,
}

interface SubscriptionRecord extends SubscriptionOptions {
  callback: KeyComboHandler,
  firedOnThisStack: boolean,
}

export const DEFAULT_OPTIONS = {
  [KeyEventKind.KeyDown]: true,
  [KeyEventKind.KeyUp]: false,
  [KeyEventKind.ChordUp]: false,
  stateMachine: false,
  alwaysFire: false,
  allowStackRepeats: false,
};

export const KEYUP_AND_KEYDOWN_OPTIONS = {
  [KeyEventKind.KeyDown]: true,
  [KeyEventKind.KeyUp]: true,
  [KeyEventKind.ChordUp]: false,
  stateMachine: false,
  alwaysFire: false,
  allowStackRepeats: true, // by necessity
}

class KeyManager {
  private _keysMap: MMap<string, KeyRecord> = new MMap();
  private _keyStack: KeyRecord[] = [];
  private _eventStack: EventRecord[] = [];
  private _subscriptions: MMap<number, SubscriptionRecord> = new MMap();
  private _nextId: number = 0;
  private _nKeysDown: number = 0;

  constructor() {
    try {
      document.addEventListener("keydown", this.onKeyDown.bind(this));
      document.addEventListener("keyup", this.onKeyUp.bind(this));
    } catch(e) { /* ssr */ }
  }

  isSatisfied(subscription: SubscriptionRecord, eventKind: KeyEventKind) {
    if (subscription.firedOnThisStack && !subscription.allowStackRepeats) { return false; }

    if (!subscription[eventKind]) {
      return false;
    }
    if (subscription.alwaysFire) {
      return true;
    }

    const keySequence = subscription.key;
    if (keySequence === undefined) {
      throw new Error("Invalid subscription has `alwaysFire=false` but no explicit `key`");
    }

    const parsedSequence = keySequence.split("|").map(seq => seq.split(",").map(s => s.trim()));
    for (const alias of parsedSequence) {
      const requiredKeys = Object.fromEntries(alias.map(k => [k, false]));
      const nRequired = alias.length;
      let currentSatisfied = 0;
      let phase = KeyEventKind.KeyDown;

      for (const [code, isPress, _] of this._eventStack) {
        if (Object.hasOwnProperty.call(requiredKeys, code)) {
          if (requiredKeys[code] === isPress) {
            console.error("Logical inconsistency in key management code.");
          }
          if (!requiredKeys[code]) {
            requiredKeys[code] = true;
            currentSatisfied = currentSatisfied + 1;
          } else {
            requiredKeys[code] = false;
            currentSatisfied = currentSatisfied - 1;
            if (phase === KeyEventKind.KeyUp || (currentSatisfied === 0 && phase === KeyEventKind.ChordUp)) {
              return true;
            }
          }

          if (currentSatisfied === nRequired) {
            if (eventKind === KeyEventKind.KeyDown) {
              return true;
            }
            phase = eventKind;
          }
        }
      }
    }
    return false;
  }

  onKeyDown(event: KeyboardEvent) {
    const code = keycode(event);
    
    const tagName = (event.target as any).tagName;
    const wasInput = ["INPUT", "TEXTAREA"].includes(tagName);

    if (code === "alt") {
      event.preventDefault();
    }

    const now = new Date();
    if (code === undefined) return;

    const record = this._keysMap.getInsert(code, {
      code,
      pressed: false,
      pressedTimes: [],
      releasedTime: null,
    });

    const isPressRepeat = record.pressed;
    if (!record.pressed) {
      this._nKeysDown = this._nKeysDown + 1;
      this._keyStack.push(record);
      this._eventStack.push([code, true, now]);
    }
    record.pressed = true;
    record.pressedTimes.push(now);

    if (isPressRepeat) {
      if (!wasInput) {
        event.preventDefault();
      }
      return;
    }

    let anyFired = false;
    // check if any events need to be dispatched
    this._subscriptions.forEach((sub, key) => {
      for (const eventType of [KeyEventKind.KeyDown]) {
        if (this.isSatisfied(sub, eventType)) {
          anyFired = true;
          this.fireCallback(sub, event, eventType);
        }
      }
    });

    if (anyFired && !wasInput) {
      event.preventDefault();
    }
 }

  onKeyUp(event: KeyboardEvent) {
    const code = keycode(event);
    const now = new Date();
    if (code === undefined) return;

    const record = this._keysMap.getInsert(code, {
      code,
      pressed: false,
      pressedTimes: [],
      releasedTime: null,
    });
    this._keysMap.delete(code);

    if (record.pressed) {
      this._nKeysDown = this._nKeysDown - 1;
      this._eventStack.push([code, false, now]);
    }

    record.pressed = false;
    record.releasedTime = now;

    this._subscriptions.forEach((sub, key) => {
      for (const eventType of [KeyEventKind.KeyUp, KeyEventKind.ChordUp]) {
        if (this.isSatisfied(sub, eventType)) {
          this.fireCallback(sub, event, eventType);
        }
      }
    });

    // finally, some cleanup, go and reset the keystack
    if (this._nKeysDown === 0) {
      this._keyStack = [];
      this._eventStack = [];
      this._subscriptions.forEach((sub, _) => { sub.firedOnThisStack = false; });
    }
  }

  fireCallback(subscription: SubscriptionRecord, event: KeyboardEvent, kind: KeyEventKind) {
    subscription.firedOnThisStack = true;
    subscription.callback({
      stack: this._keyStack,
      eventStack: this._eventStack,
      event,
      kind,
    });
  }

  subscribeAll(callback: KeyComboHandler, options: SubscriptionOptions | null = null) {
    const useOptions = options !== null ? options : DEFAULT_OPTIONS;

    const id = this._nextId;
    this._nextId = this._nextId + 1;

    this._subscriptions.set(id, {
      callback,
      firedOnThisStack: false,
      ...useOptions,
    });

    return id;
  }

  subscribe(key: KeyCombo, callback: KeyComboHandler, options: SubscriptionOptions | null = null) {
    const useOptions = options !== null ? options : DEFAULT_OPTIONS;

    const id = this._nextId;
    this._nextId = this._nextId + 1;

    this._subscriptions.set(id, {
      key,
      callback,
      firedOnThisStack: false,
      ...useOptions,
    });

    return id;
  }

  unsubscribe(subscriptionId: number) {
    this._subscriptions.delete(subscriptionId);
  }
}

export default new KeyManager();