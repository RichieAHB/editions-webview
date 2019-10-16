import { svg, path, blockquote, cite } from "../helpers";
import { styled } from "../styles";
import { Quote } from "./Quote";

const attrib = styled(cite)`
  font-style: normal;
  font-weight: bold;
  display: block;
`;

const quote = styled(blockquote)`
  box-sizing: border-box;
  border: 1px solid ${theme => theme.main};
  color: ${theme => theme.main};
  border-top-width: 12px;
  padding: 4px 1px 8px 8px;
  position: relative;
  line-height: 1.2;
  margin: 0;
  margin-bottom: calc(22px + 0.25em);
  margin-top: 0.25em;
  font-size: 1.1em;
  hyphens: auto;
  z-index: 10000;

  &[data-role="supporting"] {
    font-family: GT Guardian Titlepiece;
  }

  &[data-role="supporting"] ${attrib} {
    color: #111;
  }

  @media (max-width: 1000px) {
    &[data-role="inline"],
    &[data-role="supporting"] {
      width: 50%;
      float: left;
      margin-right: 8px;
    }
  }

  @media (min-width: 1000px) {
    &[data-role="inline"],
    &[data-role="supporting"] {
      position: absolute;
      left: 100%;
      display: block;
      width: 180px;
    }
  }

  @media (min-width: 1000px) {
    &[data-role="showcase"] {
      width: 60%;
      float: left;
      margin-right: 8px;
    }
  }
`;

const tail = styled(svg)`
  left: -1px;
  height: 22px;
  position: absolute;
  top: 100%;
  width: 22px;
`;

const line = styled(path)`
  fill: ${theme => theme.main};
`;

const Tail = tail.attrs({
  "aria-hidden": true,
  role: "img",
  xmlns: "http://www.w3.org/2000/svg"
})(
  line.attrs({
    d:
      "M22.007 0l-.033.53c-.273 4.415-1.877 9.35-4.702 13.22-3.74 5.124-9.301 8.115-16.763 8.246L0 22.005V0h22.007z"
  })(),
  path.attrs({
    d:
      "M1 0v20.982c6.885-.248 11.992-3.063 15.464-7.822 2.593-3.552 4.12-8.064 4.473-12.16.033-.38.037-.72.063-1H1z",
    fill: "#FFF"
  })()
);

export const Pullquote = ({
  cite,
  role,
  attribution
}: {
  cite: string;
  role: string;
  attribution?: string;
}) =>
  quote.attrs({ "data-role": role })(
    Quote({ height: "12px" }),
    cite,
    attribution ? attrib(attribution) : "",
    Tail
  );
