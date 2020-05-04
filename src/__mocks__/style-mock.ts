import type { Styles } from '../tag-input-style.css'

const styles: Styles = {
  toString: () => 'INJECTED VERY REAL STYLES',
  locals: {
    input: 'imput',
    tag: 'tag',
    'tag-close': 'tag-close',
    'tag-valid': 'valid',
    'tag-invalid': 'invalid'
  }
}

export default styles
