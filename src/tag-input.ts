import {
  element,
  getClipboardData,
  matchingEventListener,
  insertTextAtCutrsorPosition
} from './dom-utils'
import { Tag, TagStyles } from './tag'

export interface TagInputStyles extends TagStyles {
  input: string
}

export interface TagInputOptions {
  placeholder: string
  validate: (tagValue: string) => boolean
  style: TagInputStyles
  tags: string[]
}

const enum TagInputEvents {
  TagAdded = 'tagadded',
  TagDeleted = 'tagdeleted'
}

export class TagInput {
  private input: HTMLInputElement
  private tagNodes: Tag[] = []

  constructor(private node: HTMLElement, private options: TagInputOptions) {
    // Create input inside provided element
    node.appendChild(
      (this.input = element('input', {
        type: 'text',
        placeholder: this.options.placeholder,
        className: this.options.style.input,
        oninput: this.onInput,
        onblur: this.onCreateTag,
        onkeydown: this.onInputKeydown,
        onpaste: this.onPaste,
        beforepaste: this.onPaste
      }))
    )
    node.addEventListener(
      'click',
      matchingEventListener(`.${this.options.style['tag-close']}`, (e) => {
        //Remove tag
        this.tagNodes = this.tagNodes.filter((tag) => {
          if (tag.closeButton === e.target) {
            this.node.removeChild(tag.node)
            this.triggerEvent(TagInputEvents.TagDeleted, tag.value)
            return false
          }
          return true
        })
      })
    )

    this.tagNodes = this.options.tags.map(this.createTag)
    this.adjustInputSize()
  }

  public addItem(value: string) {
    this.createTag(value)
    return this
  }

  public replaceItems(values: string[] = []) {
    this.tagNodes = values.map(this.createTag)
    return this
  }

  public get tags() {
    return this.tagNodes.map((t) => t.value)
  }

  private triggerEvent(eventType: TagInputEvents, tag: string) {
    //Thanks to ie11 we have to do it this way
    const evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(eventType, false, false, { tag })
    this.node.dispatchEvent(evt)
  }

  private onPaste = (e: ClipboardEvent) => {
    const content = getClipboardData(e)
    if (content) {
      const parts = content.split(',')
      let part: string | undefined = undefined
      // Try validating all parts. When validation fails - stop
      while ((part = parts.shift()) && this.options.validate(part.trim())) {
        this.createTag(part.trim())
      }
      //Paste remaining text back into input
      this.inputValue = insertTextAtCutrsorPosition(
        this.input,
        [part].concat(parts).join(',')
      )
      e.preventDefault() // As we inserted stuff we don't need it to be inserted once again
    }
  }

  private set inputValue(val: string) {
    this.input.value = val
    this.onInput()
  }

  private get inputValue(): string {
    return this.input.value
  }

  private onInput = () => {
    this.node.scrollTop = this.node.scrollHeight
    this.adjustInputSize()
  }

  private adjustInputSize = () => {
    this.input.size = (this.inputValue || this.options.placeholder).length
  }

  private onInputKeydown = (e: KeyboardEvent) => {
    // Not sure whys 'space' isn't here
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      this.onCreateTag()
    }
  }

  private onCreateTag = () => {
    if (this.inputValue) {
      this.createTag(this.inputValue)
      this.inputValue = ''
    }
  }

  private createTag = (value: string) => {
    const tag = new Tag(value, {
      valid: this.options.validate(value),
      style: this.options.style
    })
    this.node.insertBefore(tag.node, this.input)
    this.tagNodes.push(tag)
    this.triggerEvent(TagInputEvents.TagAdded, value)
    return tag
  }
}
