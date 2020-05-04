import createTagInput = require("./index");
import { TagInput } from "./tag-input";

describe("index", () => {
  let targetNode: HTMLDivElement;

  beforeEach(() => {
    targetNode = document.createElement("div");
  });

  it("should throw if node is null or not a dom node", () => {
    expect(() => createTagInput(null as any)).toThrowError();
    expect(() =>
      createTagInput({ name: "Absolutely not a node" } as any)
    ).toThrowError();
  });

  it("should return TagInput", () => {
    const input = createTagInput(targetNode);
    expect(input instanceof TagInput).toBeTruthy();
    expect(document.head).toMatchInlineSnapshot(`
      <head>
        <style>
          INJECTED VERY REAL STYLES
        </style>
      </head>
    `);
    expect(targetNode).toMatchInlineSnapshot(`
      <div>
        <input
          class="imput"
          placeholder="add more people…"
          style="width: 16ch;"
          type="text"
        />
      </div>
    `);
  });

  it("should create TagInput with options", () => {
    const input = createTagInput(targetNode, {
      tags: ["wrong.email", "correct@mail.com"],
      placeholder: "Add email...",
    });
    expect(targetNode).toMatchInlineSnapshot(`
      <div>
        <span
          class="tag invalid"
        >
          wrong.email
          <button
            class="tag-close"
          />
        </span>
        <span
          class="tag valid"
        >
          correct@mail.com
          <button
            class="tag-close"
          />
        </span>
        <input
          class="imput"
          placeholder="Add email..."
          style="width: 12ch;"
          type="text"
        />
      </div>
    `);
  });
  it("should return same TagInput on subsequent calls", () => {
    const input1 = createTagInput(targetNode);
    const input2 = createTagInput(targetNode);
    expect(input1 === input2).toBe(true);
  });

  it("should not inject styles more than once", () => {
    document.body.innerHTML = `
     <div id="tag1"></div>
     <div id="tag2"></div>
    `;
    createTagInput(document.getElementById("tag1")!);
    createTagInput(document.getElementById("tag2")!);
    expect(document.head.querySelectorAll("style")).toMatchInlineSnapshot(`
      NodeList [
        <style>
          INJECTED VERY REAL STYLES
        </style>,
      ]
    `);
  });
});
