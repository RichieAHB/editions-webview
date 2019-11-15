import React from "react";
import { Article } from "./elements/Article";
import { ArticleType, articleTypes, exampleArticle } from "./model/Article";
import { Pillar, pillars } from "./model/Pillar";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { getTheme } from "./helpers";
import { render } from "react-dom";

const GlobalStyle = createGlobalStyle`
  *, :before, :after {
    box-sizing: border-box;
  }

  html,
  body {
    font-family: "GH Guardian Headline";
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
  }
`;

const logDebug = <T extends any>(arg: T): T => (console.log(arg), arg);

const root = document.getElementById("root");
if (!root) throw new Error("Can't find root element");

const layout = (type: ArticleType, pillar: Pillar) =>
  render(
    <>
      <GlobalStyle />
      <ThemeProvider theme={logDebug(getTheme(pillar))}>
        <Article article={{ ...exampleArticle, type }} pillar={pillar} />
      </ThemeProvider>
    </>,
    root
  );

const getArticleType = (): ArticleType => {
  const type = window.localStorage.getItem("articleType");
  if (!type || !articleTypes.includes(type as any)) return articleTypes[0];
  return type as ArticleType;
};

const getPillar = (): Pillar => {
  const pillar = window.localStorage.getItem("pillar");
  if (!pillar) return pillars[0];
  return pillar as Pillar;
};

layout(getArticleType(), getPillar());

const buttonContainer = document.getElementById("button-container");
if (!buttonContainer) throw new Error("Can't find button container");

window.addEventListener("scroll", () => {
  window.localStorage.setItem("scrollPos", window.scrollY.toString());
});

articleTypes.forEach(type => {
  const button = document.createElement("button");
  button.innerHTML = type;
  button.addEventListener("click", e => {
    if (!e.target) return;
    layout(type, getPillar());
    window.localStorage.setItem("articleType", type);
  });
  buttonContainer.appendChild(button);
});

pillars.forEach(name => {
  const button = document.createElement("button");
  button.innerHTML = name;
  button.addEventListener("click", e => {
    if (!e.target) return;
    layout(getArticleType(), name);
    window.localStorage.setItem("pillar", name);
  });
  buttonContainer.appendChild(button);
});

window.addEventListener("load", () => {
  window.scrollTo({
    top: parseInt(window.localStorage.getItem("scrollPos") || "0", 10)
  });
});
