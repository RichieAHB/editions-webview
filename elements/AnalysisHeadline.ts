import { h1 } from "../helpers";
import { styled } from "../styles";

const header = styled(h1)`
  color: #000;
  margin: 16px 0 0;
  line-height: 32px;
  font-size: 30px;
  font-weight: 300;
  text-decoration-color: ${theme => theme.main};
  text-decoration-thickness: 1px;
`;

export const AnalysisHeadline = ({
  title,
  underline
}: {
  title: string;
  underline: boolean;
}) =>
  header.attrs({
    style: {
      textDecorationLine: underline ? "underline" : "none"
    }
  })(title);
