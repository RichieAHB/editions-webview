import { BorderedKicker } from "../elements/BorderedKicker";
import { Byline } from "../elements/Byline";
import { FillToLine } from "../elements/FillToLine";
import { Headline } from "../elements/Headline";
import { LineContainer } from "../elements/LineContainer";
import { Multiline } from "../elements/Multiline";
import { Standfirst } from "../elements/Standfirst";
import { TrailImage } from "../elements/TrailImage";
import { div, fragment } from "../helpers";
import { Article } from "../model/Article";
import { styled } from "../styles";
import { Stars } from "../elements/Stars";

const Background = styled(div)`
  background: ${theme => theme.faded};
`;

const TrailImageContainer = styled(div)`
  position: relative;
`;

const StarContainer = styled(div)`
  bottom: 0;
  position: absolute;
`;

const ReviewKicker = styled(BorderedKicker)`
  color: ${theme => theme.dark};
  font-weight: 600;
`;

const ReviewHeadline = styled(Headline)`
  color: ${theme => theme.dark};
  font-weight: 600;
`;

const ReviewStandfirst = styled(Standfirst)`
  color: ${theme => theme.dark};
`;

const ReviewByline = styled(Byline)`
  color: ${theme => theme.dark};
`;

const ReviewHeader = (article: Article) =>
  fragment(
    Background(
      LineContainer(
        TrailImageContainer(
          TrailImage(article.trailImage),
          StarContainer(
            article.starCount ? Stars({ count: article.starCount }) : ""
          )
        ),

        ReviewKicker(article.kicker),
        ReviewHeadline(article.headline),
        ReviewStandfirst(article.standfirst)
      )
    ),
    LineContainer(
      FillToLine(Multiline({ color: "#999" })),
      ReviewByline(article.byline),
      FillToLine(Multiline({ color: "#dcdcdc", count: 1 }))
    )
  );

export { ReviewHeader };
