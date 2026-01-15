import { EraserTool } from './tools/EraserTool/EraserTool'
import { HandTool } from './tools/HandTool/HandTool'
import { LaserTool } from './tools/LaserTool/LaserTool'
import { SelectTool } from './tools/SelectTool/SelectTool'

/** @public */
export const defaultTools = [EraserTool, HandTool, LaserTool, SelectTool] as const
