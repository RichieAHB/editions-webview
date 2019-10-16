import stylis from "stylis";
import {
  getClassName,
  stylesToCSS,
  attrsToString,
  AttrMap,
  Styles,
  defined,
  padIf
} from "./utils";

/**
 * Will generate a component from a function that takes attributes
 * and string children and returns a string. Adding the `attrs`, `style`
 * and `currentAttrs` functionality.
 */
const createComponent = (
  fn: (attrs: AttrMap, ...children: string[]) => string
): Component => {
  const g = (...children: string[]) => fn({}, ...children);
  g.attrs = (prevAttrs: AttrMap) => {
    const cmp = createComponent((attrs, ...children) =>
      fn(
        {
          ...prevAttrs,
          ...defined(attrs), // defined ensures keys have defined values, and as such don't override previous attribute values
          class:
            `${prevAttrs.class || ""} ${attrs.class || ""}`.trim() || undefined, // coerce empty string to undefined to have it removed
          style: {
            ...prevAttrs.style,
            ...defined(attrs.style || {})
          }
        },
        ...children
      )
    );

    cmp.currentAttrs = prevAttrs;

    return cmp;
  };
  g.style = (style: Styles) => g.attrs({ style });
  g.currentAttrs = {};
  return g;
};

/**
 * Helper for generating components with given tag names
 */
const createTagComponent = (tag: string): Component =>
  createComponent(
    ({ style = {}, ...rest }: AttrMap, ...children: string[]) =>
      `<${tag}${padIf(
        attrsToString({
          ...rest,
          style: stylesToCSS(style) || undefined // coerce empty string to undefined to have it removed
        })
      )}>${children.join("")}</${tag}>`
  );

/**
 * Helper for building components that spit out HTML tags
 */
const build = (tags: string[]) =>
  tags.reduce(
    (acc, tag) => ({ ...acc, [tag]: createTagComponent(tag) }),
    {} as {
      [key: string]: ReturnType<typeof createTagComponent>;
    }
  );

/**
 * Interface for a component. It is a function with properties.
 * Calling with children will render it to a string.
 *
 * The keys allow adding attributes to the component and returning
 * a new component that will allow either rendering with these
 * attributes or appending / overwriting more attributes to that
 * component
 */
interface Component {
  (...children: string[]): string;
  attrs: (attrs: AttrMap) => Component;
  style: (styles: Styles) => Component;
  currentAttrs: AttrMap;
}

/**
 * The selectable represents an object that can be
 * represented with a selector and, as such, can be used
 * as an interpolator in a `styled` css template tag.
 *
 * Eg.
 *
 * ```js
 * const cmp1 = styled(h("div"))``
 * const cmp2 = styled(h("div"))`
 *   ${cmp1} {
 *     color: blue;
 *   }
 * `
 * ```
 */
type Selectable = { selector: string };

/**
 * This is the return value of `styled` a plain component
 * augmented with `Selectable` to allow it to act as an interpolated
 * value as above.
 */
type StyledComponent = Component & Selectable;

/**
 * This is a function that takes the data passed into
 * a `getStyles` call and will return some part of a CSS string
 *
 * ```js
 * const cmp1 = styled(h("div"))``
 * const cmp2 = styled(h("div"))`
 *   ${cmp1} {
 *     color: blue;
 *   }
 * `
 * ```
 */
type StyleBuilder<T> = (data: T) => string;

/**
 * This type represents anything that you can interpolate into the
 * template strings for styles
 */
type StyleInterpolator<T> = StyleBuilder<T> | Selectable;

/**
 * Runs either a StyleBuilder or gets the `selector` from a Selectable
 * as above
 **/
const runInterpolator = <T>(int: StyleInterpolator<T> | undefined, theme: T) =>
  int ? ("selector" in int ? int.selector : int(theme)) : "";

/**
 * Helper for creating a `selector` value for a styled component.
 *
 * Concatentate the classes with dots preceding them
 */
const classStringToSelector = (str: string) =>
  str.length ? `.${str.split(" ").join(".")}` : "";

/**
 * Turns a template string array and a list of `StyleInterpolator`
 * into one big `StyleBuilder`
 **/
const combineInterpolators = <T>(
  strs: TemplateStringsArray,
  fns: StyleInterpolator<T>[]
): StyleBuilder<T> => data =>
  strs.reduce(
    (out, str, i) => `${out}${str}${runInterpolator(fns[i], data)}`,
    ""
  );

/**
 * The main helper for adding styles to components.
 */
const createStyleContext = <T = {}>(getClassNameImpl = getClassName) => {
  const styles = [] as { sel: string; fn: StyleInterpolator<T> }[];

  /**
   * Any function that takes a template tag argument for CSS, with
   * a generic return type
   */
  type TempFn<R> = (
    strs: TemplateStringsArray,
    ...rest: StyleInterpolator<T>[]
  ) => R;

  const addClass: TempFn<string> = (strs, ...rest) => {
    let className = getClassNameImpl();
    styles.push({ sel: `.${className}`, fn: combineInterpolators(strs, rest) });
    return className;
  };

  /**
   * Adds a CSS class to the components, stores a function to be lazily evaluated
   * when `getStyles` is called which will generate the CSS for this CSS class and
   * finally returns that component with it's selector in order for using in other
   * template tags for other styled components as described above
   */
  const styled = (component: Component): TempFn<StyledComponent> => (
    str,
    ...rest
  ) => {
    const cmp = component.attrs({ class: addClass(str, ...rest) });
    // Type-safe way to move from a Component to a StyledComponent
    // clone the function (using `bind`), copy `attrs`, `style` fields etc.
    // and then add `selector` field
    return Object.assign(cmp.bind(undefined), cmp, {
      selector: classStringToSelector(cmp.currentAttrs.class || "")
    });
  };

  /**
   * Adds global CSS to the styles
   */
  const injectGlobal: TempFn<void> = (strs, ...rest) =>
    styles.push({ sel: "", fn: combineInterpolators(strs, rest) });

  /**
   * This function will generate and return the CSS for all created styled components
   * on this context at the time of calling it.
   */
  const getStyles = (theme: T) =>
    styles.map(s => stylis(s.sel, runInterpolator(s.fn, theme))).join("");

  return { styled, injectGlobal, getStyles };
};

export { createStyleContext, createTagComponent as h, build };
