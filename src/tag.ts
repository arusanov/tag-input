import { element } from './dom-utils'

export interface TagStyles {
  tag: string
  'tag-close': string
  'tag-valid': string
  'tag-invalid': string
}

export interface TagOptions {
  valid: boolean
  style: TagStyles
}

export class Tag {
  node: HTMLElement
  closeButton: HTMLButtonElement
  constructor(public value: string, { valid, style }: TagOptions) {
    this.node = element(
      'span',
      {
        className: `${style.tag} ${
          valid ? style['tag-valid'] : style['tag-invalid']
        }`
      },
      document.createTextNode(value),
      (this.closeButton = element('button', {
        className: style['tag-close'],
        innerText: '×'
      }))
    )
  }
}
