import React from "react";
import styled from "styled-components";
import { Byline } from "../elements/Byline";
import { FillToLine } from "../elements/FillToLine";
import { Headline } from "../elements/Headline";
import { Kicker } from "../elements/Kicker";
import { KickerPositioner } from "../elements/KickerPositioner";
import { LineContainer } from "../elements/LineContainer";
import { Multiline } from "../elements/Multiline";
import { Standfirst } from "../elements/Standfirst";
import { TrailImage } from "../elements/TrailImage";
import { Article } from "../model/Article";

const TopWrapper = styled.div`
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

const ObitHeader = ({ article }: { article: Article }) => (
  <>
    <TrailImage {...article.trailImage} immersive />
    <TopWrapper>
      <LineContainer>
        <KickerPositioner>
          <ObitKicker>{article.kicker}</ObitKicker>
          <ObitHeadline>{article.headline}</ObitHeadline>
          <ObitStandfirst>{article.standfirst}</ObitStandfirst>
        </KickerPositioner>
      </LineContainer>
    </TopWrapper>
    <LineContainer>
      <FillToLine>
        <Multiline color="#333" />
      </FillToLine>
      <ObitByline>{article.byline}</ObitByline>
      <FillToLine>
        <Multiline color="#dcdcdc" count={1} />
      </FillToLine>
    </LineContainer>
  </>
);

export { ObitHeader };
