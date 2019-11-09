import * as React from 'react';
import block from 'bem-cn';

import { XBody, XNode } from 'model';

import './Site.css';

type Props = {
  ait: XBody;
};

const b = block('site');

function generateSite(node: XBody | XNode) {
  switch (node.type) {
    case 'div':
    case 'body': {
      return (
        <div key={node.key} className={b('container')}>{node.value.map(n => generateSite(n))}</div>
      );
    }
    case 'paragraph':
      return (
        <p key={node.key} className={b('paragraph')}>
          {node.value.map(n => generateSite(n))}
        </p>
      );
    case 'text':
        return (
          <span key={node.key} className={b('text')}>{node.value}</span>
        );
    default: {
      const _exhaustiveCheck: never = node;
      return null;
    }
  }
}

export class Site extends React.PureComponent<Props> {
  public render() {
    return (
      <div className={b()}>
        <h3>Site:</h3>
        {generateSite(this.props.ait)}
      </div>
    );
  }
}
