import { element } from "./dom-utils"

describe('dom utils', () => {
  it('shopuld create elements', () => {
    expect(element('input', {
      type: 'text',
      placeholder: 'test',
      className: 'test-input',
      oninput: ()=> '',
    }))
  })

  // We could continue with next tests but the require more complex setup
})
