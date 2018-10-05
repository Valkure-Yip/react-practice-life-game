import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import ReactDOM from "react-dom";
import {Button} from "react-bootstrap"


var width = 10;
var height = 10;
var board = [];
var running = false;
var interval = 1000;

function initialboard(){
    board = [];
    for (let i = 0; i < height; i++) {
        var row = [];
        for (let j = 0; j < width; j++) {
            row.push(0);
        }
        board.push(row);
    }
    board[0][1] = 1;
    board[1][2] = 1;
    board[2][0] = 1;
    board[2][1] = 1;
    board[2][2] = 1;
}
function updateboard(board){ //js中传参是浅复制
    let tempboard = JSON.parse(JSON.stringify(board));
    let neighborboard = [];
    for (let i = 0; i < height; i++) {
        let row =[];
        for (let j = 0; j < width; j++) {
            let neighbor = getneighbor(board,i,j);
            row.push(neighbor);
            if (board[i][j]>0) {
                if (neighbor<2 || neighbor>3) {tempboard[i][j]=0;}
                else {tempboard[i][j]=2;}
            }
            else if (neighbor === 3) {tempboard[i][j]=1;}
        }
        neighborboard.push(row);
    }
    return tempboard;
}

function getneighbor(board,i,j) {
    var count = 0;
    for (let di = -1; di < 2; di++) {
        for (let dj = -1; dj < 2; dj++) {
            if (di===0 && dj===0) continue;
            if (board[(i+di+height)%height][(j+dj+width)%width]>0) { //wrapping (i+di+height)%height
                count++;
            }
        }
    }
    return count;
}


class App extends Component {
    constructor(props){
        super(props);
        this.state={
            boardclass: "board10_10"
        }

    }
    handleRun(){
        running = true;
    }
    handlePause(){
        running = false;
    }
    handleReset(){
        initialboard();
        ReactDOM.render(<App />, document.getElementById('root'));
    }
    handle10_10(){
        width = 10;
        height = 10;
        this.setState({boardclass:"board10_10"});
        initialboard();
        ReactDOM.render(<App />, document.getElementById('root'));
    }
    handle30_40(){
        width = 40;
        height = 30;
        this.setState({boardclass:"board30_40"});
        initialboard();
        ReactDOM.render(<App />, document.getElementById('root'));
    }
    render() {
        return (
          <div className="App">
              <Board boardclass={this.state.boardclass}/>
              <Button onClick={this.handleRun.bind(this)}>Run</Button>
              <Button onClick={this.handlePause.bind(this)}>Pause</Button>
              <Button onClick={this.handleReset.bind(this)}>Reset</Button><br/>
              <Button onClick={this.handle10_10.bind(this)}>10*10</Button>
              <Button onClick={this.handle30_40.bind(this)}>30*40</Button><br/>
              <Button onClick={function(){interval=1000;}}>Slow</Button>
              <Button onClick={function(){interval=100;}}>Medium</Button>
              <Button onClick={function(){interval=10;}}>Fast</Button>

          </div>
        );
    }
}

class Board extends Component {
    constructor(props){
        super(props);
    }

    render() {
        var cells = [];
        for (let i = 0; i < height*width; i++) {
            cells.push(<Cell id={i}/>);
        }

        return (
            <div className={this.props.boardclass}>
                {cells}
            </div>
        );
    }
}

class Cell extends Component {
    constructor(props){
        super(props);
        this.state =
            {border: "1px solid gray"}
    }
    handleMouseEnter(){
        this.setState(
            {border:"2px solid blue"}
        )
    }
    handleMouseLeave(){
        this.setState(
            {border:"1px solid gray"}
        )
    }
    handleClick(event){
        if (event.target.className === "cell dead") {
            let i = Math.floor(event.target.id/width);
            let j = event.target.id%width;
            board[i][j] = 1;
            event.target.className = "cell new";
        }
    }
    render(){
        let className = "cell dead";
        if (board[Math.floor(this.props.id/width)][this.props.id%width]===1){
            className = "cell new"
        }
        else if (board[Math.floor(this.props.id/width)][this.props.id%width]===2){
            className="cell old";
        }
        else className="cell dead";
        return(
            <div className={className} id={this.props.id} onMouseEnter={this.handleMouseEnter.bind(this)}
                 onMouseLeave={this.handleMouseLeave.bind(this)} onClick={this.handleClick.bind(this)}
                 style={{border:this.state.border}}/>
        );
    }
}

//不断产生新的setTimeout，调用新的interval值
function runit(){
    if (running) {
        board = updateboard(board);
        ReactDOM.render(<App />, document.getElementById('root'));   
    }
    setTimeout(runit,interval);
}

initialboard();
runit();

//以下代码中interval并不能控制速度，只有在页面加载时interval会被调用，setInterval在线程中不断插入函数调用
//而不会再理会interval之后的变化
// setInterval(function(){
//     if(running){
//         board = updateboard(board);
//         ReactDOM.render(<App />, document.getElementById('root'));
//     }
// },interval);

export default App;
