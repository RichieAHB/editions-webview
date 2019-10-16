import { styled } from "../styles";
import { Kicker } from "./Kicker";

export const OutieKicker = styled(Kicker)`
  background-color: ${theme => theme.main};
  padding: 8px 8px 16px;
  position: absolute;
  bottom: 100%;
`;
