import { svg, g, path } from "../helpers";
import { styled } from "../styles";

const quote = styled(svg)`
  fill: ${theme => theme.main};
  display: inline-block;
  margin-right: 10px;
  height: 22px;
  vertical-align: baseline;
`;

export const Quote = ({
  color,
  height
}: { color?: string; height?: string } = {}) =>
  quote.attrs({
    style: { fill: color, height },
    role: "img",
    xlmns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 22 14"
  })(
    g.attrs({ "fill-rule": "evenodd" })(
      path.attrs({
        d:
          "M5.506 0h4.976c-.6 4.549-1.13 9.01-1.36 14H0C.83 9.142 2.557 4.549 5.506 0zM17.093 0H22c-.53 4.549-1.129 9.01-1.36 14h-9.099c.945-4.858 2.604-9.451 5.552-14z"
      })()
    )
  );
