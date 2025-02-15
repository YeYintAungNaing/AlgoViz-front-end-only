import { Link } from "react-router-dom"
//import Logo from '../imgs/Logo.png'

function NavBar() {
  return (
    <div className="navBar">
        <Link className='link' to="/">
          <h1>AlgoViz</h1>
        </Link>
      <div className="navLinks">
        <Link className='link' to='/'>Home</Link>
        <Link className='link' to='/compare'>Compare</Link>
        <Link className='link' to='/discussion'>Discussion</Link>
        <Link className="link" to='/register'>
          <button className="submit-button">Login</button>
        </Link>
      </div>
    </div>
  )
}

export default NavBar