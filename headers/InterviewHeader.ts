import { Byline } from "../elements/Byline";
import { FillToLine } from "../elements/FillToLine";
import { Headline } from "../elements/Headline";
import { LineContainer } from "../elements/LineContainer";
import { Multiline } from "../elements/Multiline";
import { OutieKicker } from "../elements/OutieKicker";
import { Standfirst } from "../elements/Standfirst";
import { TrailImage } from "../elements/TrailImage";
import { div, fragment } from "../helpers";
import { Article } from "../model/Article";
import { styled } from "../styles";
import { Quote } from "../elements/Quote";

const Background = styled(div)`
  background: ${theme => theme.faded};
`;

const Popper = styled(div)`
  margin-bottom: 8px;
  margin-left: -8px;
  margin-top: -80px;
  padding-right: 70px;
  position: relative;

  @media (min-width: 900px) {
    margin-left: -24px;
  }
`;

const InterviewKicker = styled(OutieKicker)`
  background-color: ${theme => theme.dark};
  color: white;
  font-size: 20px;
  font-weight: 600;
  padding-bottom: 8px;
`;

const HeadlineWrapper = styled(div)`
  padding: 4px 8px 8px;
`;

const InterviewHeadline = styled(Headline)`
  background-color: black;
  box-shadow: 8px 0 0 0 rgba(0, 0, 0, 1), -8px 0 0 0 rgba(0, 0, 0, 1);
  color: white;
  display: inline;
  font-weight: 400;
  line-height: 1.23;
  padding-bottom: 8px;
  vertical-align: top;
`;

const InterviewStandfirst = styled(Standfirst)`
  color: ${theme => theme.dark};
`;

const StandardByline = styled(Byline)`
  color: ${theme => theme.dark};
`;

const LightByline = styled(Byline)`
  color: ${theme => theme.main};
`;

const InterviewByline = (lighter: boolean) =>
  lighter ? LightByline : StandardByline;

const onlyIf = <T>(condition: boolean, value: T): T | undefined =>
  condition ? value : undefined;

const brightColors = {
  BACKGROUND: "#ffe500",
  TEXT: "#000"
};

const InterviewHeader = (
  article: Article,
  { brightBg = true }: { brightBg?: boolean } = {}
) =>
  fragment(
    Background.style({
      backgroundColor: onlyIf(brightBg, brightColors.BACKGROUND)
    })(
      TrailImage(article.trailImage),
      LineContainer(
        Popper(
          InterviewKicker.style({
            color: onlyIf(brightBg, brightColors.TEXT),
            backgroundColor: onlyIf(brightBg, brightColors.BACKGROUND)
          })("Interview"),
          HeadlineWrapper(
            InterviewHeadline(Quote({ color: "white" }), article.headline)
          )
        ),
        InterviewStandfirst.style({
          color: onlyIf(brightBg, brightColors.TEXT)
        })(article.standfirst)
      )
    ),
    LineContainer(
      FillToLine(Multiline({ color: "#999" })),
      InterviewByline(brightBg)(article.byline),
      FillToLine(Multiline({ color: "#dcdcdc", count: 1 }))
    )
  );

export { InterviewHeader };
