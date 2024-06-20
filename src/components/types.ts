export enum ItemType {
  OBJECT,
  ARRAY,
  VALUE,
}

export type PrimitiveTypes = string | number | boolean | null

export interface SelectedData {
  key: string
  value: PrimitiveTypes
  path: string
}

export interface ItemData {
  key: string
  type: ItemType
  path: string
  depth: number
  length?: number
  children?: ItemData[]
  value?: PrimitiveTypes
}
