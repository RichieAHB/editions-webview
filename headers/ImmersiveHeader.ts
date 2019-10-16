import { Byline } from "../elements/Byline";
import { Headline } from "../elements/Headline";
import { KickerPositioner } from "../elements/KickerPositioner";
import { LineContainer } from "../elements/LineContainer";
import { Multiline } from "../elements/Multiline";
import { OutieKicker } from "../elements/OutieKicker";
import { Standfirst } from "../elements/Standfirst";
import { TrailImage } from "../elements/TrailImage";
import { div } from "../helpers";
import { Article } from "../model/Article";
import { styled } from "../styles";

const Outer = styled(div)`
  padding-right: 70px;
  position: relative;
`;

const ImmersiveHeadline = styled(Headline)`
  color: ${theme => theme.main};
  font-weight: 600;
`;

const ImmersiveLineContainer = styled(LineContainer)`
  margin-top: -80px;
`;

const ImmersiveKicker = styled(OutieKicker)`
  background-color: ${theme => theme.main};
`;

const ImmersiveHeader = (
  article: Article,
  {
    showKicker = true,
    showBottomLine = true,
    backgroundColor,
    color
  }: {
    showKicker?: boolean;
    showBottomLine?: boolean;
    backgroundColor: string;
    color?: string;
  }
) =>
  div.style({ backgroundColor })(
    TrailImage({ ...article.trailImage, immersive: true }),
    Outer(
      ImmersiveLineContainer.style({ backgroundColor })(
        showKicker
          ? KickerPositioner(ImmersiveKicker.style({ color })(article.kicker))
          : "",
        ImmersiveHeadline.style({ color })(article.headline),
        Standfirst.style({ color })(article.standfirst),
        Multiline({ color: color || "#dcdcdc" }),
        Byline.style({ color })(article.byline),
        showBottomLine ? Multiline({ color: "#dcdcdc", count: 1 }) : ""
      )
    )
  );

export { ImmersiveHeader };
