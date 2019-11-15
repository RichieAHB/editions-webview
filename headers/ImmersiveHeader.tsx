import React from "react";
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
import styled from "styled-components";

const Outer = styled.div`
  padding-right: 70px;
  position: relative;
`;

const ImmersiveHeadline = styled(Headline)`
  color: ${props => props.theme.main};
  font-weight: 600;
`;

const ImmersiveLineContainer = styled(LineContainer)`
  margin-top: -80px;
`;

const ImmersiveKicker = styled(OutieKicker)`
  background-color: ${props => props.theme.main};
`;

const ImmersiveHeader = ({
  article,
  showKicker = false,
  showBottomLine = false,
  backgroundColor,
  color
}: {
  article: Article;
  showKicker?: boolean;
  showBottomLine?: boolean;
  backgroundColor: string;
  color?: string;
}) => (
  <div style={{ backgroundColor }}>
    <TrailImage {...article.trailImage} immersive />
    <Outer>
      <ImmersiveLineContainer style={{ backgroundColor }}>
        {showKicker && (
          <KickerPositioner>
            <ImmersiveKicker style={{ color }}>
              {article.kicker}
            </ImmersiveKicker>
          </KickerPositioner>
        )}
        <ImmersiveHeadline style={{ color }}>
          {article.headline}
        </ImmersiveHeadline>
        <Standfirst style={{ color }}>{article.standfirst}</Standfirst>
        <Multiline color={color || "#dcdcdc"} />
        <Byline style={{ color }}>{article.byline}</Byline>
        {showBottomLine && <Multiline color="#dcdcdc" count={1} />}
      </ImmersiveLineContainer>
    </Outer>
  </div>
);

export { ImmersiveHeader };
