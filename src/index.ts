import cssStyles from './tag-input-style.css'
import { TagInput, TagInputOptions } from './tag-input'
import { injectStyle } from './dom-utils'

const tagInputs = new WeakMap<HTMLElement, TagInput>()

const defaultOptions: TagInputOptions = {
  placeholder: 'add tags',
  validate: (_tagValue: string) => true,
  style: cssStyles.locals,
  tags: [],
  type: 'text'
}

export default function(node: HTMLElement, options: Partial<TagInputOptions> = {}) {
  if (!node || !(node instanceof HTMLElement)) {
    throw new Error('node is null or not a dom element')
  }
  const config = { ...defaultOptions, ...options }
  if (!/^(text|email)$/.test(config.type)) {
    throw new Error('type ' + config.type + ' is not supported')
  }
  injectStyle(cssStyles.toString())
  const tag = tagInputs.get(node) ?? new TagInput(node, config)
  tagInputs.set(node, tag)
  return tag
}
