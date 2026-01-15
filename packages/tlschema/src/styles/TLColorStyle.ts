import { Expand } from '@tldraw/utils'
import { T } from '@tldraw/validate'
import { StyleProp } from './StyleProp'

/**
 * Array of default color names available in tldraw's color palette.
 * These colors form the basis for the default color style system and are available
 * in both light and dark theme variants.
 *
 * @example
 * ```ts
 * import { defaultColorNames } from '@tldraw/tlschema'
 *
 * // Create a color picker with all default colors
 * const colorOptions = defaultColorNames.map(color => ({
 *   name: color,
 *   value: color
 * }))
 * ```
 *
 * @public
 */
export const defaultColorNames = [
	'black',
	'grey',
	'light-violet',
	'violet',
	'blue',
	'light-blue',
	'yellow',
	'orange',
	'green',
	'light-green',
	'light-red',
	'red',
	'white',
] as const

/**
 * Defines the color variants available for each color in the default theme.
 * Each color has multiple variants for different use cases like fills, strokes,
 * patterns, and UI elements like frames and notes.
 *
 * @example
 * ```ts
 * import { TLDefaultColorThemeColor } from '@tldraw/tlschema'
 *
 * const blueColor: TLDefaultColorThemeColor = {
 *   solid: '#4465e9',
 *   semi: '#dce1f8',
 *   pattern: '#6681ee',
 *   fill: '#4465e9',
 *   // ... other variants
 * }
 * ```
 *
 * @public
 */
export interface TLDefaultColorThemeColor {
	solid: string
	semi: string
	pattern: string
	fill: string // usually same as solid
	linedFill: string // usually slightly lighter than fill
	frameHeadingStroke: string
	frameHeadingFill: string
	frameStroke: string
	frameFill: string
	frameText: string
	noteFill: string
	noteText: string
	highlightSrgb: string
	highlightP3: string
}

/**
 * Complete color theme definition containing all colors and their variants
 * for either light or dark mode. Includes base theme properties and all
 * default colors with their respective color variants.
 *
 * @example
 * ```ts
 * import { TLDefaultColorTheme } from '@tldraw/tlschema'
 *
 * const customTheme: TLDefaultColorTheme = {
 *   id: 'light',
 *   text: '#000000',
 *   background: '#ffffff',
 *   solid: '#fcfffe',
 *   black: { solid: '#000000', semi: '#cccccc', ... },
 *   // ... other colors
 * }
 * ```
 *
 * @public
 */
export type TLDefaultColorTheme = Expand<
	{
		id: 'light' | 'dark'
		text: string
		background: string
		solid: string
	} & Record<(typeof defaultColorNames)[number], TLDefaultColorThemeColor>
>

/**
 * Complete color palette containing both light and dark theme definitions.
 * This object provides the full color system used by tldraw's default themes,
 * including all color variants and theme-specific adjustments.
 *
 * @example
 * ```ts
 * import { DefaultColorThemePalette } from '@tldraw/tlschema'
 *
 * // Get the dark theme colors
 * const darkTheme = DefaultColorThemePalette.darkMode
 * const redColor = darkTheme.red.solid // '#e03131'
 *
 * // Access light theme colors
 * const lightTheme = DefaultColorThemePalette.lightMode
 * const blueColor = lightTheme.blue.fill // '#4465e9'
 * ```
 *
 * @public
 */
