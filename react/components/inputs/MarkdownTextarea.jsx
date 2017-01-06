import React from 'react';

import Markdown from '../Markdown';

export default class MarkdownTextarea extends React.Component {
  render() {
    const { input, fieldValue, meta, ...rest } = this.props;
    return (
      <div className="form-group markdown-form-group">
        <textarea className="form-control" {...rest} {...input} />
        <pre>
          <Markdown source={input.value} />
        </pre>
      </div>
    );
  }
}
