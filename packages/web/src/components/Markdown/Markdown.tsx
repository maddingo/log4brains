import React, { useEffect, useMemo } from "react";
import { compiler as mdCompiler } from "markdown-to-jsx";
import { useRouter } from "next/router";
import hljs from "highlight.js";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Typography,
  Link as MuiLink,
  TypographyProps
} from "@material-ui/core";
import { CustomTheme } from "../../mui";
import { AdrLink } from "./components";
import { MarkdownHeading } from "../MarkdownHeading";
import { slugify } from "../../lib/slugify";

const useStyles = makeStyles((theme: CustomTheme) =>
  createStyles({
    code: {
      backgroundColor: "#F8F8F8",
      borderRadius: theme.shape.borderRadius,
      padding: 3
    },
    listItem: {}
  })
);

function Li(props: TypographyProps) {
  const classes = useStyles();
  return (
    <li className={classes.listItem}>
      <Typography component="span" {...props} />
    </li>
  );
}

function Code(props: { children: React.ReactNode }) {
  const classes = useStyles();
  const { children } = props;
  return <code className={classes.code}>{children}</code>;
}

type ImageProps = {
  src: string;
  alt: string;
  nextBasePath: string;
};

function Image(props: ImageProps) {
  const { alt, nextBasePath } = props;
  let { src } = props;

  // Preprends nextBasePath to l4b-static assets (useful for `index.md`'s adr-workflow.png image, for example)
  if (src.startsWith("/l4b-static/")) {
    src = nextBasePath + src;
  }

  return <img src={src} alt={alt} />;
}

type LocalImageProps = {
  pathFromCwd: string;
  alt: string;
  nextBasePath: string;
};

function LocalImage(props: LocalImageProps) {
  const { pathFromCwd, alt, nextBasePath } = props;
  const rewritenPath = `${nextBasePath}/static/l4b-local-images/${pathFromCwd.replaceAll(
    "/",
    "-"
  )}`;
  return <img src={rewritenPath} alt={alt} />;
}

function isReactElementWithChildren(
  obj: JSX.Element
): obj is React.ReactElement<{ children: React.ReactElement }> {
  return "children" in obj.props; // TODO/WIP: improve tests here
}

type MarkdownProps = {
  children: string;
  onCompiled?: (content: React.ReactElement) => void;
};

export function Markdown({ children, onCompiled }: MarkdownProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  const router = useRouter();

  const renderedMarkdown = useMemo(() => {
    const options = {
      overrides: {
        h1: {
          component: Typography,
          props: { variant: "h3", component: "h1", gutterBottom: true }
        },
        h2: {
          component: MarkdownHeading,
          props: { variant: "h2" }
        },
        h3: {
          component: MarkdownHeading,
          props: { variant: "h3" }
        },
        h4: {
          component: MarkdownHeading,
          props: { variant: "h4" }
        },
        p: { component: Typography, props: { paragraph: true } },
        a: { component: MuiLink },
        li: { component: Li },
        AdrLink: { component: AdrLink },
        code: { component: Code },
        img: { component: Image, props: { nextBasePath: router.basePath } },
        LocalImage: {
          component: LocalImage,
          props: { nextBasePath: router.basePath }
        }
      },
      slugify
    };
    return mdCompiler(children, options);
  }, [children, router.basePath]);

  useEffect(() => {
    if (onCompiled && isReactElementWithChildren(renderedMarkdown)) {
      onCompiled(renderedMarkdown.props.children);
    }
  }, [children, renderedMarkdown, onCompiled]);

  useEffect(() => {
    if (isReactElementWithChildren(renderedMarkdown)) {
      rootRef.current
        ?.querySelectorAll<HTMLElement>("pre code")
        .forEach((block) => {
          hljs.highlightBlock(block);
        });
    }
  }, [children, renderedMarkdown]);

  return <div ref={rootRef}>{renderedMarkdown}</div>;
}
