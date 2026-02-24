import "./Header.css"

export default function Header() {
  return (
    <div id="header">
      <div className="container">
        <nav>
          <ul>
            <li><a href="../../../../index.html">Home</a></li>
            <li><a href="../../../../index.html#about">About</a></li>
            <li><a href="../../../portfolio.html">Portfolio</a></li>
            <li><a href="../../../../index.html#contact">Contact</a></li>
            <li><a href="https://github.com/Haris2256" target="_blank" rel="noreferrer">Github</a></li>
            <li><a href="https://linkedin.com/in/haris-ahmad-67563228a" target="_blank" rel="noreferrer">Linkedin</a></li>
          </ul>
        </nav>

        <div className="header-text">
          <h1>AVL Rotation Game</h1>
          <h2>Fix the imbalance using the correct rotation</h2>
          <p>Double click nodes to disconnect them from their parents</p>
          <p>Nodes can only be connected as children, a node cannot be assigned a child by moving the parent</p>
        </div>
      </div>
    </div>
  )
}