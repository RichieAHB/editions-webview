import { styled } from "../styles";
import { div } from "../helpers";

export const FillToLine = styled(div)`
  margin: 0 -8px;

  @media (min-width: 900px) {
    margin-left: calc(-20vw - 8px);
  }
`;
