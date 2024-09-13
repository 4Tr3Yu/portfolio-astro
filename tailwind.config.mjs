/** @type {import("tailwindcss").Config} */
const colors = require('tailwindcss/colors')
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	darkMode: "class",
	theme: {
		colors: {
			crimson: "#751717",
			amber: colors.amber,
			red: colors.red,
			black: colors.black,
			transparent: "transparent",
		},
		extend: {},
	},
	plugins: [],
}
