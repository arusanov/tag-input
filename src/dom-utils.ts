declare global {
  interface Window {
    // IE11 way of getting clipboard data
    clipboardData: DataTransfer | null
  }
  interface Element {
    // IE11 matches selector. Be damned ie11
    matchesSelector: Element['matches']
    msMatchesSelector: Element['matches']
  }
  interface HTMLInputElement {
    beforepaste: HTMLInputElement['onpaste']
  }
}

/**
 * Elemt factory
 * @param tagName HTML tag name
 * @param props tag props
 * @param children
 */
export function element<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  props: Partial<HTMLElementTagNameMap[K]> = {},
  ...children: Node[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName)
  Object.keys(props).forEach((key) => {
    if (/^on/.test(key)) {
      // In this demo we don't care about list of capture only event for weird edge cases
      element.addEventListener(key.substring(2), (props as any)[key])
    } else {
      ;(element as any)[key] = (props as any)[key]
    }
  })
  children.forEach((c) => element.appendChild(c))
  return element
}

/**
 * Get text from clipboard event (with ie11 support)
 * @param e clipboard event
 */
export function getClipboardData(e: ClipboardEvent): string | undefined {
  if (e.clipboardData) {
    return e.clipboardData.getData('Text')
  } else if (window.clipboardData) {
    return window.clipboardData.getData('text')
  }
}

const matches =
  Element.prototype.matches ||
  Element.prototype.matchesSelector ||
  Element.prototype.msMatchesSelector

type EventListener<K extends keyof HTMLElementEventMap> = (
  this: HTMLElement,
  ev: HTMLElementEventMap[K]
) => any

/**
 * Delegated event handler
 * @param selector CSS selector
 * @param listener Original listener
 */
export function matchingEventListener<K extends keyof HTMLElementEventMap>(
  selector: string,
  listener: EventListener<K>
) {
  return function (this: HTMLElement, ev: HTMLElementEventMap[K]): any {
    if (ev.target && matches.call(ev.target, selector)) {
      return listener.call(this, ev)
    }
  }
}

/**
 * Inject style once function.
 */
export const injectStyle = (function () {
  let styles: Record<string, HTMLStyleElement | undefined> = {}
  return function (cssStyles: string) {
    if (!styles[cssStyles]) {
      //Inject style once on first creation
      document.head.appendChild(
        (styles[cssStyles] = element(
          'style',
          {},
          document.createTextNode(cssStyles)
        ))
      )
    }
    return styles[cssStyles]
  }
})()

export function insertTextAtCutrsorPosition(
  input: HTMLInputElement,
  text: string
) {
  return (
    (input.value.substring(0, input.selectionStart ?? 0) ?? '') +
    text +
    (input.value.substring(input.selectionEnd ?? 0) ?? '')
  )
}
