import { useEffect, useRef, useState } from 'react'
import { DataSet, Network } from 'vis-network/standalone'
import type { Node, Edge } from 'vis-network'
import { useNavigate } from 'react-router'
interface CustomNode extends Node {
  originalColor?: string
}
function GraphComponent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!containerRef.current) return

    const containerWidth = containerRef.current.offsetWidth
    const containerHeight = containerRef.current.offsetHeight
    const minDim = Math.min(containerWidth, containerHeight)

    const baseSize = minDim * 0.03
    const selectedSize = minDim * 0.06

    const nodes = new DataSet<CustomNode>([
      {
        id: 1,
        label: 'Programming',
        color: { background: '#8b5cf6' },
        size: baseSize,
        originalColor: '#8b5cf6',
      },
      {
        id: 2,
        label: 'Databases',
        color: { background: '#06b6d4' },
        size: baseSize,
        originalColor: '#06b6d4',
      },
      {
        id: 3,
        label: 'AI',
        color: { background: '#22c55e' },
        size: baseSize,
        originalColor: '#22c55e',
      },
      {
        id: 4,
        label: 'React',
        color: { background: '#60a5fa' },
        size: baseSize * 0.9,
        originalColor: '#60a5fa',
      },
      {
        id: 5,
        label: 'Spring Boot',
        color: { background: '#34d399' },
        size: baseSize * 0.9,
        originalColor: '#34d399',
      },
      {
        id: 6,
        label: 'PostgreSQL',
        color: { background: '#38bdf8' },
        size: baseSize * 0.9,
        originalColor: '#38bdf8',
      },
      {
        id: 7,
        label: 'MongoDB',
        color: { background: '#4ade80' },
        size: baseSize * 0.9,
        originalColor: '#4ade80',
      },
      {
        id: 8,
        label: 'Machine Learning',
        color: { background: '#f59e0b' },
        size: baseSize * 0.9,
        originalColor: '#f59e0b',
      },
      {
        id: 9,
        label: 'NLP',
        color: { background: '#ef4444' },
        size: baseSize * 0.9,
        originalColor: '#ef4444',
      },
      {
        id: 10,
        label: 'Deep Learning',
        color: { background: '#a855f7' },
        size: baseSize * 0.9,
        originalColor: '#a855f7',
      },
    ])

    const edges = new DataSet<Edge>([
      { from: 1, to: 4 },
      { from: 1, to: 5 },
      { from: 2, to: 6 },
      { from: 2, to: 7 },
      { from: 3, to: 8 },
      { from: 3, to: 9 },
      { from: 3, to: 10 },
    ])

    const network = new Network(
      containerRef.current!,
      { nodes, edges },
      {
        nodes: {
          shape: 'dot',
          font: { color: '#e5e7eb', size: 14 },
        },
        edges: {
          color: { color: '#9ca3af' },
          smooth: true,
        },
        physics: { stabilization: false },
        interaction: { hover: true },
      }
    )

    // ✅ Click event → navigate
    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0] as number
        setActiveNodeId(nodeId)

        // reset sizes
        nodes.forEach((n) => nodes.update({ id: n.id, size: baseSize }))

        // active node bigger
        nodes.update({
          id: nodeId,
          size: selectedSize,
          color: { background: '#facc15', border: '#fbbf24' }, // highlight yellow
        })

        // navigate to page (customize routes as you want)
        switch (nodeId) {
          case 1:
            navigate('/programming')
            break
          case 2:
            navigate('/databases')
            break
          case 3:
            navigate('/ai')
            break
          case 4:
            navigate('/react')
            break
          case 5:
            navigate('/spring-boot')
            break
          case 6:
            navigate('/postgresql')
            break
          case 7:
            navigate('/mongodb')
            break
          case 8:
            navigate('/machine-learning')
            break
          case 9:
            navigate('/nlp')
            break
          case 10:
            navigate('/deep-learning')
            break
          default:
            break
        }
      }
    })

    // ✅ Hover effect
    network.on('hoverNode', (params) => {
      const nodeId = params.node as number
      if (nodeId !== activeNodeId) {
        nodes.update({
          id: nodeId,
          size: baseSize * 1.3,
          color: { background: '#f472b6', border: '#ec4899' }, // pink glow
        })
      }
    })

    network.on('blurNode', (params) => {
      const nodeId = params.node as number
      if (nodeId !== activeNodeId) {
        const node = nodes.get(nodeId) as any
        if (node?.originalColor) {
          nodes.update({
            id: nodeId,
            size: baseSize,
            color: { background: node.originalColor },
          })
        }
      }
    })
  }, [activeNodeId, navigate])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
      className="bg-[#1e1e2e]"
    />
  )
}

export default GraphComponent
