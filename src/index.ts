import cssStyles from './tag-input-style.css'
import { TagInput, TagInputOptions } from './tag-input'
import { injectStyle } from './dom-utils'

const tagInputs = new WeakMap<HTMLElement, TagInput>()

const defaultOptions: TagInputOptions = {
  placeholder: 'add more people…',
  validate: (tagValue: string) =>
    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(tagValue),
  style: cssStyles.locals,
  tags: []
}

export = function (node: HTMLElement, options: Partial<TagInputOptions> = {}) {
  if (!node || !(node instanceof HTMLElement)) {
    throw new Error('node is null or not a dom element')
  }
  //TODO: In real world we would track deletion of TagInput and cleanup styles when there's none left
  injectStyle(cssStyles.toString())
  // Get existing tag or create new
  //TODO: In real world we should test if already cached tag has same options and if not - recreate keeping state
  const tag =
    tagInputs.get(node) ?? new TagInput(node, { ...defaultOptions, ...options })
  tagInputs.set(node, tag)
  return tag
}
