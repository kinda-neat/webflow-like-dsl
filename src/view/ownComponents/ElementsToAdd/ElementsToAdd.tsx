import * as React from 'react';
import block from 'bem-cn';
import { Radio, Input, Button } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { autobind } from 'core-decorators';

import { XNode, XNodeType } from 'model';

import './ElementsToAdd.css';

type Props = {
  elements: XNodeType[];
  onElementAdd(type: XNodeType): void;
};

type State = {
  elementToAdd: XNodeType;
};

const b = block('own-elements-to-add');

export class ElementsToAdd extends React.PureComponent<Props, State> {
  static radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };

  public state: State = {
    elementToAdd: 'div',
  };

  public render() {
    const { elements } = this.props;
    return (
      <div className={b()}>
        <h3>Add elements</h3>
        <div>
          <Radio.Group onChange={this.handleElementToAddChange} value={this.state.elementToAdd}>
            {elements.map((el, index) => (
              <Radio style={ElementsToAdd.radioStyle} value={el} key={index}>
                {el}
              </Radio>
            ))}
          </Radio.Group>
        </div>
        <Button onClick={this.handleElementAdd}>Add element</Button>
      </div>
    );
  }

  @autobind
  private handleElementToAddChange(e: RadioChangeEvent) {
    this.setState({ elementToAdd: e.target.value });
  }

  @autobind
  private handleElementAdd() {
    const { onElementAdd } = this.props;
    onElementAdd(this.state.elementToAdd);
  }
}
