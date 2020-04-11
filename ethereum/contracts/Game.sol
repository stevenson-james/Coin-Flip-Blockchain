pragma solidity ^0.4.26;

contract GameFactory {
    address[] public deployedGames;
    
    function createGame(string title, uint value) public payable{
        require(msg.value == value);
        address newGame =  (new Game).value(address(this).balance)(title, value, msg.sender);
        deployedGames.push(newGame);
    }
    
    function getDeployedGames() public view returns (address[]){
        return deployedGames;
    }
}

contract Game{
    // title for coin flip instance
    string title;
    // money being bet
    uint value;
    // address of first player
    address player1;
    // address of second player
    address player2;
    // whether coin has been flipped
    bool public isCompleted;
    // if a player has cancelled
    bool public isCancelled;
    // number of yes votes
    uint readyCount;
    // each approver's vote on the request
    mapping(address => bool) playersReady;
    // number of players in the Game
    uint playersCount;
    // player who flipped the coin
    address flipPlayer;
    // side of coin player called
    bool choseHeads;
    // side of coin landed on
    bool landedHeads;
    // winner of the coin flip
    address winner;
    
    // value in wei
    constructor(string _title, uint _value, address creator) public payable{
        require(msg.value == _value);
        title = _title;
        value = _value;
        player1 = creator;
        playersCount = 1;
        isCancelled = false;
    }
    
    modifier restricted(){
        require(player1 == msg.sender || player2 == msg.sender);
        _;
    }
    
    // add player2 to game
    function bet() public payable{
        require(playersCount == 1);
        require(!isCancelled);
        require(msg.value == value);
        player2 = msg.sender;
        playersCount++;
    }
    
    // allow player to cancel input into game
    function cancel() public restricted{
        require(!isCompleted && !isCancelled);
        
        if(playersCount == 2){
            player1.transfer(address(this).balance / 2);
            player2.transfer(address(this).balance / 2);
        }
        else
            player1.transfer(address(this).balance);
        isCancelled = true;
    }
    
    // player must be ready for game as a double check of flipping the coin
    function ready() public restricted{
        require(!isCompleted && !isCancelled);
        require(!playersReady[msg.sender]);
        
        playersReady[msg.sender] = true;
        readyCount++;
    }
    
    // occurs after player chooses a side of the coin
    function chooseSide(bool _choseHeads) public restricted{
        require(readyCount == 2);
        require(!isCompleted && !isCancelled);
        flipPlayer = msg.sender;
        choseHeads = _choseHeads;
        isCompleted = true;
        // coin flip occurs here in js, setting landedSide
    }
    
    // occurs after coin is flipped and finalizes the game
    function coinFlip(bool _landedHeads) public{
        landedHeads = _landedHeads;
        if(landedHeads == choseHeads){
            flipPlayer.transfer(address(this).balance);
            winner = flipPlayer;
        }
        else
            if(flipPlayer == player1){
                player2.transfer(address(this).balance);
                winner = player2;
            }
            else{
                player1.transfer(address(this).balance);
                winner = player1;
            }
    }
    
    function getSummary() public view returns (
        string, uint, address, address, uint, uint, address, bool, bool, address
    ) {
        return (
            title,
            value,
            player1,
            player2,
            readyCount,
            playersCount,
            flipPlayer,
            choseHeads,
            landedHeads,
            winner
        );
    }
}