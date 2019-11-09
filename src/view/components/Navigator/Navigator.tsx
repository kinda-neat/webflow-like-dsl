import * as React from 'react';
import { autobind } from 'core-decorators';
import { block } from 'bem-cn';

import { XBody } from 'model';
import { OwnTree } from 'view/ownComponents/Tree/Tree';

import { Tree } from './components/Tree/Tree';
import './Navigator.css';

const b = block('navigator');

type Props = {
  ait: XBody;
  selectedNodeKey: string | null;
  onNodeSelect(key: string): void;
};

export class Navigator extends React.PureComponent<Props> {
  public render() {
    const { ait, selectedNodeKey, onNodeSelect } = this.props;

    return (
      <div className={b()}>
        <h3>Navigator</h3>
        <OwnTree
          tree={ait}
          onNodeSelect={onNodeSelect}
          selectedNodeKey={selectedNodeKey}
        />
        {/* Body
        {this.props.ait.value.map(x => (
          <Tree
            key={x.key}
            node={x}
            level={1}
            selectedNodeKey={selectedNodeKey}
            setSelectedNode={onNodeSelect}
          />
        ))} */}
      </div>
    );
  }
}
