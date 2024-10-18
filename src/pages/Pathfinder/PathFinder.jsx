import { useEffect, useState } from 'react'
import './PathFinder.scss'
import Point from '../../components/Point.jsx';
import  {dijkstra, sortedDijkstraPathPoints}  from '../../algorithms/Dijkstra.js';
import { astar, sortedAstarPathPoints } from '../../algorithms/Astar.js';
import { recursiveDivision } from '../../mazeGenerators/recursiveDivision.js';
import { scuffedWalls } from '../../mazeGenerators/scuffedWalls.js';


function PathFindingVisualizer() { 

  const [grid, setGrid] =  useState([]);
  //const [gridStats, setGridStats] = useState({rowCount : 25, columnCount : 40, cellSize : 25 })
  //const [coordinates, setCoordinates] = useState ({START_X : 3, START_Y : 3, END_X : 21, END_Y : 36})
  const [gridStats, setGridStats] = useState({rowCount : 23, columnCount : 40, cellSize : 25 })
  const [coordinates, setCoordinates] = useState ({START_X : 3, START_Y : 3, END_X : 19, END_Y : 36})
  const [isAnimating, setIsAnimating] = useState(false) 
  const [gridLoaded, setGridLoaded] = useState(false)
  const [message, setMessage] = useState("Select the desired algorithm and find the path")
  const [speed, setSpeed] = useState(30)
  const [mouseIsPressed, setMouseIsPressed] = useState(false)

  // const pointsRef = useRef({}); 
  // TODO 
  // allow use to move start and end points
  // add more path finding algorithms
  // making a wall on the path will cause error ( the next algorithm will not remember that wall as wall)

  useEffect(()=>{
    if (!gridLoaded){
      setIsAnimating(true)
      initializeGrid()
      //console.log('useEffect')
    }
  }, [gridLoaded])


 function handleClick(row, col) {
    if (row === coordinates.START_X && col === coordinates.START_Y || row === coordinates.END_X && col === coordinates.END_Y ) {
      return
    }
    else{
      wallToggle(row, col)
    }
  }


  function wallToggle(row, col) {
    let newGrid = grid.slice()
    let newPoint = grid[row][col]
    newPoint = {...newPoint, isWall : !newPoint.isWall}
    newGrid[row][col] = newPoint
    //console.log(newPoint)
    setGrid(newGrid)
  }


  function handleMouseDown(row, col) {
    if (isAnimating) return
    setMouseIsPressed(true)
    handleClick(row, col)
  }


  function handleOnMouseEnter(row, col) {
    if (!mouseIsPressed) {
      return
    }
    handleClick(row, col)
  }


  function handleMouseUp() {
    
    setMouseIsPressed(false)
  }


  function createPoint(row, col) {     // constructing each point in grid (showing its state, coordinates, type etc....)
    return {
      row : row,
      col : col,
      isStart : row === coordinates.START_X && col === coordinates.START_Y,
      isEnd : row === coordinates.END_X && col === coordinates.END_Y,
      distance : Infinity,
      totalDistance : Infinity,
      visited : false,
      isWall : false,
      path : false,
      previousPoint : null
    }
  }

  //console.log("rendered")
  //console.log(grid)

  function initializeGrid() {     
      let copyGrid = []
      for (let row=0; row < gridStats.rowCount ; row++){
        const currentRow = []
        for (let col=0; col < gridStats.columnCount ; col++){
          currentRow.push(createPoint(row, col))
        }
        copyGrid.push(currentRow)
      }
      setGrid(copyGrid)
      setGridLoaded(true)
      setMessage('Select the desired algorithm and find the path')
      setIsAnimating(false)
  }

  function generateScuffedWalls(e) {
    
    e.preventDefault()
    if (isAnimating) {
      setMessage('Grid updating is in process, please wait :3')
      return
    } 
    setMessage('Generating walls')
    setIsAnimating(true)
    clearWholeGridState()

    setTimeout(() => {
      const startPoint = grid[coordinates.START_X][coordinates.START_Y]
      const endPoint = grid[coordinates.END_X][coordinates.END_Y]
      let randomWalls = scuffedWalls(grid, startPoint, endPoint)
      //console.log(randomWalls)
      animateWallGeneration(randomWalls)
    }, speed * 10);
  }
  
  function generateRecursiveDivisionMaze(e) {
    e.preventDefault()
    if (isAnimating) {
      setMessage('Grid updating is in process, please wait :3')
      return
    }
    setMessage('Generating walls') 
    setIsAnimating(true)
    clearWholeGridState()
    
    setTimeout(() => {
      const startPoint = grid[coordinates.START_X][coordinates.START_Y]
      const endPoint = grid[coordinates.END_X][coordinates.END_Y]
      let generatedWalls = recursiveDivision(grid, startPoint, endPoint)
      animateWallGeneration(generatedWalls)
    }, speed * 10);
  }
  
  function toggleUpdating(callback) {          // to prevent user from generating walls and path while the grid is animating and updating its state
    if (isAnimating){
      setMessage('Grid updating is in process, please wait :3')
    }
    else{
      setIsAnimating(true)
      callback()
    }
  }
  
  function animateWallGeneration(generatedWalls) {
    //setGridLoaded(false)  // refrest the grid before generating walls  // this line is causing problem (generating walls multiple times)
    
    for (let i=0; i < generatedWalls.length; i++) {
      if (i === generatedWalls.length-1) {
        setTimeout(() => {
          const updatedGrid = updateGridStateWithWalls(generatedWalls)
          setGrid(updatedGrid)
          setIsAnimating(false)
          setMessage('Successful generated walls.You can now start your desired pathfinding method')
        }, speed  * i);
      }
      let newWall = generatedWalls[i];
      setTimeout(() => {
        document.getElementById(`${newWall[0]}-${newWall[1]}`).className = "grid-item wall"
      }, speed * i);
    }
  }


  function startDijkstra(e) {
    e.preventDefault()
    //toggleUpdating(() => {   // this is messin up with the animation timing

    if (isAnimating) {
      console.log('no')
      return
    }
    setIsAnimating(true)
    clearPath()

    setTimeout(() => {
      const startPoint = grid[coordinates.START_X][coordinates.START_Y]
      const endPoint = grid[coordinates.END_X][coordinates.END_Y]
      const sortedVisitedPoints = dijkstra(grid, startPoint, endPoint)
      const shortestPath = sortedDijkstraPathPoints(endPoint)
      //console.log(shortestPath)
      visualizeAlgorithm(sortedVisitedPoints, endPoint, shortestPath, "Dijkstra") 
    }, speed);
  }
  
  //console.log(grid)

  function visualizeAlgorithm(sortedVisitedPoints, endPoint, shortestPath, algorithm) {
    if (sortedVisitedPoints.length === 1) {    // if the start point is the only visisted point
      setIsAnimating(false)
      setMessage('Unable to find the path :(')
      return
    }
    for (let i = 1; i < sortedVisitedPoints.length-1 ; i++) {   // does not include first and last point
      setTimeout(() => {
        const visitedPoint = sortedVisitedPoints[i]
        document.getElementById(`${visitedPoint.row}-${visitedPoint.col}`).className = "grid-item visited" 
      }, speed * i);

      if (i === sortedVisitedPoints.length-2) {
        setTimeout(() => {
            getShortestPath(sortedVisitedPoints, shortestPath, algorithm);  
        }, speed * i);
      }
    }
  }


  function getShortestPath(sortedVisitedPoints, shortestPath, algorithm) {
    
    if (shortestPath.length === 1 ) {   /// if we dont find the end point
      setMessage('Unable to find the path :(')
      setIsAnimating(false)
      return
    }
    
    for (let i = 1; i < shortestPath.length-1 ; i++) {
      if ( i === shortestPath.length - 2) {
        setTimeout(() => {
          const newGrid = updateGridState(grid, sortedVisitedPoints, shortestPath )
          setGrid(newGrid)
          setIsAnimating(false)
          setMessage(`${algorithm} : Shortest path distance : ${shortestPath.length-1}`)
        }, i * 20);
        return
      }
      setTimeout(() => {
        const eachPath = shortestPath[i]
        document.getElementById(`${eachPath.row}-${eachPath.col}`).className = "grid-item path"
      }, 20 * i);
    }
  }


  function startAstar(e) {
    e.preventDefault()

    if (isAnimating) {
      console.log('no')
      return
    }
    setIsAnimating(true)
    clearPath()

    setTimeout(() => {
      const startPoint = grid[coordinates.START_X][coordinates.START_Y]
      const endPoint = grid[coordinates.END_X][coordinates.END_Y] 
      const sortedVisitedPoints = astar(grid, startPoint, endPoint)
      const shortestPath =sortedAstarPathPoints(endPoint)  // include both end and start points
      //console.log(shortestPath)
      //console.log(sortedVisitedPoints)
      visualizeAlgorithm(sortedVisitedPoints, endPoint, shortestPath, "Astar") 
    }, speed);
  }


  function clearBoard() {   /// this all reset the each cell state and grid structure  
    toggleUpdating(()=> {
      setGridLoaded(false)
    })
  }


  function clearPath() {   // clear path and visited nodes
    let updatedGrid = grid.slice()
    for (let eachRow of grid) {
      for (let point of eachRow){
        let copyPoint = {...point, path : false, visited : false, previousPoint : null, distance : Infinity,}
        updatedGrid[point.row][point.col] = copyPoint
      }
    }
    setGrid(updatedGrid)
  }


  function updateGridState(grid, sortedVisitedPoints, shortestPath) {
    let updatedGrid = grid.slice();
    for (let point of sortedVisitedPoints) {
      if (point.isStart || point.isEnd) {
        updatedGrid[point.row][point.col] = {...point, visited : false }
        continue
      }
      //let newPoint = {...point, visited : true}   // already marked visisted in algorithm
      updatedGrid[point.row][point.col] = point
    }
    for (let point of shortestPath) {
      if (point.isEnd){
        return updatedGrid
      }
      if (point.isStart) {
        continue
      }  
      let newPoint = {...point, path : true };
      updatedGrid[point.row][point.col] = newPoint
    }
  }


  function updateGridStateWithWalls(walls) {
    let updatedGrid = grid.slice();
    
    for (let wall of walls) { 
     
      let copyPoint = {...updatedGrid[wall[0]][wall[1]], isWall : true}
      updatedGrid[wall[0]][wall[1]] = copyPoint
    }
    return updatedGrid
  }

  function clearWholeGridState() {
    let updatedGrid = grid.slice()
    for (let eachRow of grid) {
      for (let point of eachRow){
        let copyPoint = {...point, isWall : false, path : false, visited : false, previousPoint : null, distance : Infinity,}
        updatedGrid[point.row][point.col] = copyPoint
      }
    }
    setGrid(updatedGrid)
  }


  function adjustSpeed(e, speed_) {
    e.preventDefault()

    if (speed_ === "slow"){
      setSpeed(40)
      document.getElementById('slow').className = 'buttons selected'   // could make it in more React way but whatever zzzz
      document.getElementById('medium').className = 'buttons'
      document.getElementById('fast').className = 'buttons'

    }
    if (speed_ === "medium"){
      setSpeed(25)
      document.getElementById('slow').className = 'buttons'
      document.getElementById('medium').className = 'buttons selected'
      document.getElementById('fast').className = 'buttons'
    }
    if (speed_ === "fast"){
      setSpeed(10)
      document.getElementById('slow').className = 'buttons'
      document.getElementById('medium').className = 'buttons'
      document.getElementById('fast').className = 'buttons selected'
    }
  }


  function setGridSize(e, size) {
    e.preventDefault()
    
    if (size === "Large") {
      let copyGridStats = {...gridStats, rowCount : 23, columnCount : 40 , cellSize : 25}
      setGridStats(copyGridStats)
      setCoordinates({START_X : 3, START_Y : 3, END_X : 19, END_Y : 36})
    }

    else if (size === "Normal") {
      let copyGridStats = {...gridStats, rowCount : 16, columnCount : 21 , cellSize : 30}
      setGridStats(copyGridStats)
      setCoordinates({START_X : 3, START_Y : 3, END_X : 13, END_Y : 16})
    }
    
    else if (size === "Small") {
      let copyGridStats = {...gridStats, rowCount : 10, columnCount : 15 , cellSize : 50}
      setGridStats(copyGridStats) 
      setCoordinates({START_X : 2, START_Y : 2, END_X : 7, END_Y : 12}) 
    }
    clearBoard()
  }

  return (
    <div className='PathFinder'>
      <div className='setting'>
        <div className='title'>
          <h1>PathFinder</h1>
        </div>
        <div className='buttons-container'>
          <button className='buttons' id='small' onClick={(e)=> setGridSize(e,'Small')}>Small</button>
          <button className='buttons' id='normal' onClick={(e)=> setGridSize(e,'Normal')}>Normal</button>
          <button className='buttons' id='large' onClick={(e)=> setGridSize(e,'Large')}>Large</button>
        </div>
        <div className='buttons-container'>
          <button className='buttons' onClick={startAstar}>A*</button>
          <button className='buttons' onClick={startDijkstra}> Dijkstra</button>
        </div>
        <div className='buttons-container'>
          <button className='buttons' onClick={generateScuffedWalls}> Random walls</button>
          <button className='buttons' onClick={generateRecursiveDivisionMaze}> Recursive division</button>
        </div>
        <div className='buttons-container'>
          <button className='buttons' id='slow' onClick={(e)=>adjustSpeed(e,'slow')}>Slow</button>
          <button className='buttons' id='medium' onClick={(e)=>adjustSpeed(e,'medium')}>Medium</button>
          <button className='buttons' id='fast' onClick={(e)=>adjustSpeed(e,'fast')}>Fast</button>
        </div>
        <div className='buttons-container'>
          <button className='buttons red' onClick={clearBoard}>clear board</button>
          <button className='buttons red' onClick={clearPath}>clear path</button>
        </div>
        <div className='label-container'>
          <div className='icon start'></div>
          <span>Start</span>
        </div>
        <div className='label-container'>
          <div className='icon end'></div>
          <span>End</span>
        </div>
        <div className='label-container'>
          <div className='icon wall'></div>
          <span>Wall</span>
        </div>
        <div className='label-container'>
          <div className='icon visited'></div>
          <span>Visited cell</span>
        </div>
        <div className='label-container'>
          <div className='icon path'></div>
          <span>Path</span>
        </div>
      </div>
      <div className='interface'>
        <div className='message-Container'>
          <h3 className='message'>{message}</h3>
        </div>
        <div className='gridContainer'
          style={{
            gridTemplateRows: `repeat(${gridStats.rowCount}, 1fr)`,
            gridTemplateColumns: `repeat(${gridStats.columnCount}, 1fr)`
          }}
        >
          {
            grid.map((eachRow) => 
              eachRow.map((point) =>  
              <Point 
                key={`${point.row}-${point.col}`}     
                handleMouseDown={handleMouseDown}
                handleMouseUp={handleMouseUp}
                handleOnMouseEnter={handleOnMouseEnter}
                cellSize={gridStats.cellSize}
                point={point}>
              </Point>   
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default PathFindingVisualizer
