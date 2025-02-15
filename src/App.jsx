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
        path : '/',
        element : <Layout/>,            // whenever a user navigates to any URL starting with /AlgoViz, the Layout component will be rendered.
        children : [
          {
            path : '/',
            element : <Home/> 
          },
          {
            path : '/register',
            element : <Register></Register>
          },
          {
            path : '/login',
            element : <Login></Login>
          },
          {
            path : '/sortingVisualizer',
            element : <RotateScreen><SortingVisualizer/></RotateScreen>
          },
          {
            path : '/dataStructureVisualizer',
            element : <RotateScreen><DataStructureVisualizer/></RotateScreen>
          },
          {
            path : '/pathFindingVisualizer',
            element : <RotateScreen><PathFindingVisualizer/></RotateScreen>
          },
          {
            path : '/myAlgorithm',
            element : <RotateScreen><MyAlgorithm/></RotateScreen>
          },
          {
            path : '/discussion',
            element : <Discussion></Discussion>
          },
          {
            path : '/contact',
            element : <ContactUs></ContactUs>
          },
          {
            path : '/compare',
            element : <ComparePerformance></ComparePerformance>
          },
        ]
      }
    ])
    
    return (
      <div className='app'>
          <RouterProvider router={router} 
          /> 
               
      </div>
    )
  }
  
  export default App