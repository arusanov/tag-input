declare global {
    interface Window {
        clipboardData: DataTransfer | null;
    }
    interface Element {
        matchesSelector: Element['matches'];
        msMatchesSelector: Element['matches'];
    }
    interface HTMLInputElement {
        beforepaste: HTMLInputElement['onpaste'];
    }
}
/**
 * Elemt factory
 * @param tagName HTML tag name
 * @param props tag props
 * @param children
 */
export declare function element<K extends keyof HTMLElementTagNameMap>(tagName: K, props?: Partial<HTMLElementTagNameMap[K]>, ...children: Node[]): HTMLElementTagNameMap[K];
/**
 * Get text from clipboard event (with ie11 support)
 * @param e clipboard event
 */
export declare function getClipboardData(e: ClipboardEvent): string | undefined;
declare type EventListener<K extends keyof HTMLElementEventMap> = (this: HTMLElement, ev: HTMLElementEventMap[K]) => any;
/**
 * Delegated event handler
 * @param selector CSS selector
 * @param listener Original listener
 */
export declare function matchingEventListener<K extends keyof HTMLElementEventMap>(selector: string, listener: EventListener<K>): EventListener<K>;
export declare function combineEventListener<K extends keyof HTMLElementEventMap>(...listeners: EventListener<K>[]): EventListener<K>;
/**
 * Inject style once function.
 */
export declare const injectStyle: (cssStyles: string) => HTMLStyleElement | undefined;
export declare function insertTextAtCutrsorPosition(input: HTMLInputElement, text: string): string;
/**
 * Adjusts input width to text size
 * @param input HTMLInput
 * @param text
 */
export declare function adjustInputSize(input: HTMLInputElement, ...texts: string[]): void;
export {};
