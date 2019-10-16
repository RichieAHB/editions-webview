import { h2 } from "../helpers";
import { styled } from "../styles";

export const Byline = styled(h2)`
  color: ${theme => theme.main};
  font-size: 16px;
  line-height: 20px;
  padding: 4px 0 1em;
  font-weight: 700;
  margin: 0;
`;
