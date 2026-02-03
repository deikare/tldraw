import { DefaultDashStyle, DefaultFontStyle, DefaultSizeStyle } from '@tldraw/tlschema'
import { throttle } from 'lodash'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
	approximately,
	createTLStore,
	DefaultSpinner,
	DefaultStylePanel,
	Editor,
	getSnapshot,
	loadSnapshot,
	STROKE_SIZES,
	TLComponents,
	Tldraw,
	TLUiActionsContextType,
	TLUiEventSource,
	TLUiOverrideHelpers,
	TLUiOverrides,
	useEditor,
	useIsDarkMode,
	useValue,
} from 'tldraw'
import 'tldraw/tldraw.css'
import { drawLine } from './examples/custom-grid/CustomGridExample'

type LoadState = { status: 'loading' } | { status: 'ready' } | { status: 'error'; error: string }

STROKE_SIZES.s = 2
STROKE_SIZES.m = 1.35
STROKE_SIZES.l = 3
STROKE_SIZES.xl = 4

const components: TLComponents = {
	// [1]
	StylePanel: null,
	Grid: ({ size, ...camera }) => {
		const editor = useEditor()

		const size2 = 30

		// [2]
		const screenBounds = useValue('screenBounds', () => editor.getViewportScreenBounds(), [])
		const devicePixelRatio = useValue('dpr', () => editor.getInstanceState().devicePixelRatio, [])
		const isDarkMode = useIsDarkMode()

		const canvas = useRef<HTMLCanvasElement>(null)

		useLayoutEffect(() => {
			if (!canvas.current) return
			// [3]
			const canvasW = screenBounds.w * devicePixelRatio
			const canvasH = screenBounds.h * devicePixelRatio
			canvas.current.width = canvasW
			canvas.current.height = canvasH

			const ctx = canvas.current?.getContext('2d')
			if (!ctx) return

			// [4]
			ctx.clearRect(0, 0, canvasW, canvasH)

			// [5]
			const pageViewportBounds = editor.getViewportPageBounds()

			const startPageX = Math.ceil(pageViewportBounds.minX / size2) * size2
			const startPageY = Math.ceil(pageViewportBounds.minY / size2) * size2
			const endPageX = Math.floor(pageViewportBounds.maxX / size2) * size2
			const endPageY = Math.floor(pageViewportBounds.maxY / size2) * size2
			const numRows = Math.round((endPageY - startPageY) / size2)
			const numCols = Math.round((endPageX - startPageX) / size2)

			ctx.strokeStyle = isDarkMode ? '#2a2a2a' : '#BBB'

			// [6]
			for (let row = 0; row <= numRows; row++) {
				const pageY = startPageY + row * size2
				// convert the page-space Y offset into our canvas' coordinate space
				const canvasY = (pageY + camera.y) * camera.z * devicePixelRatio
				const isMajorLine = approximately(pageY % (size2 * 10), 0)
				drawLine(ctx, 0, canvasY, canvasW, canvasY, 1)
			}
			for (let col = 0; col <= numCols; col++) {
				const pageX = startPageX + col * size2
				// convert the page-space X offset into our canvas' coordinate space
				const canvasX = (pageX + camera.x) * camera.z * devicePixelRatio
				const isMajorLine = approximately(pageX % (size2 * 10), 0)
				drawLine(ctx, canvasX, 0, canvasX, canvasH, 1)
			}
		}, [screenBounds, camera, size2, devicePixelRatio, editor, isDarkMode])

		// [7]
		return <canvas className="tl-grid" ref={canvas} />
	},
}

function LeftStyleSidebar({ open }: { open: boolean }) {
	if (!open) return null

	return (
		<div
			style={{
				position: 'absolute',
				top: 48,
				left: 8,
				width: 280,
				background: 'var(--tlui-panel-bg)',
				borderRadius: 8,
				boxShadow: 'var(--tlui-shadow-medium)',
				padding: 8,
				zIndex: 1000,
			}}
		>
			<DefaultStylePanel />
		</div>
	)
}

export function useLeftStylePanelState() {
	return useState(false)
}

