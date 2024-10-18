import { Link } from "react-router-dom"
//import Logo from '../imgs/Logo.png'

function NavBar() {
  return (
    <div className="navBar">
        <Link className='link' to="/AlgoViz-front-end-only">
          <h1>AlgoViz</h1>
        </Link>
      <div className="navLinks">
        <Link className='link' to='/AlgoViz-front-end-only'>Home</Link>
        <Link className='link' to='/AlgoViz-front-end-only/compare'>Compare</Link>
        <Link className='link' to='/AlgoViz-front-end-only/discussion'>Discussion</Link>
        <Link className="link" to='/AlgoViz-front-end-only/register'>
          <button className="submit-button">Login</button>
        </Link>
      </div>
    </div>
  )
}

export default NavBar