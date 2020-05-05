import { TagInput, TagInputStyles, TagInputOptions } from "./tag-input";

describe("TagInput", () => {
  let targetNode: HTMLDivElement;

  const style: TagInputStyles = {
    container: "container",
    input: "input",
    tag: "tag",
    "tag-close": "tag-close",
    "tag-text": "tag-text",
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
    type: 'email'
  };

  beforeEach(() => {
    targetNode = document.createElement("div");
  });

  it("should create tag input", () => {
    const tagInput = new TagInput(targetNode, defaultOptions);
    expect(tagInput.tags).toEqual([]);
    expect(targetNode).toMatchInlineSnapshot(`
      <div
        class="container"
      >
        <input
          class="input"
          placeholder="add more people…"
          style="width: 16ch;"
          type="email"
        />
      </div>
    `);
  });

  it("should create tag input with type 'text'", () => {
    const tagInput = new TagInput(targetNode, { ...defaultOptions, type: 'text' });
    expect(tagInput.tags).toEqual([]);
    expect(targetNode).toMatchInlineSnapshot(`
      <div
        class="container"
      >
        <input
          class="input"
          placeholder="add more people…"
          style="width: 16ch;"
          type="text"
        />
      </div>
    `);
  })

  it("should create tag input with tags", () => {
    const tags = ["valid@email.com", "invalid.email"];
    const tagInput = new TagInput(targetNode, {
      ...defaultOptions,
      tags,
    });
    expect(tagInput.tags).toEqual(tags);
    //This snapshot implicitly covers cases for valid/invalid element check
    expect(targetNode).toMatchInlineSnapshot(`
      <div
        class="container"
      >
        <span
          class="tag valid"
        >
          <span
            class="tag-text"
          >
            valid@email.com
          </span>
          <button
            class="tag-close"
          />
        </span>
        <span
          class="tag invalid"
        >
          <span
            class="tag-text"
          >
            invalid.email
          </span>
          <button
            class="tag-close"
          />
        </span>
        <input
          class="input"
          placeholder="add more people…"
          style="width: 16ch;"
          type="email"
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
        container: "custom-container",
        input: "custom-input",
        tag: "custom-tag",
        "tag-text": "custom-tag-text",
        "tag-close": "custom-tag-close",
        "tag-valid": "custom-valid",
        "tag-invalid": "custom-invalid",
      },
    });
    expect(document.getElementById("tag1")).toMatchInlineSnapshot(`
      <div
        class="container"
        id="tag1"
      >
        <span
          class="tag invalid"
        >
          <span
            class="tag-text"
          >
            invalid
          </span>
          <button
            class="tag-close"
          />
        </span>
        <span
          class="tag invalid"
        >
          <span
            class="tag-text"
          >
            valid@emailcom
          </span>
          <button
            class="tag-close"
          />
        </span>
        <input
          class="input"
          placeholder="tag 1 placholder"
          style="width: 16ch;"
          type="email"
        />
      </div>
    `);
    expect(document.getElementById("tag2")).toMatchInlineSnapshot(`
      <div
        class="custom-container"
        id="tag2"
      >
        <span
          class="custom-tag custom-invalid"
        >
          <span
            class="custom-tag-text"
          >
            valid@emailcom
          </span>
          <button
            class="custom-tag-close"
          />
        </span>
        <span
          class="custom-tag custom-invalid"
        >
          <span
            class="custom-tag-text"
          >
            invalid
          </span>
          <button
            class="custom-tag-close"
          />
        </span>
        <input
          class="custom-input"
          placeholder="tag 2 placholder"
          style="width: 16ch;"
          type="email"
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
        <div
          class="container"
        >
          <span
            class="tag valid"
          >
            <span
              class="tag-text"
            >
              example@mail.ru
            </span>
            <button
              class="tag-close"
            />
          </span>
          <input
            class="input"
            placeholder="add more people…"
            style="width: 16ch;"
            type="email"
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
        "wrong stuff, some.mail@that-wont-get-to-list.com"
      );
    });

    it("should add tags on paste 2 times", () => {
      const clipboardEvent = new Event("paste");

      (clipboardEvent as any)["clipboardData"] = {
        getData: () =>
          " example@mail.ru, a@a.com,  aaa@bbb.cc , wrong stuff, some.mail@that-wont-get-to-list.com",
      };
      input.dispatchEvent(clipboardEvent);
      input.dispatchEvent(clipboardEvent);

      expect(tagInput.tags).toHaveLength(6);
      expect(tagInput.tags).toEqual([
        "example@mail.ru",
        "a@a.com",
        "aaa@bbb.cc",
        "example@mail.ru",
        "a@a.com",
        "aaa@bbb.cc",
      ]);
      expect(input.value).toEqual(
        "wrong stuff, some.mail@that-wont-get-to-list.comwrong stuff, some.mail@that-wont-get-to-list.com"
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
