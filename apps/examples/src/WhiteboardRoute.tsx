import { DefaultDashStyle, DefaultFontStyle, DefaultSizeStyle } from '@tldraw/tlschema'
import { throttle } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
	DefaultSpinner,
	Editor,
	TLUiActionsContextType,
	TLUiEventSource,
	TLUiOverrideHelpers,
	TLUiOverrides,
	Tldraw,
	createTLStore,
	getSnapshot,
	loadSnapshot,
} from 'tldraw'
import 'tldraw/tldraw.css'

type LoadState = { status: 'loading' } | { status: 'ready' } | { status: 'error'; error: string }

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

		const unsubscribe = store.listen(save)

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
				onMount={(editor) => {
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
							editor.setStyleForNextShapes(DefaultSizeStyle, 's') // small
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
