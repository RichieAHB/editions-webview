import { Cutout } from "../elements/Cutout";
import { AnalysisByline } from "../elements/AnalysisByline";
import { AnalysisHeadline } from "../elements/AnalysisHeadline";
import { LineContainer } from "../elements/LineContainer";
import { Multiline } from "../elements/Multiline";
import { Pad } from "../elements/Pad";
import { Quote } from "../elements/Quote";
import { Standfirst } from "../elements/Standfirst";
import { TrailImage } from "../elements/TrailImage";
import { div } from "../helpers";
import { styled } from "../styles";
import { Article } from "../model/Article";

const Background = styled(div)`
  background-color: #f6f6f6;
`;

const CutoutContainer = styled(div)`
  display: flex;
  align-items: flex-end;
`;

const AnalysisHeader = (
  article: Article,
  {
    underline = true,
    quote = false
  }: { underline?: boolean; quote?: boolean } = {}
) =>
  Background(
    LineContainer(
      TrailImage(article.trailImage),
      Pad(
        CutoutContainer(
          div(
            AnalysisHeadline({
              title: `${quote ? Quote() : ""}${article.headline}`,
              underline
            }),
            AnalysisByline(article.byline)
          ),
          div(Cutout({ src: article.cutout }))
        ),
        Multiline({ color: "#999" }),
        Standfirst(article.standfirst)
      )
    )
  );

export { AnalysisHeader };
