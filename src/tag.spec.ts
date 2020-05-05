import { Tag, TagStyles } from "./tag";

describe("Tag component", () => {
  const style: TagStyles = {
    tag: "tag",
    "tag-text": "tag-text",
    "tag-close": "tag-close",
    "tag-valid": "valid",
    "tag-invalid": "invalid",
  };

  it("should create valid tag", () => {
    const tag = new Tag("test", {
      valid: true,
      style,
    });
    expect(tag.node).toMatchInlineSnapshot(`
      <span
        class="tag valid"
      >
        <span
          class="tag-text"
        >
          test
        </span>
        <button
          class="tag-close"
        />
      </span>
    `);
  });

  it("should create valid tag", () => {
    const tag = new Tag("test", {
      valid: false,
      style,
    });
    expect(tag.node).toMatchInlineSnapshot(`
      <span
        class="tag invalid"
      >
        <span
          class="tag-text"
        >
          test
        </span>
        <button
          class="tag-close"
        />
      </span>
    `);
  });

  it("should escape tag", () => {
    const tag = new Tag("<script>alert(1)</script>", {
      valid: false,
      style,
    });
    expect(tag.node).toMatchInlineSnapshot(`
      <span
        class="tag invalid"
      >
        <span
          class="tag-text"
        >
          &lt;script&gt;alert(1)&lt;/script&gt;
        </span>
        <button
          class="tag-close"
        />
      </span>
    `);
  });
});