export const DefaultColorThemePalette: {
	lightMode: TLDefaultColorTheme
	darkMode: TLDefaultColorTheme
} = {
	lightMode: {
		id: 'light',
		text: '#000000',
		background: '#f9fafb',
		solid: '#fcfffe',
		black: {
			solid: '#1d1d1d',
			fill: '#1d1d1d',
			linedFill: '#363636',
			frameHeadingStroke: '#717171',
			frameHeadingFill: '#ffffff',
			frameStroke: '#717171',
			frameFill: '#ffffff',
			frameText: '#000000',
			noteFill: '#FCE19C',
			noteText: '#000000',
			semi: '#e8e8e8',
			pattern: '#494949',
			highlightSrgb: '#fddd00',
			highlightP3: 'color(display-p3 0.972 0.8205 0.05)',
		},
		blue: {
			solid: '#4465e9',
			fill: '#4465e9',
			linedFill: '#6580ec',
			frameHeadingStroke: '#6681ec',
			frameHeadingFill: '#f9fafe',
			frameStroke: '#6681ec',
			frameFill: '#f9fafe',
			frameText: '#000000',
			noteFill: '#8AA3FF',
			noteText: '#000000',
			semi: '#dce1f8',
			pattern: '#6681ee',
			highlightSrgb: '#10acff',
			highlightP3: 'color(display-p3 0.308 0.6632 0.9996)',
		},
		green: {
			solid: '#099268',
			fill: '#099268',
			linedFill: '#0bad7c',
			frameHeadingStroke: '#37a684',
			frameHeadingFill: '#f8fcfa',
			frameStroke: '#37a684',
			frameFill: '#f8fcfa',
			frameText: '#000000',
			noteFill: '#6FC896',
			noteText: '#000000',
			semi: '#d3e9e3',
			pattern: '#39a785',
			highlightSrgb: '#00ffc8',
			highlightP3: 'color(display-p3 0.2536 0.984 0.7981)',
		},
		grey: {
			solid: '#9fa8b2',
			fill: '#9fa8b2',
			linedFill: '#bbc1c9',
			frameHeadingStroke: '#aaaaab',
			frameHeadingFill: '#fbfcfc',
			frameStroke: '#aaaaab',
			frameFill: '#fcfcfd',
			frameText: '#000000',
			noteFill: '#C0CAD3',
			noteText: '#000000',
			semi: '#eceef0',
			pattern: '#bcc3c9',
			highlightSrgb: '#cbe7f1',
			highlightP3: 'color(display-p3 0.8163 0.9023 0.9416)',
		},
		'light-blue': {
			solid: '#4ba1f1',
			fill: '#4ba1f1',
			linedFill: '#7abaf5',
			frameHeadingStroke: '#6cb2f3',
			frameHeadingFill: '#f8fbfe',
			frameStroke: '#6cb2f3',
			frameFill: '#fafcff',
			frameText: '#000000',
			noteFill: '#9BC4FD',
			noteText: '#000000',
			semi: '#ddedfa',
			pattern: '#6fbbf8',
			highlightSrgb: '#00f4ff',
			highlightP3: 'color(display-p3 0.1512 0.9414 0.9996)',
		},
		'light-green': {
			solid: '#4cb05e',
			fill: '#4cb05e',
			linedFill: '#7ec88c',
			frameHeadingStroke: '#6dbe7c',
			frameHeadingFill: '#f8fcf9',
			frameStroke: '#6dbe7c',
			frameFill: '#fafdfa',
			frameText: '#000000',
			noteFill: '#98D08A',
			noteText: '#000000',
			semi: '#dbf0e0',
			pattern: '#65cb78',
			highlightSrgb: '#65f641',
			highlightP3: 'color(display-p3 0.563 0.9495 0.3857)',
		},
		'light-red': {
			solid: '#f87777',
			fill: '#f87777',
			linedFill: '#f99a9a',
			frameHeadingStroke: '#f89090',
			frameHeadingFill: '#fffafa',
			frameStroke: '#f89090',
			frameFill: '#fffbfb',
			frameText: '#000000',
			noteFill: '#F7A5A1',
			noteText: '#000000',
			semi: '#f4dadb',
			pattern: '#fe9e9e',
			highlightSrgb: '#ff7fa3',
			highlightP3: 'color(display-p3 0.9988 0.5301 0.6397)',
		},
		'light-violet': {
			solid: '#e085f4',
			fill: '#e085f4',
			linedFill: '#e9abf7',
			frameHeadingStroke: '#e59bf5',
			frameHeadingFill: '#fefaff',
			frameStroke: '#e59bf5',
			frameFill: '#fefbff',
			frameText: '#000000',
			noteFill: '#DFB0F9',
			noteText: '#000000',
			semi: '#f5eafa',
			pattern: '#e9acf8',
			highlightSrgb: '#ff88ff',
			highlightP3: 'color(display-p3 0.9676 0.5652 0.9999)',
		},
		orange: {
			solid: '#e16919',
			fill: '#e16919',
			linedFill: '#ea8643',
			frameHeadingStroke: '#e68544',
			frameHeadingFill: '#fef9f6',
			frameStroke: '#e68544',
			frameFill: '#fef9f6',
			frameText: '#000000',
			noteFill: '#FAA475',
			noteText: '#000000',
			semi: '#f8e2d4',
			pattern: '#f78438',
			highlightSrgb: '#ffa500',
			highlightP3: 'color(display-p3 0.9988 0.6905 0.266)',
		},
		red: {
			solid: '#e03131',
			fill: '#e03131',
			linedFill: '#e75f5f',
			frameHeadingStroke: '#e55757',
			frameHeadingFill: '#fef7f7',
			frameStroke: '#e55757',
			frameFill: '#fef9f9',
			frameText: '#000000',
			noteFill: '#FC8282',
			noteText: '#000000',
			semi: '#f4dadb',
			pattern: '#e55959',
			highlightSrgb: '#ff636e',
			highlightP3: 'color(display-p3 0.9992 0.4376 0.45)',
		},
		violet: {
			solid: '#ae3ec9',
			fill: '#ae3ec9',
			linedFill: '#be68d4',
			frameHeadingStroke: '#bc62d3',
			frameHeadingFill: '#fcf7fd',
			frameStroke: '#bc62d3',
			frameFill: '#fdf9fd',
			frameText: '#000000',
			noteFill: '#DB91FD',
			noteText: '#000000',
			semi: '#ecdcf2',
			pattern: '#bd63d3',
			highlightSrgb: '#c77cff',
			highlightP3: 'color(display-p3 0.7469 0.5089 0.9995)',
		},
		yellow: {
			solid: '#f1ac4b',
			fill: '#f1ac4b',
			linedFill: '#f5c27a',
			frameHeadingStroke: '#f3bb6c',
			frameHeadingFill: '#fefcf8',
			frameStroke: '#f3bb6c',
			frameFill: '#fffdfa',
			frameText: '#000000',
			noteFill: '#FED49A',
			noteText: '#000000',
			semi: '#f9f0e6',
			pattern: '#fecb92',
			highlightSrgb: '#fddd00',
			highlightP3: 'color(display-p3 0.972 0.8705 0.05)',
		},
		white: {
			solid: '#FFFFFF',
			fill: '#FFFFFF',
			linedFill: '#ffffff',
			semi: '#f5f5f5',
			pattern: '#f9f9f9',
			frameHeadingStroke: '#7d7d7d',
			frameHeadingFill: '#ffffff',
			frameStroke: '#7d7d7d',
			frameFill: '#ffffff',
			frameText: '#000000',
			noteFill: '#FFFFFF',
			noteText: '#000000',
			highlightSrgb: '#ffffff',
			highlightP3: 'color(display-p3 1 1 1)',
		},
	},
	darkMode: {
		id: 'dark',
		text: '#ffffff',
		background: 'hsl(222, 18%, 8%)',
		solid: '#010403',

		black: {
			solid: '#f2f2f2',
			fill: '#f2f2f2',
			linedFill: '#ffffff',

			frameHeadingStroke: 'hsl(215, 15%, 22%)',
			frameHeadingFill: 'hsl(215, 18%, 14%)',

			frameStroke: 'hsl(215, 15%, 22%)',
			frameFill: 'hsl(222, 18%, 8%)',

			frameText: '#ffffff',

			noteFill: 'hsl(215, 18%, 14%)',
			noteText: '#ffffff',

			semi: 'hsl(215, 20%, 18%)',
			pattern: '#a0aec0',

			highlightSrgb: '#ffc107',
			highlightP3: 'color(display-p3 0.8078 0.7225 0.0312)',
		},

		blue: {
			solid: '#3b82f6',
			fill: '#3b82f6',
			linedFill: '#2563eb',

			frameHeadingStroke: '#1e40af',
			frameHeadingFill: '#0f172a',

			frameStroke: '#1e40af',
			frameFill: '#0a1020',

			frameText: '#ffffff',

			noteFill: '#1d4ed8',
			noteText: '#ffffff',

			semi: '#1a2544',
			pattern: '#60a5fa',

			highlightSrgb: '#1d4ed8',
			highlightP3: 'color(display-p3 0.11 0.31 0.85)',
		},

		green: {
			solid: '#22c55e',
			fill: '#22c55e',
			linedFill: '#16a34a',

			frameHeadingStroke: '#14532d',
			frameHeadingFill: '#0a1f14',

			frameStroke: '#14532d',
			frameFill: '#07160f',

			frameText: '#ffffff',

			noteFill: '#15803d',
			noteText: '#ffffff',

			semi: '#153827',
			pattern: '#4ade80',

			highlightSrgb: '#00ff88',
			highlightP3: 'color(display-p3 0.0 1.0 0.5)',
		},

		grey: {
			solid: '#94a3b8',
			fill: '#94a3b8',
			linedFill: '#64748b',

			frameHeadingStroke: '#475569',
			frameHeadingFill: '#0f172a',

			frameStroke: '#475569',
			frameFill: '#0a1020',

			frameText: '#ffffff',

			noteFill: '#475569',
			noteText: '#ffffff',

			semi: '#1f2a38',
			pattern: '#cbd5f5',

			highlightSrgb: '#cbd5f5',
			highlightP3: 'color(display-p3 0.79 0.84 0.96)',
		},

		'light-blue': {
			solid: '#00bcd4',
			fill: '#00bcd4',
			linedFill: '#00acc1',

			frameHeadingStroke: '#0e7490',
			frameHeadingFill: '#0a1f27',

			frameStroke: '#0e7490',
			frameFill: '#06161d',

			frameText: '#ffffff',

			noteFill: '#164e63',
			noteText: '#ffffff',

			semi: '#0f2a33',
			pattern: '#3aaec4',

			highlightSrgb: '#00e5ff',
			highlightP3: 'color(display-p3 0.0 0.9 1.0)',
		},

		'light-green': {
			solid: '#4ade80',
			fill: '#4ade80',
			linedFill: '#22c55e',

			frameHeadingStroke: '#166534',
			frameHeadingFill: '#0a1f14',

			frameStroke: '#166534',
			frameFill: '#07160f',

			frameText: '#ffffff',

			noteFill: '#16a34a',
			noteText: '#ffffff',

			semi: '#153827',
			pattern: '#86efac',

			highlightSrgb: '#00ff66',
			highlightP3: 'color(display-p3 0.0 1.0 0.4)',
		},

		'light-red': {
			solid: '#ff6b6b',
			fill: '#ff6b6b',
			linedFill: '#fa5252',

			frameHeadingStroke: '#7f1d1d',
			frameHeadingFill: '#1f0b0b',

			frameStroke: '#7f1d1d',
			frameFill: '#120606',

			frameText: '#ffffff',

			noteFill: '#b91c1c',
			noteText: '#ffffff',

			semi: '#3f2323',
			pattern: '#ffa8a8',

			highlightSrgb: '#ff0044',
			highlightP3: 'color(display-p3 1.0 0.0 0.27)',
		},

		'light-violet': {
			solid: '#e879f9',
			fill: '#e879f9',
			linedFill: '#d946ef',

			frameHeadingStroke: '#6b21a8',
			frameHeadingFill: '#1a0b27',

			frameStroke: '#6b21a8',
			frameFill: '#12061c',

			frameText: '#ffffff',

			noteFill: '#a21caf',
			noteText: '#ffffff',

			semi: '#3b2345',
			pattern: '#f0abfc',

			highlightSrgb: '#d400ff',
			highlightP3: 'color(display-p3 0.83 0.0 1.0)',
		},

		orange: {
			solid: '#fb923c',
			fill: '#fb923c',
			linedFill: '#f97316',

			frameHeadingStroke: '#9a3412',
			frameHeadingFill: '#24100a',

			frameStroke: '#9a3412',
			frameFill: '#160904',

			frameText: '#ffffff',

			noteFill: '#c2410c',
			noteText: '#ffffff',

			semi: '#3f2a20',
			pattern: '#fdba74',

			highlightSrgb: '#ff7a00',
			highlightP3: 'color(display-p3 1.0 0.48 0.0)',
		},

		red: {
			solid: '#ef4444',
			fill: '#ef4444',
			linedFill: '#dc2626',

			frameHeadingStroke: '#7f1d1d',
			frameHeadingFill: '#1f0b0b',

			frameStroke: '#7f1d1d',
			frameFill: '#120606',

			frameText: '#ffffff',

			noteFill: '#b91c1c',
			noteText: '#ffffff',

			semi: '#3f2323',
			pattern: '#f87171',

			highlightSrgb: '#ff0033',
			highlightP3: 'color(display-p3 1.0 0.0 0.2)',
		},

		violet: {
			solid: '#a855f7',
			fill: '#a855f7',
			linedFill: '#9333ea',

			frameHeadingStroke: '#581c87',
			frameHeadingFill: '#1a0927',

			frameStroke: '#581c87',
			frameFill: '#11051a',

			frameText: '#ffffff',

			noteFill: '#7e22ce',
			noteText: '#ffffff',

			semi: '#33224a',
			pattern: '#c084fc',

			highlightSrgb: '#9b00ff',
			highlightP3: 'color(display-p3 0.6 0.0 1.0)',
		},

		yellow: {
			solid: '#facc15',
			fill: '#facc15',
			linedFill: '#eab308',

			frameHeadingStroke: '#854d0e',
			frameHeadingFill: '#1f1609',

			frameStroke: '#854d0e',
			frameFill: '#130c05',

			frameText: '#ffffff',

			noteFill: '#ca8a04',
			noteText: '#ffffff',

			semi: '#3b3320',
			pattern: '#fde68a',

			highlightSrgb: '#ffd700',
			highlightP3: 'color(display-p3 1.0 0.85 0.0)',
		},

		white: {
			solid: '#f3f3f3',
			fill: '#f3f3f3',
			linedFill: '#ffffff',

			frameHeadingStroke: '#ffffff',
			frameHeadingFill: '#ffffff',

			frameStroke: '#ffffff',
			frameFill: '#ffffff',

			frameText: '#000000',

			noteFill: '#eaeaea',
			noteText: '#1d1d1d',

			semi: '#f5f5f5',
			pattern: '#f9f9f9',

			highlightSrgb: '#ffffff',
			highlightP3: 'color(display-p3 1 1 1)',
		},
	},
}

