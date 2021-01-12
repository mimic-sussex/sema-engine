import resolve from "@rollup/plugin-node-resolve"; // allows us to load third-party modules in node_modules
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs"; // converts CommonJS modules to ES6, which stops them from breaking Rollup
import pkg from "./package.json";
import copy from "rollup-plugin-copy";
// import eslint from "@rollup/plugin-eslint";


export default [
	// browser-friendly UMD build
	{
		input: "src/index.js",
		output: [
			{ file: pkg.module, format: "es" },
			{ file: pkg.main, format: "umd", name: "sema-engine" },
			{
				file: "dist/sema-engine.min.js",
				format: "iife",
				name: "version",
				plugins: [terser()],
			},
		],
		plugins: [
			resolve(), // so Rollup can find `nearley`
			commonjs(), // so Rollup can convert `nearley` to an ES module
			// {
			// 	// debug the Rollup bundling process by injecting a hook in the plugin chain!
			// 	transform(code, id) {
			// 		console.log(id);
			// 		console.log(code);
			// 		// not returning anything, so doesn't affect bundle
			// 	},
			// },
			terser(),
			copy({
				targets: [
					{
						src: "src/engine/maxi-processor.js",
						dest: ["dist", "example"],
					},
					{
						src: "src/engine/maximilian.wasmmodule.js",
						dest: ["dist", "example"],
					},
					{
						src: "src/engine/open303.wasmmodule.js",
						dest: ["dist", "example"],
					},
					{
						// ringbuf is imported by both the Engine (AW node) and maxi-processor (AWP) so needs to be both bundled AND copied!
						src: "src/engine/ringbuf.js",
						dest: ["dist", "example"],
					},
					{
						src: "assets/*",
						dest: "example",
					},
				],
			}),
			// eslint({
			// 	/* your options */
			// }),
		],
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	// {
	// 	input: "src/index.js",
	// 	external: ["nearley"],
	// 	output: [
	// 		{ file: pkg.main, format: "cjs" },
	// 		{ file: pkg.module, format: "es" },
	// 	],
	// },
];
