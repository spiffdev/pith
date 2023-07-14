import swc from "rollup-plugin-swc";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";

const extensions = [".js", ".ts"];
const external = (_) => /node_modules/.test(_) && !/@swc\/helpers/.test(_);
const plugins = (targets) => [
  nodeResolve({
    extensions,
  }),
  replace({
    preventAssignment: true,
    values: {
      "process.env.NODE_ENV": JSON.stringify(
        process.env.ROLLUP_WATCH ? "development" : "production"
      ),
    },
  }),
  swc({
    jsc: {
      parser: {
        syntax: "typescript",
      },
      externalHelpers: false,
    },
    env: {
      targets,
    },
    module: {
      type: "es6",
    },
    sourceMaps: true,
  }),
];

export default process.env.NODE_ENV !== "development"
  ? [
      {
        input: pkg.main,
        external,
        output: {
          file: pkg.publishConfig.module,
          format: "es",
          sourcemap: true,
        },
      },
      {
        input: pkg.main,
        external,
        output: {
          file: pkg.publishConfig.main,
          format: "cjs",
          sourcemap: true,
        },
      },
    ]
  : {
      input: pkg.main,
      plugins: [...plugins(browsersEsm.join(", ")), commonjs()],
      output: {
        file: "./dist/umd.js",
        format: "umd",
        exports: "named",
        name: "pith",
        sourcemap: true,
      },
    };
