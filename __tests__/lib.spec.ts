import { createStyleContext, h, build } from "../lib";
import { fragment } from "../helpers";

describe("h", () => {
  describe("call", () => {
    it("creates HTML tags with that name when called", () => {
      const div = h("div");
      expect(div()).toEqual("<div></div>");
    });

    it("concats all string arguments and adds them as children to the tag", () => {
      const div = h("div");
      expect(div("hi", "there")).toEqual("<div>hithere</div>");
    });
  });

  describe("#attrs", () => {
    it("sets arbitrary attributes on an element", () => {
      const div = h("div");
      expect(div.attrs({ a: "1", b: "2" })()).toEqual(
        `<div a="1" b="2"></div>`
      );
    });

    it("is chainable and overwrites most attributes", () => {
      const div = h("div");
      expect(div.attrs({ a: "1", b: "2" }).attrs({ b: "3", c: "4" })()).toEqual(
        `<div a="1" b="3" c="4"></div>`
      );
    });

    it("concats class names", () => {
      const div = h("div");
      expect(div.attrs({ class: "a" }).attrs({ class: "b" })()).toEqual(
        `<div class="a b"></div>`
      );
    });

    it("merges styles and overwrites", () => {
      const div = h("div");
      expect(
        div
          .attrs({ style: { borderTopWidth: "1px", color: "blue" } })
          .attrs({ style: { borderBottomWidth: "2px", color: "green" } })()
      ).toEqual(
        `<div style="border-top-width:1px;color:green;border-bottom-width:2px"></div>`
      );
    });
  });
});

describe("build", () => {
  it("creates an object with keys that have a component creator named with the tag name", () => {
    const { a, b, c } = build(["a", "b", "c"]);

    expect(a()).toEqual("<a></a>");
    expect(b()).toEqual("<b></b>");
    expect(c()).toEqual("<c></c>");
  });
});

describe("createStyleContext", () => {
  describe("styled", () => {
    it("adds a style for a styled component", () => {
      const div = h("div");
      const { styled, getStyles } = createStyleContext();
      const StyledDiv = styled(div)`
        color: blue;
      `;
      expect(getStyles({})).toEqual(`.s1{color:blue;}`);
      expect(StyledDiv()).toEqual(`<div class="s1"></div>`);
    });

    it("interpolates themes", () => {
      const div = h("div");
      const { styled, getStyles } = createStyleContext<{ color: string }>();
      const StyledDiv = styled(div)`
        color: red;
      `;
      expect(getStyles({ color: "red" })).toEqual(`.s2{color:red;}`);
      expect(StyledDiv()).toEqual(`<div class="s2"></div>`);
    });

    it("interpolates other styled components", () => {
      const div = h("div");
      const { styled, getStyles } = createStyleContext();
      const StyledDiv1 = styled(div)`
        color: gold;
      `;
      const StyledDiv2 = styled(div)`
        ${StyledDiv1} {
          color: green;
        }
      `;
      expect(getStyles({})).toEqual(`.s3{color:gold;}.s4 .s3{color:green;}`);
      expect(StyledDiv2()).toEqual(`<div class="s4"></div>`);
    });

    it("accepts other styled components", () => {
      const div = h("div");
      const { styled, getStyles } = createStyleContext();
      const StyledDiv1 = styled(div)`
        color: red;
      `;
      const StyledDiv2 = styled(StyledDiv1)`
        font-size: 1px;
      `;
      expect(getStyles({ color: "red" })).toEqual(
        `.s5{color:red;}.s6{font-size:1px;}`
      );
      expect(fragment(StyledDiv1(), StyledDiv2())).toEqual(
        `<div class="s5"></div><div class="s5 s6"></div>`
      );
    });
  });

  describe("injectGlobal", () => {
    it("adds arbitrary CSS into the styles", () => {
      const { injectGlobal, getStyles } = createStyleContext();

      injectGlobal`
        a {
          font-size: 100px;
        }
      `;

      expect(getStyles({})).toEqual("a{font-size:100px;}");
    });
  });
});
