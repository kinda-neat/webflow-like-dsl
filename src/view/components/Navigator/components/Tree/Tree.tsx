import * as React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';

import { XNode } from 'model';

import './Tree.css';

type Props = {
  node: XNode;
  level: number;
  selectedNodeKey: string | null;
  setSelectedNode(key: string): void;
}

const b = block('tree');

export class Tree extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
    this.handleNodeClick = this.handleNodeClick.bind(this);
  }
  public render() {
    const { node, level, selectedNodeKey } = this.props;
    const { type, key } = node;

    return (
      <div className={b()} style={{ marginLeft: level * 20 }} key={key}>
        <span onClick={this.handleNodeClick}>
          <span className={b({ selected: selectedNodeKey === key })}>{getNodeName(node)}</span>
          (<span className={b('type')}>
            {type}
          </span>)
        </span> 
        {node.type === 'text'
          ? ` ${node.value}`
          : node.value.map(x => (
              <div className='tree__node' key={x.key}>
                <Tree {...this.props} node={x} level={level + 1}/>
              </div>
            ))
        }
      </div>
    );  
  }

  @autobind
  private handleNodeClick() {
    const { setSelectedNode, node: { key } } = this.props;
    setSelectedNode(key);
  }
}

function getNodeName(node: XNode) {
  switch (node.type) {
    case 'paragraph': return 'Paragraph';
    case 'div': return 'Container';
    case 'text': return 'Text';
    default: {
      const _exhaustiveCheck: never = node;
      return `Unhandled node type`;
    }
  }
}
