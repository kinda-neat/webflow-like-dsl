const util = require('util'); 
const v4 = require('uuid/v4');

export type XBody = {
  type: 'body',
  value: XNode[];
  key: 'ROOT';
}

type WithKey = {
  key: string;
};

type XDiv = {
  type: 'div';
  value: XNode[];
} & WithKey;

type XParagraph = {
  type: 'paragraph';
  value: XNode[];
} & WithKey;

type XText = {
  type: 'text';
  value: string;
} & WithKey;

export type XNode = XDiv | XParagraph | XText;
export type XNodeType = XNode['type'];

type Combinator = {
  div: Comb<XDiv>;
  paragraph: Comb<XParagraph>;
  text: (...value: string[]) => XText;
};

type TextP = (...args: string[]) => XText;
type BodyC = (...args: XNode[]) => XBody;
type Comb<T extends Exclude<XNode, XText>> = (...args: XNode[]) => T;

type ParagraphC = Comb<XParagraph>;
type DivC = Comb<XDiv>;

export const elements: XNodeType[] = ['div', 'paragraph', 'text'];

export const text: TextP = (...args: string[]) => ({
  type: 'text',
  value: args.join(' '),
  key: v4(),
});

export const paragraph: ParagraphC = (...args) => ({
  type: 'paragraph',
  value: args,
  key: v4(),
});

export const div: DivC = (...args) => ({
  type: 'div',
  value: args,
  key: v4(),
});

export const body: BodyC = (...args) => ({
  type: 'body',
  value: args,
  key: 'ROOT',
});


type NodeCreator = {
  (type: XNodeType, ...args: XNode[] | string[]): XNode;
  (type: 'div', ...args: XNode[]): XDiv;
  (type: 'paragraph', ...args: XNode[]): XParagraph;
  (type: 'text', ...args: string[]): XText;
};

export function nodex(type: 'div', ...args: XNode[]): XNode;
export function nodex(type: 'paragraph', ...args: XNode[]): XParagraph;
export function nodex(type: 'text', ...args: string[]): XText;
export function nodex(type: XNodeType, ...args: XNode[] | string[]): XNode {
  switch(type) {
    case 'div': 
    return div(...args); // (*) typescript sucks :(
  }
  return null as any
}

nodex('div', div(text('text'))); // (*) infers types correctly
nodex('text', 'content');

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

type TempCombinator = {
  div: (...args: XNode[]) => XDiv;
  paragraph: (...args: XNode[]) => XParagraph;
  text: (...args: string[]) => XText;
};

type TempCombinatorKeys = keyof TempCombinator;
type ArgsTypesD = ArgumentTypes<TempCombinator['div']>;
type ArgsTypesP = ArgumentTypes<TempCombinator['paragraph']>;
type ArgsTypesT = ArgumentTypes<TempCombinator['text']>;
type ReturnTypeD = ReturnType<TempCombinator['div']>;

export function node<T extends keyof TempCombinator>(
  type: T,
  ...args: ArgumentTypes<TempCombinator[T]>
): ReturnType<TempCombinator[T]> {
  type B = typeof args;
  // if (onlyStrings(args)) {
  //   if (type === 'text') return text(...args) as any;
  // } else {
  //   args
  //   if (type === 'div') return div(...args) as any;
  // }

  switch (type) {
    case 'div': return div(...args); // typescript sucks :(
    case 'paragraph': return paragraph(...args as any[]) as any;
    case 'text': return text(...args as any[]) as any;
    default: {
      const _exhaustiveCheck: never = type;
      return text('Something bad happened') as any;
    }
  }
}


node('div', paragraph(text('sdf')));
node('text', 'content');

function onlyStrings(args: unknown[]): args is string[] {
  return args.every(x => typeof x === 'string');
}

const desiredAIT: XBody = {
  type: 'body',
  key: 'ROOT',
  value: [{
    type: 'div',
    value: [{
      type: 'text',
      value: `I'm in div!`,
      key: '2',
    }],
    key: '1',
  }, {
    type: 'paragraph',
    value: [{
      type: 'text',
      value: `I'm in paragraph!`,
      key: '3',
    }],
    key: '4',
  }]
};

const generatedAIT: XBody = body(
  div(
    div(text(`I'm in div`)),
    paragraph(text(`I'm in paragraph!`))
  )
);

export function insertNode(tree: XNode | XBody, parentKey: string, node: XNode) {
  if (tree.type !== 'text') {
    if (tree.key === parentKey) {
      return {
        ...tree,
        value: tree.value.concat(node),
      }
    } else {
      return {
        ...tree,
        value: tree.value.map(n => insertNode(n, parentKey, node))
      }
    }
  } else {
    return tree;
  }
}

const newDesiredAIT = insertNode(desiredAIT, '1', {
  type: 'div',
  key: 'sdf',
  value: [{
    type: 'text',
    value: `I'm inserted node!`,
    key: 'asdfasdf'
  }],
})

console.log('desiredAIT', util.inspect(desiredAIT, false, null, true));
console.log('newDesiredAIT', util.inspect(newDesiredAIT, false, null, true));
