let i = 0;

const getClassName = () => `s${++i}`;

/**
 * Remove fields that are undefined in order that, when spread,
 * they don't override defined fields
 */
const defined = <A extends { [key: string]: any }>(a: A): A => {
  const b: any = {};
  for (const [key, value] of Object.entries(a)) {
    if (typeof value !== "undefined") b[key] = value;
  }
  return b;
};

const camelCaseToKebabCase = (str: string) =>
  str.replace(
    /([a-z])([A-Z])/g,
    (_, end, start) => `${end}-${start.toLowerCase()}`
  );

export type Styles = Partial<CSSStyleDeclaration>;

const stylesToCSS = (styles: Styles) =>
  Object.entries(styles)
    .map(([k, v]) => `${camelCaseToKebabCase(k)}:${v}`)
    .join(";");

export type AttrMap = { [key: string]: any; style?: Styles; class?: string };

const attrsToString = (attrs: AttrMap) =>
  Object.entries(defined(attrs))
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");

const padIf = (str: string) => str && ` ${str}`;

export { getClassName, stylesToCSS, padIf, attrsToString, defined };
