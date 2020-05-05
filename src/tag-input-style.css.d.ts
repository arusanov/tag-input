import type { TagInputStyles } from './tag-input'

/* This is handcoded as we have only 1 css file but it can be easily automated */
export interface Styles {
  toString(): string
  locals: TagInputStyles
}
declare const styles: Styles

export default styles
