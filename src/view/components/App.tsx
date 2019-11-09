import * as React from 'react';
import { autobind } from 'core-decorators';
import block from 'bem-cn';

import { body, text, paragraph, div, node, XBody, insertNode, XNodeType, XNode } from 'model';
import { AddElement } from 'view/components/AddElement/AddElement';
import { Navigator } from 'view/components/Navigator/Navigator';
import { ElementsToAdd } from 'view/ownComponents/ElementsToAdd/ElementsToAdd';
import { Site } from 'view/ownComponents/Site/Site';

import './App.css';

// AIT - Abstract interface tree

const generatedAIT = body(
  paragraph(text('Paragraph text')),
  div(div(text(`I'm in div inside another div`))),
);

type State = {
  ait: XBody;
  selectedNodeKey: string | null;
};

const b = block('app');

export class App extends React.PureComponent<{}, State> {
  static elements: XNodeType[] = ['div', 'paragraph', 'text'];
  public state: State = {
    ait: generatedAIT,
    selectedNodeKey: null,
  };

  public render() {
    const { selectedNodeKey, ait } = this.state;

    return (
      <div className={b()}>
        <div className={b('sidebar')}>
          <div className={b('add-element')}>
            {/* <AddElement onElementAdd={this.handleElementAdd} /> */}
            <ElementsToAdd elements={App.elements} onElementAdd={this.handleElementAdd} />
          </div>
          <div className={b('selected-node-info')}>
            SelectedNodeKey: {this.state.selectedNodeKey}
          </div>
        </div>
        <div className={b('navigator')}>
          <Navigator
            ait={ait}
            selectedNodeKey={selectedNodeKey}
            onNodeSelect={this.handleNodeSelect}
          />
        </div>
        <div className={b('site')}>
          <Site ait={ait} />
        </div>
      </div>
    );
  }

  @autobind
  private handleElementAdd(type: XNodeType) {  
    const { selectedNodeKey, ait } = this.state;
    if (selectedNodeKey !== null) {
      const nodeToInsert = type === 'text' ? node(type, 'Text here') : node(type);
      const newAIT = insertNode(ait, selectedNodeKey, nodeToInsert);
      this.setState({ ait: newAIT });
    }
  }

  @autobind
  private handleNodeSelect(key: string) {
    this.setState({ selectedNodeKey: key });
  }
}
