import * as esbuild from 'esbuild';
import sveltePlugin from 'esbuild-svelte';
import sveltePreprocess from 'svelte-preprocess';

let ctx = await esbuild
	.context({
		entryPoints: ['./src/web-components/WebComponent.svelte'],
		outfile: 'dist-js/musicore.js',
		bundle: true,
		minify: true,
		conditions: ['svelte'],
		sourcemap: true,
		plugins: [
			sveltePlugin({
				preprocess: sveltePreprocess({ sourceMap: false, postcss: true }),

				compilerOptions: {
					customElement: true,
					discloseVersion: false,
				},
			}),
		],
		logLevel: 'info',
	})
	.catch(() => process.exit(1));

await ctx.watch();
console.log('watching...');
