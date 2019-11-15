import React from "react";
import { BorderedKicker } from "../elements/BorderedKicker";
import { Byline } from "../elements/Byline";
import { Headline } from "../elements/Headline";
import { LineContainer } from "../elements/LineContainer";
import { Multiline } from "../elements/Multiline";
import { Standfirst } from "../elements/Standfirst";
import { TrailImage } from "../elements/TrailImage";
import { Article } from "../model/Article";

const ArticleHeader = ({ article }: { article: Article }) => (
  <LineContainer>
    <TrailImage {...article.trailImage} />
    <BorderedKicker>{article.kicker}</BorderedKicker>
    <Headline>{article.headline}</Headline>
    <Standfirst>{article.standfirst}</Standfirst>
    <Multiline color="#999" />
    <Byline>{article.byline}</Byline>
    <Multiline color="#dcdcdc" count={1} />
  </LineContainer>
);

export { ArticleHeader };
