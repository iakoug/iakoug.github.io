import React, { createRef, useLayoutEffect } from "react";

import { useTheme } from "@/hooks";

const src = "https://giscus.app/client.js";
const giscusSelector = "iframe.giscus-frame";

const GiscusComments: React.FC = () => {
  const containerRef = createRef();

  const [{ mode }] = useTheme();
  const themeMode = mode === "dark" ? "dark" : "light";

  useLayoutEffect(() => {
    const createGiscusEl = () => {
      const giscusScript = document.createElement("script");

      const attributes = {
        src,
        "data-repo": "iakoug/iakoug.github.io",
        "data-repo-id": "MDEwOlJlcG9zaXRvcnkxNzE4NTA2ODY=",
        "data-category": "Q&A",
        "data-category-id": "DIC_kwDOCj47vs4Cb6Ev",
        "data-mapping": "pathname",
        "data-strict": "0",
        "data-reactions-enabled": "1",
        "data-emit-metadata": "0",
        "data-input-position": "bottom",
        "data-theme": themeMode,
        "data-lang": "en",
        crossorigin: "anonymous",
        async: "true",
      };

      Object.entries(attributes).forEach(([key, value]) => {
        giscusScript.setAttribute(key, value);
      });

      if (containerRef.current) {
        containerRef.current.appendChild(giscusScript);
      }
    };

    const giscusEl = containerRef.current.querySelector(giscusSelector);
    const postThemeMessage = () => {
      const message = {
        setConfig: {
          theme: themeMode,
        },
      };
      giscusEl.contentWindow.postMessage(
        { giscus: message },
        "https://giscus.app",
      );
    };

    if (giscusEl) {
      postThemeMessage();
    } else {
      createGiscusEl();
    }
  }, [themeMode]);

  return <div ref={containerRef} style={{ marginBottom: 48 }} />;
};

GiscusComments.displayName = "GiscusComments";

export default GiscusComments;
