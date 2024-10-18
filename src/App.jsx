import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
import './App.scss'
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SortingVisualizer from './pages/SortingVisualizer/SortingVisualizer';
import DataStructureVisualizer from './pages/DataStructure/DataStructureVisualizer';
import MyAlgorithm from './pages/MyAlgorithm/MyAlgorithm';
import ContactUs from './pages/ContactUs/ContactUs';
import PathFindingVisualizer from './pages/Pathfinder/PathFinder';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import ComparePerformance from './pages/ComparePerformance/ComparePerformance';
import Discussion from './components/Discussion/Discussion';
import RotateScreen from './components/RotateScreen/RotateScreen'

const basename = window.location.hostname === 'YeYintAungNaing.github.io' ? '/AlgoViz-front-end-only' : '/';


function App() {

  

    function Layout() {
      return (
        <>
          <NavBar/>
          <div className='page-container'>
             <Outlet/>        {/*placeholder for the child routes */}
          </div>
          <Footer/>
        </>
      )
    }
  
    const router = createBrowserRouter([
      {
        path : '/AlgoViz-front-end-only',
        element : <Layout/>,            // whenever a user navigates to any URL starting with /AlgoViz, the Layout component will be rendered.
        children : [
          {
            path : '/AlgoViz-front-end-only',
            element : <Home/> 
          },
          {
            path : '/AlgoViz-front-end-only/register',
            element : <Register></Register>
          },
          {
            path : '/AlgoViz-front-end-only/login',
            element : <Login></Login>
          },
          {
            path : '/AlgoViz-front-end-only/sortingVisualizer',
            element : <RotateScreen><SortingVisualizer/></RotateScreen>
          },
          {
            path : '/AlgoViz-front-end-only/dataStructureVisualizer',
            element : <RotateScreen><DataStructureVisualizer/></RotateScreen>
          },
          {
            path : '/AlgoViz-front-end-only/pathFindingVisualizer',
            element : <RotateScreen><PathFindingVisualizer/></RotateScreen>
          },
          {
            path : '/AlgoViz-front-end-only/myAlgorithm',
            element : <RotateScreen><MyAlgorithm/></RotateScreen>
          },
          {
            path : '/AlgoViz-front-end-only/discussion',
            element : <Discussion></Discussion>
          },
          {
            path : '/AlgoViz-front-end-only/contact',
            element : <ContactUs></ContactUs>
          },
          {
            path : '/AlgoViz-front-end-only/compare',
            element : <ComparePerformance></ComparePerformance>
          },
        ]
      }
    ])
    
    return (
      <div className='app'>
          <RouterProvider router={router} 
          basename={basename} 
          /> 
               
      </div>
    )
  }
  
  export default App