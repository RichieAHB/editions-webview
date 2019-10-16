import { ArticleHeader } from "../headers/ArticleHeader";
import { ObitHeader } from "../headers/ObitHeader";
import { ImmersiveHeader } from "../headers/ImmersiveHeader";
import { AnalysisHeader } from "../headers/AnalysisHeader";
import { ReviewHeader } from "../headers/ReviewHeader";
import { InterviewHeader } from "../headers/InterviewHeader";
import { Article } from "../model/Article";
import { Pillar } from "../model/Pillar";

export const Header = (article: Article, pillar: Pillar) => {
  switch (article.type) {
    case "default": {
      return ArticleHeader(article);
    }
    case "obit": {
      return ObitHeader(article);
    }
    case "longread": {
      return ImmersiveHeader(article, {
        backgroundColor: "#000",
        color: "#fff",
        showBottomLine: false
      });
    }
    case "immersive": {
      return ImmersiveHeader(article, {
        showKicker: false,
        backgroundColor: "#fff"
      });
    }
    case "analysis": {
      return AnalysisHeader(article);
    }
    case "opinion": {
      return AnalysisHeader(article, { underline: false, quote: true });
    }
    case "review": {
      return ReviewHeader(article);
    }
    case "interview": {
      return InterviewHeader(article, { brightBg: pillar === "sport" });
    }
  }
};
