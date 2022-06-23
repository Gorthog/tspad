import * as esbuild from "esbuild-wasm";

export const unpkPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /(^index\.ts$)/ }, () => {
        return { path: "index.ts", namespace: "a" };
      });

      build.onResolve(
        { filter: /^\.+\// },
        (args: { path: string; resolveDir: string }) => {
          return {
            namespace: "a",
            path: new URL(
              args.path,
              "https://unpkg.com" + args.resolveDir + "/"
            ).href,
          };
        }
      );

      build.onResolve({ filter: /.*/ }, async (args: esbuild.OnResolveArgs) => {
        return {
          path: `https://unpkg.com/${args.path}`,
          namespace: "a",
        };
      });
    },
  };
};
