import { img } from "../helpers";
import { styled } from "../styles";

const cutout = styled(img)`
  display: block;
  width: 200px;
  height: auto;
`;

const Cutout = ({ src }: { src?: string }) =>
  cutout ? cutout.attrs({ src })() : "";

export { Cutout };