/**
 * Returns the appropriate default color theme based on the dark mode preference.
 *
 * @param opts - Configuration options
 *   - isDarkMode - Whether to return the dark theme (true) or light theme (false)
 * @returns The corresponding TLDefaultColorTheme (light or dark)
 *
 * @example
 * ```ts
 * import { getDefaultColorTheme } from '@tldraw/tlschema'
 *
 * // Get light theme
 * const lightTheme = getDefaultColorTheme({ isDarkMode: false })
 *
 * // Get dark theme
 * const darkTheme = getDefaultColorTheme({ isDarkMode: true })
 *
 * // Use with editor
 * const theme = getDefaultColorTheme({ isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches })
 * ```
 *
 * @public
 */
export function getDefaultColorTheme(opts: { isDarkMode: boolean }): TLDefaultColorTheme {
	return opts.isDarkMode ? DefaultColorThemePalette.darkMode : DefaultColorThemePalette.lightMode
}

/**
 * Default color style property used by tldraw shapes for their primary color.
 * This style prop allows shapes to use any of the default color names and
 * automatically saves the last used value for new shapes.
 *
 * @example
 * ```ts
 * import { DefaultColorStyle } from '@tldraw/tlschema'
 *
 * // Use in shape props definition
 * interface MyShapeProps {
 *   color: typeof DefaultColorStyle
 *   // other props...
 * }
 *
 * // Set color on a shape
 * const shape = {
 *   // ... other properties
 *   props: {
 *     color: 'red' as const,
 *     // ... other props
 *   }
 * }
 * ```
 *
 * @public
 */
