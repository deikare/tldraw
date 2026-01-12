import { getAssetUrlsByMetaUrl } from '@tldraw/assets/urls'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import {
	DefaultErrorFallback,
	ErrorBoundary,
	setDefaultEditorAssetUrls,
	setDefaultUiAssetUrls,
} from 'tldraw'
import { examples } from './examples'
import WhiteboardRoute from './WhiteboardRoute'

const ENABLE_STRICT_MODE = false

// we use secret internal `setDefaultAssetUrls` functions to set these at the
// top-level so assets don't need to be passed down in every single example.
const assetUrls = getAssetUrlsByMetaUrl()
// eslint-disable-next-line local/no-at-internal
setDefaultEditorAssetUrls(assetUrls)
// eslint-disable-next-line local/no-at-internal
setDefaultUiAssetUrls(assetUrls)
const gettingStartedExamples = examples.find((e) => e.id === 'Getting started')
if (!gettingStartedExamples) throw new Error('Could not find getting started examples')
const basicExample = gettingStartedExamples.value.find((e) => e.title === 'Tldraw component')
if (!basicExample) throw new Error('Could not find initial example')

const router = createBrowserRouter([
	{
		path: '*',
		lazy: async () => ({ element: <div>404</div> }),
	},
	{
		path: '/:id',
		element: <WhiteboardRoute />,
	},
])

document.addEventListener('DOMContentLoaded', () => {
	const rootElement = document.getElementById('root')!
	const root = createRoot(rootElement!)
	const main = (
		<ErrorBoundary
			fallback={(error) => <DefaultErrorFallback error={error} />}
			onError={(error) => console.error(error)}
		>
			<HelmetProvider>
				<RootMeta />
				<RouterProvider router={router} />
			</HelmetProvider>
		</ErrorBoundary>
	)
	root.render(ENABLE_STRICT_MODE ? <StrictMode>{main}</StrictMode> : main)
})

function RootMeta() {
	return (
		<Helmet>
			<title>tldraw examples</title>
			<meta
				name="keywords"
				content="tldraw, examples, whiteboard, react, collaborative whiteboard, online drawing, team collboration, react, library"
			/>
			<meta
				name="description"
				content="Examples for using tldraw - a library for building infinite canvases with React. "
			/>
		</Helmet>
	)
}
