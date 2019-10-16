import { BorderedKicker } from "../elements/BorderedKicker";
import { Byline } from "../elements/Byline";
import { Headline } from "../elements/Headline";
import { LineContainer } from "../elements/LineContainer";
import { Multiline } from "../elements/Multiline";
import { Standfirst } from "../elements/Standfirst";
import { TrailImage } from "../elements/TrailImage";
import { Article } from "../model/Article";

const ArticleHeader = (article: Article) =>
  LineContainer(
    TrailImage(article.trailImage),
    BorderedKicker(article.kicker),
    Headline(article.headline),
    Standfirst(article.standfirst),
    Multiline({ color: "#999" }),
    Byline(article.byline),
    Multiline({ color: "#dcdcdc", count: 1 })
  );

export { ArticleHeader };
