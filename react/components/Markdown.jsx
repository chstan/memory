import React from 'react';

import _ from 'lodash';

import md from 'markdown-it';

export default class Markdown extends React.Component {
  source() {
    if (_.get(this.props, 'source')) {
      return this.props.source;
    }
    return _.get(this.props, 'children', []).join('\n');
  }
  cachedRenderer() {
    return window.markdownRenderer || new md();
  }
  convertedContent () {
    return this.cachedRenderer().render(this.source());
  }
  render() {
    return <span dangerouslySetInnerHTML={{__html: this.convertedContent() }} />;
  }
}
