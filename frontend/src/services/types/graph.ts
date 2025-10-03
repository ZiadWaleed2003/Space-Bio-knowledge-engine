interface IGraph {
  nodes: INode[]
  links: IEdge[]
}
interface INode {
  id: string
  label?: string
}
interface IEdge {
  source: string
  target: string
}

export type { IGraph, INode, IEdge }
