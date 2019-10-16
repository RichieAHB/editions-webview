import { TrailImage } from "../elements/TrailImage";
import { Byline } from "../elements/Byline";
import { Standfirst } from "../elements/Standfirst";
import { Multiline } from "../elements/Multiline";
import { Headline } from "../elements/Headline";
import { div, fragment } from "../helpers";
import { styled } from "../styles";
import { Kicker } from "../elements/Kicker";
import { LineContainer } from "../elements/LineContainer";
import { Article } from "../model/Article";
import { KickerPositioner } from "../elements/KickerPositioner";
import { FillToLine } from "../elements/FillToLine";

const TopWrapper = styled(div)`
  background-color: #333;
  position: relative;
  border-top: 1px solid #fff;
`;

const ObitHeadline = styled(Headline)`
  color: #fff;
`;

const ObitStandfirst = styled(Standfirst)`
  color: #fff;
`;

const ObitByline = styled(Byline)`
  color: #333;
`;

const ObitKicker = styled(Kicker)`
  background-color: #333;
  color: #fff;
  margin-bottom: 1px;
  padding: 8px 8px 16px;
  position: absolute;
  bottom: 100%;
`;

const ObitHeader = (article: Article) =>
  fragment(
    TrailImage({ ...article.trailImage, immersive: true }),
    TopWrapper(
      LineContainer(
        KickerPositioner(ObitKicker(article.kicker)),
        ObitHeadline(article.headline),
        ObitStandfirst(article.standfirst)
      )
    ),
    LineContainer(
      FillToLine(Multiline({ color: "#333" })),
      ObitByline(article.byline),
      FillToLine(Multiline({ color: "#dcdcdc", count: 1 }))
    )
  );

export { ObitHeader };
