class Node {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
    this.height = 1
  }
}

export class avl_tree {
  constructor(values) {
    this.root = null
    if (values && values.length > 0) {
      values.forEach(value => this.insert(value))
    }
  }

  insert(value) {
    this.root = this.insert_node(this.root, value)
  }

  insert_node(node, value) {
  // Base case: create new node
  if (!node) {
    return new Node(value)
  }

  // Insert into left or right subtree
  if (value < node.value) {
    node.left = this.insert_node(node.left, value)
  } else if (value > node.value) {
    node.right = this.insert_node(node.right, value)
  } else {
    // Duplicate value
    return node
  }

  // Update height of current node
  this.update_height(node)

  // Rebalance the tree
  node = this.rebalance(node)

  return node
}

// Insert without rebalancing (creates imbalanced tree)
insert_node_no_rebalance(node, value) {
  if (!node) {
    return new Node(value)
  }

  if (value < node.value) {
    node.left = this.insert_node_no_rebalance(node.left, value)
  } else if (value > node.value) {
    node.right = this.insert_node_no_rebalance(node.right, value)
  } else {
    return node
  }

  this.update_height(node)
  // NO rebalance call - leaves tree imbalanced

  return node
}

  // Update node height based on children
  update_height(node) {
    if (node) {
      const leftHeight = node.left ? node.left.height : 0
      const rightHeight = node.right ? node.right.height : 0
      node.height = 1 + Math.max(leftHeight, rightHeight)
    }
  }

  // Get balance factor
  get_balance(node) {
    if (!node) return 0
    const leftHeight = node.left ? node.left.height : 0
    const rightHeight = node.right ? node.right.height : 0
    return leftHeight - rightHeight
  }

  // Right rotation
  rotate_right(y) {
    const x = y.left
    const T2 = x.right

    x.right = y
    y.left = T2

    this.update_height(y)
    this.update_height(x)

    return x
  }

  // Left rotation
  rotate_left(x) {
    const y = x.right
    const T2 = y.left

    y.left = x
    x.right = T2

    this.update_height(x)
    this.update_height(y)

    return y
  }

  rebalance(node) {
  if (!node) return null

  this.update_height(node)
  const balance = this.get_balance(node)

  // Left-Left case
  if (balance > 1 && this.get_balance(node.left) >= 0) {
    node = this.rotate_right(node)
  }
  // Left-Right case
  else if (balance > 1 && this.get_balance(node.left) < 0) {
    node.left = this.rotate_left(node.left)
    node = this.rotate_right(node)
  }
  // Right-Right case
  else if (balance < -1 && this.get_balance(node.right) <= 0) {
    node = this.rotate_left(node)
  }
  // Right-Left case
  else if (balance < -1 && this.get_balance(node.right) > 0) {
    node.right = this.rotate_right(node.right)
    node = this.rotate_left(node)
  }

  // Recursively rebalance children
  if (node.left) {
    node.left = this.rebalance(node.left)
  }
  if (node.right) {
    node.right = this.rebalance(node.right)
  }

  this.update_height(node)
  return node
}

  // Convert to array (in-order traversal)
  toArray() {
    const result = []
    this.in_order(this.root, result)
    return result
  }

  in_order(node, result) {
    if (node) {
      this.in_order(node.left, result)
      result.push(node.value)
      this.in_order(node.right, result)
    }
  }
}