export const DefaultColorStyle = StyleProp.defineEnum('tldraw:color', {
	defaultValue: 'black',
	values: defaultColorNames,
})

/**
 * Default label color style property used for text labels on shapes.
 * This is separate from the main color style to allow different colors
 * for shape fills/strokes versus their text labels.
 *
 * @example
 * ```ts
 * import { DefaultLabelColorStyle } from '@tldraw/tlschema'
 *
 * // Use in shape props definition
 * interface MyShapeProps {
 *   labelColor: typeof DefaultLabelColorStyle
 *   // other props...
 * }
 *
 * // Create a shape with different fill and label colors
 * const shape = {
 *   // ... other properties
 *   props: {
 *     color: 'blue' as const,
 *     labelColor: 'white' as const,
 *     // ... other props
 *   }
 * }
 * ```
 *
 * @public
 */
export const DefaultLabelColorStyle = StyleProp.defineEnum('tldraw:labelColor', {
	defaultValue: 'black',
	values: defaultColorNames,
})

/**
 * Type representing a default color style value.
 * This is a union type of all available default color names.
 *
 * @example
 * ```ts
 * import { TLDefaultColorStyle } from '@tldraw/tlschema'
 *
 * // Valid color values
 * const redColor: TLDefaultColorStyle = 'red'
 * const blueColor: TLDefaultColorStyle = 'blue'
 *
 * // Type guard usage
 * function isValidColor(color: string): color is TLDefaultColorStyle {
 *   return ['black', 'red', 'blue'].includes(color as TLDefaultColorStyle)
 * }
 * ```
 *
 * @public
 */
