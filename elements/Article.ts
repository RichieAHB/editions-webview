import { div } from "../helpers";
import { LineContainer } from "./LineContainer";
import { HTML } from "./HTML";
import { InlineImage } from "./InlineImage";
import { Article as TArticle, Element as TElement } from "../model/Article";
import { Header } from "./Header";
import { Pillar } from "../model/Pillar";
import { Pullquote } from "./Pullquote";

const Element = (element: TElement) => {
  switch (element.type) {
    case "html": {
      return HTML(element.html);
    }
    case "image": {
      return InlineImage(element);
    }
    case "pullquote": {
      return Pullquote(element);
    }
    default: {
      return "";
    }
  }
};

export const Article = (article: TArticle, pillar: Pillar) =>
  div(Header(article, pillar), LineContainer(...article.elements.map(Element)));
