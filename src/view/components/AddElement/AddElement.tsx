import * as React from 'react';
import { autobind } from 'core-decorators';
import block from 'bem-cn';

import { XNode, elements, XNodeType, node } from 'model';

import './AddElement.css';

type Props = {
  onElementAdd(node: XNode): void;
};

type State = {
  selectedElementType: XNodeType;
  textContent: string;
}

const b = block('add-element');

export class AddElement extends React.PureComponent<Props, State> {
  public state: State = {
    selectedElementType: 'div',
    textContent: '',
  };

  public render() {
    return (
      <div className={b()}>
        <h3>Add elements</h3>
        {elements.map(elName => (
          <div className={b('field')}>
            {this.renderRadioInput(elName, elName, 'element-type')}
          </div>
        ))}
        {this.state.selectedElementType === 'text' && this.renderTextInput()}
        <button onClick={this.handleElementAdd}>Add Element</button>
      </div>
    );
  }

  @autobind
  private handleElementAdd() {
    const { onElementAdd } = this.props;
    const { selectedElementType, textContent } = this.state;
    if (selectedElementType !== null) {
      const newNode = selectedElementType === 'text' ? node('text', textContent) : node(selectedElementType);
      onElementAdd(newNode); 
    }
  }

  @autobind
  private renderRadioInput(name: XNodeType, value: string, groupName: string) {
    const { selectedElementType } = this.state;
    return (
      <label>
        <input
          type="radio"
          name={groupName}
          value={value}
          checked={selectedElementType === value}
          onChange={this.handleSelectedElementTypeChange}
        />
        {name}
      </label>
    );
  }

  @autobind
  private handleSelectedElementTypeChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ selectedElementType: e.target.value as XNodeType });
  }

  @autobind
  private renderTextInput() {
    return (
      <div className={b('field')}>
        <label>
          Change textContent
          <input type="text" name="text" value={this.state.textContent} onChange={this.handleTextContentChange}/>
        </label>
      </div>
    );
  }

  @autobind handleTextContentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    this.setState({ textContent: value });
  }

  private renderElementCreator(type: XNodeType) {
    switch (type) {
      case 'div': return null;
      case 'paragraph': return null;
      case 'text': return this.renderTextInput();
      default: {
        const _exhaustiveCheck: never = type;
      }
    }
  }
}
