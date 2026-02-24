import { useState, useEffect } from 'react'
import TreeDisplay from './TreeDisplay'
import { avl_tree } from '../utils/avl_tree'
import './GameArea.css'

export default function GameArea() {
  const [unbalancedTree, setUnbalancedTree] = useState(null)
  const [balancedTree, setBalancedTree] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    generateNewTree()
  }, [])

const generateNewTree = () => {
  let unbalanced
  let balanced
  let found = false

  while (!found) {
    // Start with a smaller balanced tree
    const baseValues = generateRandomValues(5, 1, 100)
    balanced = new avl_tree(baseValues)
    unbalanced = new avl_tree(baseValues)
    
    // Insert additional values until we get exactly 1 imbalance
    let additionalValues = generateRandomValues(20, 1, 100) // Increased pool for more attempts
    
    for (let val of additionalValues) {
      unbalanced.root = unbalanced.insert_node_no_rebalance(unbalanced.root, val)
      unbalanced.update_height(unbalanced.root)
      balanced.insert(val)
      balanced.update_height(balanced.root)
      
      const imbalanceCount = countImbalances(unbalanced.root)
      if (imbalanceCount === 1) {
        found = true
        break
      }
    }
    
    // If we didn't find an imbalance, loop will retry with new values
  }

  setUnbalancedTree(unbalanced)
  setBalancedTree(balanced)
  
  setShowAnswer(false)
  setMessage('')
}
  const generateRandomValues = (count = 7, min = 1, max = 100) => {
    const values = new Set()
    while (values.size < count) {
      values.add(Math.floor(Math.random() * (max - min + 1)) + min)
    }
    return Array.from(values)
  }


  const countImbalances = (node) => {
    if (!node) return 0

    const leftHeight = node.left ? node.left.height : 0
    const rightHeight = node.right ? node.right.height : 0
    const balance = Math.abs(leftHeight - rightHeight)

    // Count this node if it's imbalanced
    const nodeImbalance = balance > 1 ? 1 : 0

    // Recursively count imbalances in subtrees
    return nodeImbalance + countImbalances(node.left) + countImbalances(node.right)
  }

  const handleCheck = () => {
    if (!unbalancedTree) return

    const isBalanced = checkIfBalanced(unbalancedTree.root)
    
    if (isBalanced) {
      const userArray = unbalancedTree.toArray()
      const answerArray = balancedTree.toArray()
      
      if (JSON.stringify(userArray) === JSON.stringify(answerArray)) {
        setMessage('Correct! You fixed the imbalance!')
      } else {
        setMessage('Tree is balanced but structure doesn\'t match. Try again!')
      }
    } else {
      setMessage('Tree is still imbalanced. Keep trying!')
    }
  }

  const checkIfBalanced = (node) => {
    if (!node) return true

    const leftHeight = node.left ? node.left.height : 0
    const rightHeight = node.right ? node.right.height : 0
    const balance = Math.abs(leftHeight - rightHeight)

    if (balance > 1) return false

    return checkIfBalanced(node.left) && checkIfBalanced(node.right)
  }

  const handleShowAnswer = () => {
    setShowAnswer(!showAnswer)
  }

  return (
    <div className="container">
      <div className="avl-tree-area">
        {/* Left: Unbalanced Tree */}
        <div className="avl-left">
          <div className="header">
            <h1>Unbalanced Tree</h1>
          </div>
          <div className="tree-area">
            <TreeDisplay tree={unbalancedTree} editable={true} />
          </div>
          <div className="avl-btn-area">
            <button id="avl-new" className="btn btn2" onClick={generateNewTree}>
              New Tree
            </button>
            {/* <button id="avl-check" className="btn btn2" onClick={handleCheck}>
              Check
            </button> */}
          </div>
          {message && <p className="message">{message}</p>}
        </div>

        {/* Right: Toggle between Original and Solution */}
        <div className="avl-right">
          <div className="header">
            <h1>{showAnswer ? 'Solution' : 'Original Tree'}</h1>
          </div>
          <div className="tree-area">
            {showAnswer ? (
              <>
                <TreeDisplay tree={balancedTree} editable={false} />
                <p className="answer-label">Solution</p>
              </>
            ) : (
              <>
                <TreeDisplay tree={unbalancedTree} editable={false} />
                <p className="answer-label">Your current tree</p>
              </>
            )}
          </div>
          <button id="avl-answer" className="btn btn2" onClick={handleShowAnswer}>
            {showAnswer ? 'Hide Solution' : 'Show Solution'}
          </button>
        </div>
      </div>
    </div>
  )
}