export type TLDefaultColorStyle = T.TypeOf<typeof DefaultColorStyle>

const defaultColorNamesSet = new Set(defaultColorNames)

/**
 * Type guard to check if a color value is one of the default theme colors.
 * Useful for determining if a color can be looked up in the theme palette.
 *
 * @param color - The color value to check
 * @returns True if the color is a default theme color, false otherwise
 *
 * @example
 * ```ts
 * import { isDefaultThemeColor, TLDefaultColorStyle } from '@tldraw/tlschema'
 *
 * const color: TLDefaultColorStyle = 'red'
 *
 * if (isDefaultThemeColor(color)) {
 *   // color is guaranteed to be a default theme color
 *   console.log(`${color} is a default theme color`)
 * } else {
 *   // color might be a custom hex value or other format
 *   console.log(`${color} is a custom color`)
 * }
 * ```
 *
 * @public
 */
export function isDefaultThemeColor(
	color: TLDefaultColorStyle
): color is (typeof defaultColorNames)[number] {
	return defaultColorNamesSet.has(color as (typeof defaultColorNames)[number])
}

/**
 * Resolves a color style value to its actual CSS color string for a given theme and variant.
 * If the color is not a default theme color, returns the color value as-is.
 *
 * @param theme - The color theme to use for resolution
 * @param color - The color style value to resolve
 * @param variant - Which variant of the color to return (solid, fill, pattern, etc.)
 * @returns The CSS color string for the specified color and variant
 *
 * @example
 * ```ts
 * import { getColorValue, getDefaultColorTheme } from '@tldraw/tlschema'
 *
 * const theme = getDefaultColorTheme({ isDarkMode: false })
 *
 * // Get the solid variant of red
 * const redSolid = getColorValue(theme, 'red', 'solid') // '#e03131'
 *
 * // Get the fill variant of blue
 * const blueFill = getColorValue(theme, 'blue', 'fill') // '#4465e9'
 *
 * // Custom color passes through unchanged
 * const customColor = getColorValue(theme, '#ff0000', 'solid') // '#ff0000'
 * ```
 *
 * @public
 */
export function getColorValue(
	theme: TLDefaultColorTheme,
	color: TLDefaultColorStyle,
	variant: keyof TLDefaultColorThemeColor
): string {
	if (!isDefaultThemeColor(color)) {
		return color
	}

	return theme[color][variant]
}
