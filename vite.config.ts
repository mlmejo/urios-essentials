import { vitePlugin as remix } from "@remix-run/dev";
import { glob } from "glob";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  ssr: {
    noExternal: [
      "@adobe/react-spectrum",
      "@react-spectrum/*",
      "@spectrum-icons/*",
    ].flatMap((spec) => glob.sync(`${spec}`, { cwd: "node_modules/" })),
  },
});
