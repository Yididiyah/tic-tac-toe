/**********************************************
 *
 * You’re going to store the gameboard as an array inside of a 
 * Gameboard object, so start there! Your players are also going to be stored in 
 * objects… and you’re probably going to want an object to control the flow of 
 * the game itself. 
 * 
 * Set up your HTML and write a JavaScript function that will 
 * render the contents of the gameboard array to the webpage 
 * (for now you can just manually fill in the array with "X"s 
 * and "O"s)
 * 
 * 
 * Add Marker
 *  Listen for click event on the board
 *  Add the marker to the board array
 *  Update the DOM to show added item
 *  Prevent marking already marked spots
 * 
 * 
 * 
 *************************************************/


 const GameBoard = (function(){
    let board = [];

    return {
        getBoard: function(){
            return board;
        },

        resetBoard: function(){
            board = [];
        },

        addMarker: function(index, marker){
                board[index] = marker;
        },
        isSpotTaken: function(index){
            if(board[index] === undefined){
                return false;
            }else {
                return true
            }
        },

        testing: function(){
            console.log('Board', board);
        }
    }
 })();

 const DisplayController = (function(){
     const DOMStrings = {
         boardLetter: '.board-square-letter',
         dataSquare: 'data-square-no',
         board: '.board',
         message: '.message',
         playerOne: '#player-1',
         playerTwo: '#player-2',
         btnStart: '.btn-start',
     }
        return {
            // displayBoard: function(arr){
            //     arr.forEach((boardLetter, index) => {
            //         document.querySelector(`div[${DOMStrings.dataSquare} = '${index}'] ${DOMStrings.boardLetter}`)
            //         .textContent = boardLetter;
            //     });
            // },

            getDOMStrings: function(){
                return DOMStrings;
            },

            addMarker: function(element, marker){
                const markerDOM = element.firstElementChild;
                if(markerDOM.textContent === ''){
                    element.firstElementChild.textContent = marker;
                }
            },

            displayMessage: function(message){
                const messageDOM = document.querySelector(DOMStrings.message);
                messageDOM.textContent = message;
                messageDOM.style.display = 'block';
            },
            
            hideMessage: function(){
                const messageDOM = document.querySelector(DOMStrings.message);
                messageDOM.style.display = 'none';
                
            },

            getPlayersNames: function(){
                return [
                    document.querySelector(DOMStrings.playerOne).value,
                    document.querySelector(DOMStrings.playerTwo).value,
                ]
            },

            clearNameInputs: function(){
                document.querySelector(DOMStrings.playerOne).value = '';
                document.querySelector(DOMStrings.playerTwo).value = '';
            },

            clearBoard: function(){
                document.querySelectorAll(DOMStrings.boardLetter).forEach((letter) => {
                    letter.textContent = '';
                });
            }
        }
 })();

 const GameController = (function(GameBoard, DisplayController){
    let players = [];
    let currentPlayer = 0;
    const DOM = DisplayController.getDOMStrings();
    const Player = (name, marker) => {
        return {name, marker}
    };
    const playerName = () => {
        let playerNames = DisplayController.getPlayersNames();
        // Return Player Name if Entered and display default name if not
        players = [
            Player(playerNames[0] || 'Player One', 'X'),
            Player(playerNames[1] || 'Player TWO', 'O')
        ];  
    }
    playerName();
    const switchPlayer = () => {
        currentPlayer === 0 ? currentPlayer = 1 : currentPlayer = 0;
    }

    const isThereAWinner = (board, marker) => {
        if( board[0] === marker &&
            board[1] === marker &&
            board[2] === marker){
                return true;
        }else if(   board[3] === marker &&
                    board[4] === marker &&
                    board[5] === marker){
                return true;
        }else if(   board[6] === marker &&
                    board[7] === marker &&
                    board[8] === marker){
                return true;
        } else if(  board[0] === marker &&
                    board[3] === marker &&
                    board[6] === marker){
                return true;
        } else if(  board[1] === marker &&
                    board[4] === marker &&
                    board[7] === marker){
                return true;
        } else if(  board[2] === marker &&
                    board[5] === marker &&
                    board[8] === marker){
                return true;
        } else if(  board[0] === marker &&
                    board[4] === marker &&
                    board[8] === marker){
                return true;
        } else if(  board[2] === marker &&
                    board[4] === marker &&
                    board[6] === marker){
                return true;
        }
        else {
            return false;
        }
    }

    const checkGameStatus = (board, marker) => {
        // Check if there's a winner and return it's marker
        const winnerExists = isThereAWinner(board, marker);
        // Switch Player
        if(!!winnerExists){
            // If there's a winner return the string 'win'
            return 'win';
        }else if(GameBoard.getBoard().length === 9){
            // If there's no winner but game is over, return it's a tie
            return 'tie';
        }else {
            return 'not over';
            // If game is not over return false
        }
    }
    const ctrlStartGame = () => {
        // Read Names from Input
        playerName();
        // Clear Input
        DisplayController.clearNameInputs();
        // Hide Message
        DisplayController.hideMessage();
        // Clear Board Array
        GameBoard.resetBoard();
        // Clear board on DOM
        DisplayController.clearBoard();
        // Add back removed event listeners
        document.querySelector(DOM.board).addEventListener('click', ctrlAddMarkerToSpot);
    }
    

    const ctrlAddMarkerToSpot = (e) => {
        const spot = e.target.closest(`div[${DOM.dataSquare}]`);
        // If spot is not taken add maker
        if(!GameBoard.isSpotTaken(spot.dataset.squareNo)){
            // Add marker to board
            GameBoard.addMarker(spot.dataset.squareNo, players[currentPlayer].marker);
            // Add marker to DOM
            DisplayController.addMarker(spot, players[currentPlayer].marker);
            // Check Game Status
            const status = checkGameStatus(GameBoard.getBoard() ,players[currentPlayer].marker);
            // Display message based on status
            if(status === 'win'){
                // If there's a winner
                    // Display Message of winner
                    DisplayController.displayMessage(`${players[currentPlayer].name} won the game`);
                    // Remove DOM event listener
                    document.querySelector(DOM.board).removeEventListener('click', ctrlAddMarkerToSpot);
            } else if(status === 'tie'){
                // If it's a tie
                    // Display message it's a tie
                    DisplayController.displayMessage(`It's a tie`);
                    // Remove DOM event listener
                    document.querySelector(DOM.board).removeEventListener('click', ctrlAddMarkerToSpot);
            }else {
                // If game is not over, switch player and continue
                switchPlayer();
            }

        }
    }


    const setupEventListeners = () => {

        document.querySelector(DOM.board).addEventListener('click', ctrlAddMarkerToSpot);
        document.querySelector(DOM.btnStart).addEventListener('click', ctrlStartGame)
    }

    return {
        init: function(){
            // DisplayController.displayBoard(GameBoard.getBoard());
            setupEventListeners();
        }
    }
 })(GameBoard, DisplayController);

 GameController.init();