import { TagInput, TagInputStyles, TagInputOptions } from "./tag-input";

describe("TagInput", () => {
  let targetNode: HTMLDivElement;

  const style: TagInputStyles = {
    input: "input",
    tag: "tag",
    "tag-close": "tag-close",
    "tag-valid": "valid",
    "tag-invalid": "invalid",
  };

  const defaultOptions: TagInputOptions = {
    placeholder: "add more people…",
    validate: (tagValue: string) =>
      /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(
        tagValue
      ),
    style,
    tags: [],
  };

  beforeEach(() => {
    targetNode = document.createElement("div");
  });

  it("should create tag input", () => {
    const tagInput = new TagInput(targetNode, defaultOptions);
    expect(tagInput.tags).toEqual([]);
    expect(targetNode).toMatchInlineSnapshot(`
      <div>
        <input
          class="input"
          placeholder="add more people…"
          style="width: 16ch;"
          type="text"
        />
      </div>
    `);
  });

  it("should create tag input with tags", () => {
    const tags = ["valid@email.com", "invalid.email"];
    const tagInput = new TagInput(targetNode, {
      ...defaultOptions,
      tags,
    });
    expect(tagInput.tags).toEqual(tags);
    //This snapshot implicitly covers cases for valid/invalid element check
    expect(targetNode).toMatchInlineSnapshot(`
      <div>
        <span
          class="tag valid"
        >
          valid@email.com
          <button
            class="tag-close"
          />
        </span>
        <span
          class="tag invalid"
        >
          invalid.email
          <button
            class="tag-close"
          />
        </span>
        <input
          class="input"
          placeholder="add more people…"
          style="width: 16ch;"
          type="text"
        />
      </div>
    `);
  });

  it("should create separate tag inputs one 1 page", () => {
    document.body.innerHTML = `
     <div id="tag1"></div>
     <div id="tag2"></div>
    `;
    new TagInput(document.getElementById("tag1")!, {
      ...defaultOptions,
      placeholder: "tag 1 placholder",
      tags: ["invalid", "valid@emailcom"],
    });
    new TagInput(document.getElementById("tag2")!, {
      ...defaultOptions,
      placeholder: "tag 2 placholder",
      tags: ["valid@emailcom", "invalid"],
      style: {
        input: "custom-input",
        tag: "custom-tag",
        "tag-close": "custom-tag-close",
        "tag-valid": "custom-valid",
        "tag-invalid": "custom-invalid",
      },
    });
    expect(document.getElementById("tag1")).toMatchInlineSnapshot(`
      <div
        id="tag1"
      >
        <span
          class="tag invalid"
        >
          invalid
          <button
            class="tag-close"
          />
        </span>
        <span
          class="tag invalid"
        >
          valid@emailcom
          <button
            class="tag-close"
          />
        </span>
        <input
          class="input"
          placeholder="tag 1 placholder"
          style="width: 16ch;"
          type="text"
        />
      </div>
    `);
    expect(document.getElementById("tag2")).toMatchInlineSnapshot(`
      <div
        id="tag2"
      >
        <span
          class="custom-tag custom-invalid"
        >
          valid@emailcom
          <button
            class="custom-tag-close"
          />
        </span>
        <span
          class="custom-tag custom-invalid"
        >
          invalid
          <button
            class="custom-tag-close"
          />
        </span>
        <input
          class="custom-input"
          placeholder="tag 2 placholder"
          style="width: 16ch;"
          type="text"
        />
      </div>
    `);
  });

  describe("behaviour", () => {
    let tagInput: TagInput;
    let input: HTMLInputElement;
    let tagAddedMock: jest.Mock;
    let tagDeletedMock: jest.Mock;

    beforeEach(() => {
      tagInput = new TagInput(targetNode, defaultOptions);
      targetNode.addEventListener("tagadded", (tagAddedMock = jest.fn()));
      targetNode.addEventListener("tagdeleted", (tagDeletedMock = jest.fn()));
      input = targetNode.querySelector(`.${style.input}`) as HTMLInputElement;
    });

    it("should add tags", () => {
      tagInput.addItem("example@mail.ru");
      expect(tagInput.tags).toHaveLength(1);
      expect(tagInput.tags).toEqual(["example@mail.ru"]);
      expect(input.value).toEqual("");
      expect(targetNode).toMatchInlineSnapshot(`
        <div>
          <span
            class="tag valid"
          >
            example@mail.ru
            <button
              class="tag-close"
            />
          </span>
          <input
            class="input"
            placeholder="add more people…"
            style="width: 16ch;"
            type="text"
          />
        </div>
      `);
    });

    it("should replace tags", () => {
      tagInput.replaceItems(["example@mail.ru", "aaa@mail.com"]);
      expect(tagInput.tags).toEqual(["example@mail.ru", "aaa@mail.com"]);
      expect(input.value).toEqual("");

      //Add some input and replacve again
      input.value = "blablabla";
      tagInput.replaceItems(["aaa.bbb@mail.com"]);
      expect(tagInput.tags).toEqual(["aaa.bbb@mail.com"]);
      expect(input.value).toEqual("blablabla");

      //Caling with no value equals replacing to an empty list
      tagInput.replaceItems();
      expect(tagInput.tags).toEqual([]);
      expect(input.value).toEqual("blablabla");
    });

    it.each([",", "Enter"])("should add tags on keydown", (key) => {
      input.value = "example@mail.ru";
      input.dispatchEvent(new KeyboardEvent("keydown", { key }));
      expect(tagInput.tags).toHaveLength(1);
      expect(tagInput.tags).toEqual(["example@mail.ru"]);
      expect(input.value).toEqual("");
      expect(tagAddedMock).toBeCalledWith(
        expect.objectContaining({ detail: { tag: "example@mail.ru" } })
      );
    });

    it("should not add tags on keydown if its not Enter or comma", () => {
      input.value = "example@mail.ru";
      input.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
      expect(tagInput.tags).toHaveLength(0);
      expect(tagInput.tags).toEqual([]);
      expect(input.value).toEqual("example@mail.ru");
      expect(tagAddedMock).not.toBeCalled();
    });

    it("should add tags on blur", () => {
      input.value = "example@mail.ru";
      input.dispatchEvent(new Event("blur"));
      expect(tagInput.tags).toHaveLength(1);
      expect(tagInput.tags).toEqual(["example@mail.ru"]);
      expect(input.value).toEqual("");
    });

    it("should not add tags on blur if input is empty", () => {
      input.value = "";
      input.dispatchEvent(new Event("blur"));
      expect(tagInput.tags).toHaveLength(0);
      expect(tagInput.tags).toEqual([]);
      expect(input.value).toEqual("");
    });

    it("should add tags on paste", () => {
      const clipboardEvent = new Event("paste");

      (clipboardEvent as any)["clipboardData"] = {
        getData: () =>
          " example@mail.ru, a@a.com,  aaa@bbb.cc , wrong stuff, some.mail@that-wont-get-to-list.com",
      };
      input.dispatchEvent(clipboardEvent);

      expect(tagInput.tags).toHaveLength(3);
      expect(tagInput.tags).toEqual([
        "example@mail.ru",
        "a@a.com",
        "aaa@bbb.cc",
      ]);
      expect(input.value).toEqual(
        " wrong stuff, some.mail@that-wont-get-to-list.com"
      );
    });

    it("should not add tags on paste if nothing is pasted", () => {
      const clipboardEvent = new Event("paste");
      (clipboardEvent as any)["clipboardData"] = {
        getData: () => null,
      };
      input.dispatchEvent(clipboardEvent);

      expect(tagInput.tags).toHaveLength(0);
      expect(tagInput.tags).toEqual([]);
      expect(input.value).toEqual("");
    });

    it("should delete tags", () => {
      tagInput.replaceItems(["valid@email.com", "invalid.email"]);
      expect(tagInput.tags).toHaveLength(2);
      expect(tagInput.tags).toEqual(["valid@email.com", "invalid.email"]);
      expect(input.value).toEqual("");

      //Dipatch close event
      const closeBtn = targetNode.querySelectorAll(`.${style["tag-close"]}`)[1]; // Get second item 'invalid.email'
      closeBtn.dispatchEvent(new Event("click", { bubbles: true }));

      expect(tagInput.tags).toHaveLength(1);
      expect(tagInput.tags).toEqual(["valid@email.com"]);
      expect(input.value).toEqual("");
      expect(tagDeletedMock).toBeCalledWith(
        expect.objectContaining({ detail: { tag: "invalid.email" } })
      );
    });
  });
});
