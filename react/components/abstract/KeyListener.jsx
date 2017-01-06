import React from 'react';
import _ from 'lodash';

export default class KeyListener extends React.Component {
  constructor(...args) {
    super(...args);

    this._keyHandlers = {};
  }

  registerKeyCombination(keys, handler) {
    const combo = window.listener.register_combo({
      keys,
      on_keydown: handler,
      prevent_repeat: true,
    });
    this._keyHandlers[keys] = combo;
  }

  componentWillUnmount() {
    _.forEach(this._keyHandlers, (handlers, keyCombination) => {
      window.listener.unregister_many(handlers);
    });
  }
};