export default function WhiteboardRoute() {
	const { id } = useParams<{ id: string }>()
	const store = useMemo(() => createTLStore(), [])
	const editorRef = useRef<Editor | null>(null)
	const snapshotRef = useRef<any>(null)

	const [state, setState] = useState<LoadState>({ status: 'loading' })

	const whiteboardUrl = `http://localhost:3000/whiteboard/${id}`

	/* -------------------------------------------------- */
	/* Load snapshot from server                           */
	/* -------------------------------------------------- */
	useEffect(() => {
		let cancelled = false
		setState({ status: 'loading' })
		snapshotRef.current = null

		const load = async () => {
			try {
				const res = await fetch(whiteboardUrl)

				if (res.status === 404) {
					if (!cancelled) setState({ status: 'ready' })
					return
				}

				if (!res.ok) {
					throw new Error(`Failed to load (${res.status})`)
				}

				const raw = await res.json()
				snapshotRef.current = JSON.parse(raw.snapshot)

				// Editor may already be mounted
				if (editorRef.current) {
					loadSnapshot(editorRef.current.store, snapshotRef.current)
				}

				if (!cancelled) setState({ status: 'ready' })
			} catch (err: any) {
				if (!cancelled) {
					setState({
						status: 'error',
						error: err.message ?? 'Unknown error',
					})
				}
			}
		}

		load()

		return () => {
			cancelled = true
		}
	}, [id, whiteboardUrl])

	/* -------------------------------------------------- */
	/* Save snapshot to server (throttled)                 */
	/* -------------------------------------------------- */
	useEffect(() => {
		const save = throttle(async () => {
			try {
				const snapshot = getSnapshot(store)
				await fetch(whiteboardUrl, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(snapshot),
				})
			} catch (err) {
				console.error('Failed to save whiteboard', err)
			}
		}, 500)

		const unsubscribe = store.listen(save, { scope: 'document' })

		return () => {
			unsubscribe()
			save.cancel()
		}
	}, [store, whiteboardUrl])

	/* -------------------------------------------------- */
	/* UI states                                           */
	/* -------------------------------------------------- */
	if (state.status === 'loading') {
		return (
			<div className="tldraw__editor">
				<DefaultSpinner />
			</div>
		)
	}

	if (state.status === 'error') {
		return (
			<div className="tldraw__editor">
				<h2>Error loading whiteboard</h2>
				<p>{state.error}</p>
			</div>
		)
	}

	/* -------------------------------------------------- */
	/* Editor                                              */
	/* -------------------------------------------------- */

	const uiOverrides: TLUiOverrides = {
		actions(
			editor: Editor,
			actions: TLUiActionsContextType,
			helpers: TLUiOverrideHelpers
		): TLUiActionsContextType {
			actions.nextPage = {
				id: 'next-page',
				label: 'Next page',
				kbd: '.',
				onSelect(source: TLUiEventSource): Promise<void> | void {
					const pages = editor.getPages()
					const current = editor.getCurrentPageId()
					const index = pages.findIndex((p) => p.id === current)
					const next = pages[index + 1]
					if (next) {
						editor.setCurrentPage(next)
					} else editor.createPage({ name: `Strona ${index + 2}` })
				},
			}

			actions.prevPage = {
				id: 'prev-page',
				label: 'Prev page',
				kbd: ',',
				onSelect(source: TLUiEventSource): Promise<void> | void {
					const pages = editor.getPages()
					const current = editor.getCurrentPageId()
					const index = pages.findIndex((p) => p.id === current)
					const next = pages[index - 1]
					if (next) {
						editor.setCurrentPage(next)
					}
				},
			}

			actions.undo = {
				...actions.undo,
				kbd: 'ctrl+z,z',
			}

			actions.pickDraw = {
				id: 'pick-draw',
				label: 'Pick draw',
				kbd: '1',
				onSelect(source: TLUiEventSource): Promise<void> | void {
					editor.setCurrentTool('draw')
				},
			}

			actions.pickText = {
				id: 'pick-text',
				label: 'Pick text',
				kbd: '2',
				onSelect(source: TLUiEventSource): Promise<void> | void {
					editor.setCurrentTool('text')
				},
			}

			actions.pickEraser = {
				id: 'pick-eraser',
				label: 'Pick eraser',
				kbd: '3',
				onSelect(source: TLUiEventSource): Promise<void> | void {
					editor.setCurrentTool('eraser')
				},
			}

			actions.pickSelect = {
				id: 'pick-select',
				label: 'Pick select',
				kbd: '4',
				onSelect(source: TLUiEventSource): Promise<void> | void {
					editor.setCurrentTool('select')
				},
			}

			actions.pickHex = {
				id: 'pick-hex',
				label: 'Pick hex',
				kbd: '5',
				onSelect(source: TLUiEventSource): Promise<void> | void {
					editor.setCurrentTool('geo')
					editor.updateInstanceState({
						stylesForNextShape: {
							'tldraw:geo': 'hexagon',
						},
					})
				},
			}

			actions.pickEllipsis = {
				id: 'pick-ellipsis',
				label: 'Pick ellipsis',
				kbd: '6',
				onSelect(source: TLUiEventSource): Promise<void> | void {
					editor.setCurrentTool('geo')
					editor.updateInstanceState({
						stylesForNextShape: {
							'tldraw:geo': 'ellipse',
						},
					})
				},
			}

			actions.pickHighlight = {
				id: 'pick-highlight',
				label: 'Pick highlight',
				kbd: '8',
				onSelect(source: TLUiEventSource): Promise<void> | void {
					editor.setCurrentTool('highlight')
				},
			}

			actions['toggle-focus-mode'] = {
				...actions['toggle-focus-mode'],
				kbd: actions['toggle-focus-mode'].kbd + ',`',
			}

			return actions
		},
	}

	return (
		<div className="tldraw__editor">
			<Tldraw
				store={store}
				overrides={uiOverrides}
				components={components}
				onMount={(editor) => {
					editor.updateInstanceState({ isGridMode: true })
					editorRef.current = editor
					editor.user.updateUserPreferences({ areKeyboardShortcutsEnabled: true })
					editor.setCurrentTool('draw')
					if (snapshotRef.current) {
						loadSnapshot(editor.store, snapshotRef.current)
					}

					editor.setStyleForNextShapes(DefaultFontStyle, 'sans')

					const applyDefaultsForTool = () => {
						const tool = editor.getCurrentToolId()

						if (
							tool === 'draw' ||
							tool === 'rectangle' ||
							tool === 'line' ||
							tool === 'geo' ||
							tool === 'select'
						) {
							editor.setStyleForNextShapes(DefaultDashStyle, 'solid') // solid
							const chosenSize = editor.getStyleForNextShape(DefaultSizeStyle)
							if (chosenSize === 'l' || chosenSize === 'xl')
								editor.setStyleForNextShapes(DefaultSizeStyle, 's')
						} else if (tool === 'text') {
							editor.setStyleForNextShapes(DefaultSizeStyle, 'm') // medium
						}
					}

					applyDefaultsForTool()
					editor.on('change', applyDefaultsForTool)

					const lockZoom = () => {
						const camera = editor.getCamera()
						if (camera.z !== 1) {
							editor.setCamera({ ...camera, z: 1 })
						}
					}

					// Lock immediately
					lockZoom()

					// Re-lock whenever something changes
					editor.on('change', lockZoom)

					const container = editor.getContainer()

					const handler = (e: PointerEvent) => {
						if (e.pointerType === 'pen') {
							Object.defineProperty(e, 'pointerType', {
								value: 'mouse',
								configurable: true,
							})
						}
					}

					container.addEventListener('pointerdown', handler, true)
					container.addEventListener('pointermove', handler, true)
					container.addEventListener('pointerup', handler, true)

					return () => {
						container.removeEventListener('pointerdown', handler, true)
						container.removeEventListener('pointermove', handler, true)
						container.removeEventListener('pointerup', handler, true)
					}
				}}
			/>
		</div>
	)
}
