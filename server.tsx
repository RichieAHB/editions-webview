import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { ServerStyleSheet, ThemeProvider } from "styled-components";
import { App } from "./App";
import { Dev } from "./Dev";
import { getTheme } from "./helpers";
import { exampleArticle } from "./model/Article";

const app = express();

app.get("/", (req, res) => {
  const { pillar, type } = req.query;
  const sheet = new ServerStyleSheet();
  try {
    const html = ReactDOMServer.renderToStaticMarkup(
      sheet.collectStyles(
        <>
          <ThemeProvider theme={getTheme(pillar)}>
            <Dev params={req.query} />
            <App
              article={{ ...exampleArticle, type: type || exampleArticle.type }}
              pillar={pillar || "news"}
            />
          </ThemeProvider>
        </>
      )
    );
    const styleTags = sheet.getStyleTags();
    res.send(`<html><head>${styleTags}</head><body>${html}</body></html>`);
  } catch (error) {
    // handle error
    console.error(error);
  } finally {
    sheet.seal();
  }
});

app.listen(1235, () => {
  console.log("Listening");
});
