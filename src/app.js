import React, { useState, Component } from 'react';
import Board from './components/Board';
import { AppContainer, Input, FormContainer, Header, FormItem, Label, HeaderLabel } from './styledApp';
import { getRandomInteger, closestSquare } from './utils';

/**
 * class based component
 * @class App
 */
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      rowNum: 10,
      columnNum: 10,
      mainSquare: [],
      randomSquares: [],
      removeIndex: 0,
      moves: 0,
      startButtonEnabled: false,
    }
    this.moveMainSquare = this.moveMainSquare.bind(this);
    this.getRandomSquares = this.getRandomSquares.bind(this);
    this.moveHorizontal = this.moveHorizontal.bind(this);
    this.moveVertical = this.moveVertical.bind(this);
    this.updateRandomSquares = this.updateRandomSquares.bind(this);
    this.updateSquareCount = this.updateSquareCount.bind(this);
    this.start = this.start.bind(this);
  }

  componentDidUpdate(prevProps, prevState){
    if (this.state.randomSquares.length != prevState.randomSquares.length) {
      this.moveMainSquare()
    }
  }

  /**
   * Updates the number of rows and columns on the board
   * @param {object} e - the element that triggered this event
   * @param {string} axis - the axis to update
   */
  updateSquareCount(e, axis) {
    const { value } = e.target;
    if (axis === 'row') {
      this.setState({ rowNum: value })
    }
    else {
      this.setState({ columnNum: value })
    }
  }

  /**
   * updates the green Sprites on the board
   */
  updateRandomSquares(){
    const { randomSquares, removeIndex } = this.state;
    const item = randomSquares[removeIndex];
    const newArray = randomSquares.filter((square) => {
      return !(item[0] === square[0] && item[1] === square[1])
    })
    this.setState({
      randomSquares: newArray
    })
  }

  /**
   * moves the red Sprites horizontally
   * @param {integer} current - current x-axis of the red Sprites
   * @param {integer} next - the x-axis of the closest green Sprites
   * @param {array} main - an array holding the x and y-axis of the red Sprites 
   * @param {array} near - an array holding the x and y-axis of the nearest green Sprites 
   */
  moveHorizontal( current, next, main, near){
    if (next < current) {
        this.setState({
          mainSquare: [current-1, this.state.mainSquare[1]],
          moves: this.state.moves + 1
        }, () => {
          current -= 1
          setTimeout(() => {
            this.moveHorizontal(current, next, main, near)
          }, 250)
        })
    } else if (next > current ) {
        this.setState({
          mainSquare: [current+1, this.state.mainSquare[1]],
          moves: this.state.moves + 1
      }, () => {
        current += 1
        setTimeout(() => {
          this.moveHorizontal(current, next, main, near)
        }, 250)
      })
  } 
  else {
      this.moveVertical(main[1], near[1])
  }
}

/**
 * moves the red Sprites vertically
 * @param {integer} current - current y-axis of the red Sprites
 * @param {integer} next - the y-axis of the closest green Sprites 
 */
moveVertical( current, next){
  if (next < current) {
      this.setState({
        mainSquare: [this.state.mainSquare[0], current-1],
        moves: this.state.moves + 1
      }, () => {
        current -= 1
        setTimeout(() => {
          this.moveVertical(current, next)
        }, 250)
      })
  } else if (next > current ) {
      this.setState({
        mainSquare: [this.state.mainSquare[0], current+1],
        moves: this.state.moves + 1
    }, () => {
      current += 1
      setTimeout(() => {
        this.moveVertical(current, next)
      }, 250)
    })
  }
  else {
    this.updateRandomSquares();
}
}

/**
 * method to move start moving the red Sprites
 */
moveMainSquare() {
  const { randomSquares, mainSquare } = this.state;
  const  { minIndex, nearest } = closestSquare(randomSquares, mainSquare);
  this.setState({
    removeIndex: minIndex
  })
  if (minIndex != undefined) this.moveHorizontal(mainSquare[0], nearest[0], mainSquare, nearest);
}

/**
 * method to generate the green Sprites and
 * the position of the red Sprites
 */
getRandomSquares() {
  const { rowNum, columnNum } = this.state;
  const rows = parseInt(rowNum);
  const columns = parseInt(columnNum);
  const middle = (rows + columns) / 2;
  for (let i = 1; i <= middle; i++) {
    const randomRow = getRandomInteger(1, parseInt(rowNum));
    const randomColumn = getRandomInteger(1, parseInt(columnNum));
    const axis = [randomColumn, randomRow];
    this.setState((state) => ({
      randomSquares: [...state.randomSquares, axis],
      mainSquare: [Math.ceil(rows/2), Math.ceil(columns/2)]
    }));
  }
}

/**
 * method to start the game
 */
start() {
  this.getRandomSquares();
  this.setState({
    startButtonEnabled: true
  })
}

/**
 * method to reset the game
 */
reset() {
  this.setState({
    rowNum: 10,
    columnNum: 10,
    mainSquare: [],
    randomSquares: [],
    removeIndex: 0,
    moves: 0,
    startButtonEnabled: false,
  })
} 

/**
 * App render method
 */
  render(){
    const { rowNum, columnNum, moves, startButtonEnabled, mainSquare, randomSquares
    } = this.state;

    return(
      <AppContainer>
      <Header>
      <HeaderLabel>
        MAZE PROBLEM
      </HeaderLabel>
        <FormContainer>
          <FormItem>
            <Label> Number of rows: </Label>
            <Input type="number" value={rowNum} onChange={(e) => {this.updateSquareCount(e, 'row')} } />
          </FormItem>
          <FormItem>
            <Label> Number of column: </Label>
            <Input type="number" value={columnNum} onChange={(e) => {this.updateSquareCount(e, 'column')} } />
          </FormItem>
          <FormItem>
            <Label> Total number of moves: </Label>
            <Input type="test" disabled value={moves} />
          </FormItem>
          <Input type="button" value="Start" disabled={startButtonEnabled} onClick={() => this.start()} />
          <Input type="button" value="Reset" onClick={() => this.reset()} />
        </FormContainer>
      </Header>
      <Board 
        rows={rowNum}
        columns={columnNum}
        mainSquare={mainSquare}
        moveMainSquare={this.moveMainSquare}
        randomSquares={randomSquares}
      />
      </AppContainer>
    )
  }
}

export default App;
