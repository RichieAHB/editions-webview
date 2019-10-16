import { img, figure, figcaption } from "../helpers";
import { styled } from "../styles";

const wrapper = styled(figure)`
  margin: 8px 0;
  float: right;
  width: 100%;

  @media (min-width: 1100px) {
    margin: 0 calc(-50% - 16px) 16px 16px;
  }
`;

const image = styled(img)`
  width: 100%;
`;

const captionText = styled(figcaption)`
  font-size: 12px;
  line-height: 1.4;

  @media (min-width: 1100px) {
    margin-left: calc(50% + 8px);
  }
`;

export const InlineImage = ({
  src,
  caption
}: {
  src: string;
  caption: string;
}) => wrapper(image.attrs({ src })(), captionText(caption));
