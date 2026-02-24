import { useState, useEffect, useRef } from 'react'
import './TreeDisplay.css'

export default function TreeDisplay({ tree, editable = false }) {
  const [nodes, setNodes] = useState([])
  const [lines, setLines] = useState([])
  const [draggingNode, setDraggingNode] = useState(null)
  const [treeStructure, setTreeStructure] = useState(null)
  const svgRef = useRef(null)

  const NODE_RADIUS = 15
  const VERTICAL_GAP = 40
  const HORIZONTAL_GAP = 0

  // Initial calculation
  useEffect(() => {
    if (!tree || !tree.root) return

    const nodePositions = []
    const calculatePositions = (node, depth, minX, maxX) => {
      if (!node) return

      const x = (minX + maxX) / 2
      const y = depth * VERTICAL_GAP + 50

      nodePositions.push({
        id: `${node.value}-${Math.random()}`,
        value: node.value,
        x,
        y,
        originalX: x,
        originalY: y,
        nodeRef: node,
        parentId: null,
        childSide: null,
      })

      if (node.left) {
        calculatePositions(node.left, depth + 1, minX, x - HORIZONTAL_GAP / 2)
      }

      if (node.right) {
        calculatePositions(node.right, depth + 1, x + HORIZONTAL_GAP / 2, maxX)
      }
    }

    const width = 400
    calculatePositions(tree.root, 0, 0, width)

    // Set up parent-child relationships
    nodePositions.forEach((node) => {
      const treeNode = node.nodeRef
      if (treeNode.left) {
        const leftChild = nodePositions.find(n => n.nodeRef === treeNode.left)
        if (leftChild) {
          leftChild.parentId = node.id
          leftChild.childSide = 'left'
        }
      }
      if (treeNode.right) {
        const rightChild = nodePositions.find(n => n.nodeRef === treeNode.right)
        if (rightChild) {
          rightChild.parentId = node.id
          rightChild.childSide = 'right'
        }
      }
    })

    setNodes(nodePositions)
    setTreeStructure(nodePositions)
    updateLines(nodePositions)
  }, [tree])

  const updateLines = (nodeList) => {
    const newLines = []
    nodeList.forEach((node) => {
      if (node.parentId) {
        const parent = nodeList.find(n => n.id === node.parentId)
        if (parent) {
          newLines.push({
            x1: parent.x,
            y1: parent.y + NODE_RADIUS,
            x2: node.x,
            y2: node.y - NODE_RADIUS,
          })
        }
      }
    })
    setLines(newLines)
  }

  const getDistance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
  }

  // Get all descendants of a node
  const getDescendants = (nodeId, nodeList) => {
    const descendants = []
    const findChildren = (id) => {
      nodeList.forEach(node => {
        if (node.parentId === id) {
          descendants.push(node.id)
          findChildren(node.id)
        }
      })
    }
    findChildren(nodeId)
    return descendants
  }

  const handleMouseMove = (e) => {
    if (!draggingNode || !svgRef.current || !editable) return

    const svg = svgRef.current
    const rect = svg.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setNodes(prevNodes => {
      // Get all descendants of the dragged node
      const descendants = getDescendants(draggingNode, prevNodes)
      const draggedNode = prevNodes.find(n => n.id === draggingNode)
      const deltaX = x - draggedNode.x
      const deltaY = y - draggedNode.y

      const updatedNodes = prevNodes.map(node => {
        if (node.id === draggingNode) {
          return {
            ...node,
            x: x,
            y: y,
          }
        }

        // Move all children along with parent
        if (descendants.includes(node.id)) {
          return {
            ...node,
            x: node.x + deltaX,
            y: node.y + deltaY,
          }
        }

        return node
      })

      // Check for detachment
      const updatedDraggedNode = updatedNodes.find(n => n.id === draggingNode)

      // Check for reconnection to closest available parent
      if (!updatedDraggedNode.parentId) {
        let closestParent = null
        let closestDistance = Infinity

        updatedNodes.forEach(node => {
          if (node.id === draggingNode || descendants.includes(node.id)) return

          const distance = getDistance(updatedDraggedNode.x, updatedDraggedNode.y, node.x, node.y)

          if (distance < 50 && distance < closestDistance) {
            const leftChildExists = updatedNodes.some(n => n.parentId === node.id && n.childSide === 'left')
            const rightChildExists = updatedNodes.some(n => n.parentId === node.id && n.childSide === 'right')

            if (!leftChildExists || !rightChildExists) {
              closestParent = node
              closestDistance = distance
            }
          }
        })

        if (closestParent) {
          const leftChildExists = updatedNodes.some(n => n.parentId === closestParent.id && n.childSide === 'left')
          updatedDraggedNode.parentId = closestParent.id
          updatedDraggedNode.childSide = leftChildExists ? 'right' : 'left'
        }
      }

      updateLines(updatedNodes)
      return updatedNodes
    })
  }

  const handleMouseDown = (nodeId) => {
    if (!editable) return
    setDraggingNode(nodeId)
  }

  const handleMouseUp = () => {
    setDraggingNode(null)
  }

  const handleDoubleClick = (nodeId) => {
    if (!editable) return

    setNodes(prevNodes => {
      const updatedNodes = prevNodes.map(node =>
        node.id === nodeId
          ? {
              ...node,
              parentId: null,
              childSide: null,
            }
          : node
      )

      updateLines(updatedNodes)
      return updatedNodes
    })
  }

  if (!tree || !tree.root) {
    return (
      <div className="tree-display">
        <p>No tree loaded</p>
      </div>
    )
  }

  return (
    <div className="tree-display-container">
      <svg
        ref={svgRef}
        className="tree-svg"
        onMouseMove={editable ? handleMouseMove : undefined}
        onMouseUp={editable ? handleMouseUp : undefined}
        onMouseLeave={editable ? handleMouseUp : undefined}
        width="400"
        height="400"
      >
        {/* Draw lines */}
        {lines.map((line, i) => (
          <line
            key={`line-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#888"
            strokeWidth="2"
          />
        ))}

        {/* Draw nodes */}
        {nodes.map(node => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={NODE_RADIUS}
              fill="#4a9eff"
              stroke="#333"
              strokeWidth="2"
              onMouseDown={() => handleMouseDown(node.id)}
              onDoubleClick={() => handleDoubleClick(node.id)}
              style={{ cursor: editable ? 'grab' : 'default' }}
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dy="0.3em"
              fill="white"
              fontSize="14"
              fontWeight="bold"
              pointerEvents="none"
            >
              {node.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}