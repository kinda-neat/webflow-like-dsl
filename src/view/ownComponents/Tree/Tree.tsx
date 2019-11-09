import * as React from 'react';
import block from 'bem-cn';
import { Tree } from 'antd';
import 'antd/dist/antd.css';
import { AntTreeNodeSelectedEvent } from 'antd/lib/tree';
import 'antd/es/date-picker/style/css';
const { TreeNode, DirectoryTree } = Tree;
import { autobind } from 'core-decorators';

import { XBody, XNode } from 'model';

import './Tree.css';

type Props = {
  tree: XBody;
  selectedNodeKey: string | null;
  onNodeSelect(key: string): void;
};

const b = block('own-tree');

function generateTreeNodes(node: XNode | XBody) {
  return (
    node.type === 'text'
      ? <TreeNode title={node.value} key={node.key} isLeaf />
      : (
        <TreeNode title={node.type} key={node.key}>
          {node.value.map(n => generateTreeNodes(n))}
        </TreeNode>
      )
  )
}

export class OwnTree extends React.PureComponent<Props> {
  public render() {
    const { tree, selectedNodeKey } = this.props;
    return (
      <DirectoryTree
        defaultExpandAll
        onSelect={this.onSelect}
        selectedKeys={selectedNodeKey ? [selectedNodeKey] : void(0)}
      >
        <TreeNode title={tree.type} key={tree.key}>
          {tree.value.map(n => generateTreeNodes(n))}
        </TreeNode>
      </DirectoryTree>
    );
  }

  @autobind
  private onSelect(selectedKeys: string[], e: AntTreeNodeSelectedEvent) {
    const { onNodeSelect } = this.props;
    console.log('selectedKeys', selectedKeys);
    onNodeSelect(selectedKeys[0]);
  };
}
