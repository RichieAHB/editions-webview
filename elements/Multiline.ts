import { div } from "../helpers";
import { styled } from "../styles";

const line = styled(div)`
  border-width: 0;
  border-top-width: 1px;
  margin-bottom: 2px;
  border-style: ${theme => theme.borderStyle}
  width: 100%;
`;

export const Multiline = ({
  color,
  count = 4
}: {
  color: string;
  count?: number;
}) => {
  const l = line.style({ borderColor: color })();
  const lines = Array.from({ length: count }, () => l);
  return div(...lines);
};
