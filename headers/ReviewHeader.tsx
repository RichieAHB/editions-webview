import React from "react";
import styled from "styled-components";
import { BorderedKicker } from "../elements/BorderedKicker";
import { Byline } from "../elements/Byline";
import { FillToLine } from "../elements/FillToLine";
import { Headline } from "../elements/Headline";
import { LineContainer } from "../elements/LineContainer";
import { Multiline } from "../elements/Multiline";
import { Standfirst } from "../elements/Standfirst";
import { Stars } from "../elements/Stars";
import { TrailImage } from "../elements/TrailImage";
import { Article } from "../model/Article";

const Background = styled.div`
  background: ${props => props.theme.faded};
`;

const TrailImageContainer = styled.div`
  position: relative;
`;

const StarContainer = styled.div`
  bottom: 0;
  position: absolute;
`;

const ReviewKicker = styled(BorderedKicker)`
  color: ${props => props.theme.dark};
  font-weight: 600;
`;

const ReviewHeadline = styled(Headline)`
  color: ${props => props.theme.dark};
  font-weight: 600;
`;

const ReviewStandfirst = styled(Standfirst)`
  color: ${props => props.theme.dark};
`;

const ReviewByline = styled(Byline)`
  color: ${props => props.theme.dark};
`;

const ReviewHeader = ({ article }: { article: Article }) => (
  <>
    <Background>
      <LineContainer>
        <TrailImageContainer>
          <TrailImage {...article.trailImage}></TrailImage>
          <StarContainer>
            {article.starCount && <Stars count={article.starCount} />}
          </StarContainer>
        </TrailImageContainer>
        <ReviewKicker>{article.kicker}</ReviewKicker>
        <ReviewHeadline>{article.headline}</ReviewHeadline>
        <ReviewStandfirst>{article.standfirst}</ReviewStandfirst>
      </LineContainer>
    </Background>
    <LineContainer>
      <FillToLine>
        <Multiline color="#999" />
      </FillToLine>
      <ReviewByline>{article.byline}</ReviewByline>
      <FillToLine>
        <Multiline color="#dcdcdc" count={1} />
      </FillToLine>
    </LineContainer>
  </>
);

export { ReviewHeader };
