import * as esbuild from "esbuild-wasm";
import { fetchPlugin } from "./plugins/fetch-plugin";
import { unpkPathPlugin } from "./plugins/unpk-path-plugin";

let initialized = false;
let initializing = false;

function waitForInitialization() {
  return new Promise<void>((resolve) => {
    if (initialized) {
      resolve();
    } else {
      setTimeout(() => {
        waitForInitialization().then(resolve);
      }, 100);
    }
  });
}

const bundle = async (code: string) => {
  if (initializing) {
    await waitForInitialization();
  }

  if (!initialized) {
    initializing = true;
    await esbuild.initialize({
      worker: true,
      wasmURL: "https://www.unpkg.com/esbuild-wasm@0.14.42/esbuild.wasm",
    });
    initialized = true;
    initializing = false;
  }

  try {
    const result = await esbuild.build({
      entryPoints: ["index.ts"],
      bundle: true,
      write: false,
      plugins: [unpkPathPlugin(), fetchPlugin(code)],
      define: {
        global: "windows",
      },
      jsxFactory: "_React.createElement",
      jsxFragment: "_React.Fragment",
    });
    return { code: result.outputFiles[0].text };
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else return { error: JSON.stringify(err) };
  }
};

export default bundle;
