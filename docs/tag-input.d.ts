import { TagStyles } from './tag';
export interface TagInputStyles extends TagStyles {
    input: string;
    container: string;
}
export interface TagInputOptions {
    placeholder: string;
    validate: (tagValue: string) => boolean;
    style: TagInputStyles;
    tags: string[];
    type: 'text' | 'email';
}
export declare class TagInput {
    private node;
    private options;
    private input;
    private tagNodes;
    constructor(node: HTMLElement, options: TagInputOptions);
    private initEvents;
    addItem(value: string): this;
    replaceItems(values?: string[]): this;
    get tags(): string[];
    private triggerEvent;
    private onPaste;
    private set inputValue(value);
    private get inputValue();
    private onInput;
    private onInputKey;
    private onCreateTag;
    private createTag;
}
