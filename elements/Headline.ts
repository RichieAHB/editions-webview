import { h1 } from "../helpers";
import { styled } from "../styles";

export const Headline = styled(h1)`
  color: ${theme => theme.headerColor};
  padding: 8px 0 0;
  margin: 0 0 30px;
  font-size: 36px;
  line-height: 38px;
  font-weight: 400;
`;
