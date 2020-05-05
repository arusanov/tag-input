export interface TagStyles {
    tag: string;
    'tag-text': string;
    'tag-close': string;
    'tag-valid': string;
    'tag-invalid': string;
}
export interface TagOptions {
    valid: boolean;
    style: TagStyles;
}
export declare class Tag {
    value: string;
    node: HTMLElement;
    closeButton: HTMLButtonElement;
    constructor(value: string, { valid, style }: TagOptions);
}
