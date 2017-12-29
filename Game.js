//DEFINES
const ROW = EMPTY = START = 0;
const COL = INDEX_FIX = 1;
const POSIBOLE_ACTIONS = ID_LEN = 2;
const BOARD_ROW = BOARD_COL = BOARD_SIZE = 3;
//Global variables
var _winner = false;
var _board = [];
var _playerTurn = 0;
var _actions = ['X', 'O'];
var _players = ['bob', 'alice'];
var _current_player;
var _played_moves = [[],[],[]];

var _ERROR_HANDLER = {
    "InvalidID": initGame
};

function findCellPosition(cell){
    try{
        if(cell.id.length != ID_LEN) throw "Invalid ID";
        let cell_row = parseInt(cell.id[0]),
        cell_col = parseInt(cell.id[1]);
        if(isNaN(cell_row) || isNaN(cell_col) || cell != _board[cell_row][cell_col]) throw "Invalid row/col ID";
        return [cell_row, cell_col];
    }
    catch(err){
        console.error(err);
        return "InvalidID";
    }
}

function checkWinRow(row, move){
    for(let col = START; col < BOARD_COL; col ++){
        if (_played_moves[row][col] != move){return false;}
    }
    _board[row].forEach(col => {
        col.classList.add("winCell");
    });
    return true;
}

function checkWinCol(col, move){
    for(let row = START; row < BOARD_ROW; row ++){
        if (_played_moves[row][col] != move){return false;}
    }
    _board.forEach(row => {
        row[col].classList.add("winCell");
    });
    return true;
}

function checkWinDiagonals(action){
    let main_diagonal_win = true,
    secondary_diagonal_win = true;
    for(let row_col = START; row_col < BOARD_SIZE; row_col++){
        if(_played_moves[row_col][row_col] != action){main_diagonal_win = false;}
        if(_played_moves[row_col][BOARD_SIZE-row_col-INDEX_FIX] != action ){secondary_diagonal_win = false;}
    }
    if(main_diagonal_win){
        for (let main_win = START; main_win < BOARD_SIZE; main_win++){
            _board[main_win][main_win].classList.add("winCell");
        }
    }
    else if(secondary_diagonal_win){
        for (let secondary_win = START; secondary_win < BOARD_SIZE; secondary_win++){
            _board[secondary_win][BOARD_SIZE-secondary_win-INDEX_FIX].classList.add("winCell");
        }
    }
    return main_diagonal_win || secondary_diagonal_win;
}


function checkWin(move_position){
    let row = move_position[ROW],
    col = move_position[COL],
    action = _played_moves[row][col];
    return checkWinRow(row, action) || checkWinCol(col, action) || checkWinDiagonals(action);
        
}

function weHaveWinner(){
    let state = document.getElementById("state");
    state.innerHTML = "The winner: ";
    _current_player = _players[_playerTurn];
    let page = document.getElementsByTagName("BODY")[0];
    let new_game_button = document.createElement("button");
    new_game_button.appendChild(document.createTextNode("NEW GAME"));
    new_game_button.addEventListener("click", initGame);
    page.appendChild(new_game_button);
}

function turn(){
    if(!_winner && !this.hasChildNodes()){
        let move_position = findCellPosition(this);
        if(!Array.isArray(move_position)) {return _ERROR_HANDLER[move_position]();}
        _played_moves[move_position[0]][move_position[1]] = _actions[_playerTurn];
        let move = document.createElement('span');
        move.innerHTML = _actions[_playerTurn];
        this.appendChild(move);
        _winner = checkWin(move_position);
        if(_winner){
            return weHaveWinner();
        }
        _playerTurn = (_playerTurn + 1) % 2;
        _current_player.innerHTML = _players[_playerTurn];
    }
}

function removeCells(board){
    _board.forEach(function(row){
        row.forEach(function(col){
            board.removeChild(col);
        });
    });
}

function initGlobalsValues(){
    _board = [];
    _playerTurn = 0;
    _played_moves = [[],[],[]];
    _winner = false;
    _current_player = document.getElementById("player");
    document.getElementById("state").innerHTML = "Turn: ";
}

function CreateBoardCell(row, col){
    let board_cell = document.createElement("div");
    board_cell.addEventListener('click', turn);
    board_cell.classList.add("board_cell");
    board_cell.id = ''+ row + col; 
    return board_cell;
}

function buildBoard(board_loader){
    for(let row = 0; row < BOARD_ROW; row++){
        let board_row = [];
        for(let col = 0; col < BOARD_COL; col++){
            board_row.push(CreateBoardCell(row, col));
            board_loader.appendChild(board_row[col]);
        }
        _board.push(board_row);
    }
}

function initGame() {
    try{
        let board_loader = document.getElementById("board");
        if(Array.isArray(_board) && _board.length != EMPTY){
            removeCells(board_loader);
            document.getElementsByTagName("BODY")[0].removeChild(document.getElementsByTagName("BUTTON")[0]);
        }
        initGlobalsValues();
        _current_player.innerHTML = _players[_playerTurn];
        buildBoard(board_loader);
        console.log(_board);
    }catch(err){
        console.log("Something went wrong try refresh the page.");
    }   
}

window.onload = initGame;
