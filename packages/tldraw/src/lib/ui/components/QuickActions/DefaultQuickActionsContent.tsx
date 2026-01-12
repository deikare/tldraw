import { useEditor, useValue } from '@tldraw/editor'
import {
	useCanRedo,
	useCanUndo,
	useIsInSelectState,
	useUnlockedSelectedShapesCount,
} from '../../hooks/menu-hooks'
import { useReadonly } from '../../hooks/useReadonly'
import { TldrawUiMenuActionItem } from '../primitives/menus/TldrawUiMenuActionItem'

const USE_REDO_GROUP = false
const USE_DELETE_DUPLICATE_GROUP = false

/** @public @react */
export function DefaultQuickActionsContent() {
	const editor = useEditor()

	const isReadonlyMode = useReadonly()

	const isInAcceptableReadonlyState = useValue(
		'should display quick actions',
		() => editor.isInAny('select', 'hand', 'zoom'),
		[editor]
	)

	if (isReadonlyMode && !isInAcceptableReadonlyState) return

	return (
		<>
			{USE_REDO_GROUP && <UndoRedoGroup />}
			{USE_DELETE_DUPLICATE_GROUP && <DeleteDuplicateGroup />}
		</>
	)
}

function DeleteDuplicateGroup() {
	const oneSelected = useUnlockedSelectedShapesCount(1)
	const isInSelectState = useIsInSelectState()
	const selectDependentActionsEnabled = oneSelected && isInSelectState
	return (
		<>
			<TldrawUiMenuActionItem actionId="delete" disabled={!selectDependentActionsEnabled} />
			<TldrawUiMenuActionItem actionId="duplicate" disabled={!selectDependentActionsEnabled} />
		</>
	)
}

function UndoRedoGroup() {
	const canUndo = useCanUndo()
	const canRedo = useCanRedo()
	return (
		<>
			<TldrawUiMenuActionItem actionId="undo" disabled={!canUndo} />
			<TldrawUiMenuActionItem actionId="redo" disabled={!canRedo} />
		</>
	)
}
