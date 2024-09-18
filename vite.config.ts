import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		target: "esnext",
		rollupOptions: {
			input: {
				background: path.resolve(__dirname, "background/index.ts"),
				popup: path.resolve(__dirname, "index.html"),
				redirect: path.resolve(__dirname, "/redirect/index.html"),
			},
			output: {
				entryFileNames: "[name].js",
			},
		},
	},
});
