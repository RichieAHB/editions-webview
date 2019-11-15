import React from "react";
import styled from "styled-components";
import { AnalysisByline } from "../elements/AnalysisByline";
import { AnalysisHeadline } from "../elements/AnalysisHeadline";
import { Cutout } from "../elements/Cutout";
import { LineContainer } from "../elements/LineContainer";
import { Multiline } from "../elements/Multiline";
import { Pad } from "../elements/Pad";
import { Quote } from "../elements/Quote";
import { Standfirst } from "../elements/Standfirst";
import { TrailImage } from "../elements/TrailImage";
import { Article } from "../model/Article";

const Background = styled.div`
  background-color: #f6f6f6;
`;

const CutoutContainer = styled.div`
  display: flex;
  align-items: flex-end;
`;

const AnalysisHeader = ({
  article,
  underline = true,
  quote = false
}: {
  article: Article;
  underline?: boolean;
  quote?: boolean;
}) => (
  <Background>
    <LineContainer>
      <TrailImage {...article.trailImage} />
      <Pad>
        <CutoutContainer>
          <div>
            <AnalysisHeadline underline={underline}>
              {quote && <Quote />}
              {article.headline}
            </AnalysisHeadline>
            <AnalysisByline>{article.byline}</AnalysisByline>
          </div>
          <div>
            <Cutout src={article.cutout} />
          </div>
        </CutoutContainer>
        <Multiline color="#999" />
        <Standfirst>{article.byline}</Standfirst>
      </Pad>
    </LineContainer>
  </Background>
);

export { AnalysisHeader };
