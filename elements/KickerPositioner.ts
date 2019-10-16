import { styled } from "../styles";
import { div } from "../helpers";

export const KickerPositioner = styled(div)`
  margin-left: -8px;

  @media (min-width: 614px) {
    margin-left: 0;
  }
`;
