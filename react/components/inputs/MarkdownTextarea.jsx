import React from 'react';

import Markdown from '../Markdown';

export default class MarkdownTextarea extends React.Component {
  render() {
    const { input, fieldValue, meta, ...rest } = this.props;
    return (
      <div>
        <textarea {...rest} {...input} />
        <Markdown source={input.value} />
      </div>
    );
  }
}
