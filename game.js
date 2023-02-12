/* 
1. Score Board on top
2. Game board : size = 9x9
3. how many kind of candies will there be? = 6
4. candies to come in randomly

*****5. make sure we do not have 3 or more candies together on initial load*********

6. add functionality to swap candies : left right top bottom
    prevent diagonal swap from happening
    take care of edge cases
    ****show not-allowed cursor when dragging over not allowed boxes
    

7. after swap: scan the board to check if we have 3 or more candies in row/column
8. If we do have 3 or more candies: 
    .0 mark them for removal
	.1 remove them
	.2 add new random candies
	.3 increment the score board 

9. add animations so its visually appealing to user,

10. add candy images

11. make sure once marked candies are removed, we dont get the same candy again in those places

*/

/*

      __0_1_2__
  #0  | 1 2 3 |
  #1  | 4 5 6 |
  #2  | 7 8 9 |

*/

var gameBoard = document.getElementsByClassName('game-board')[0];
var score = document.getElementsByClassName('score')[0];
const candies = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5'];
const NUM_OF_CANDIES = 6;
const GRID_SIZE = 9

var swapBox1, swapBox2;

function updateScoreBoard(incrementScoreBy){
    var currentScore = parseInt(score.innerHTML);
    score.innerHTML = currentScore + incrementScoreBy;

}

function removeMarkedBoxesAndGenerateNew(markedBoxes){
    
    for(var i=0; i<markedBoxes.length; i++){
        var box = markedBoxes[i];

        delete box.dataset.toberemoved;

        //box.className = 'box '+getRandomCandy();
        var candyNotWanted = '';
        candies.forEach(function(value){
            //console.log('box : ', box.dataset.id, ' class ', box.className, ' value: ', value);
            if(box.classList.contains(value)){
                //console.log('box: ', box.dataset.id, ' has ', value);
                candyNotWanted = value;
                box.classList.remove(value);
            }
        });
        //console.log('candyNotWanted for : ', box.dataset.id, ' is ', candyNotWanted);
        var newCandy = getRandomCandyExcept(candyNotWanted);
        //console.log('new candy for : ', box.dataset.id, ' is ', newCandy);
        //console.log('****************************************************************** ');
        box.classList.add(newCandy);
    }
    
}

function markForRemovalInRow(rowNum, numOfBoxes, startPositionFromEnd){
    var boxesToRemove = document.querySelectorAll('.box[data-row="'+rowNum+'"]');

    for(var i=startPositionFromEnd-1; i >= startPositionFromEnd-numOfBoxes; i--){
        boxesToRemove[i].dataset.toberemoved = true;
    }
}

function markForRemovalInCol(colNum, numOfBoxes, startPositionFromEnd){
    var boxesToRemove = document.querySelectorAll('.box[data-col="'+colNum+'"]');

    for(var i=startPositionFromEnd-1; i >= startPositionFromEnd-numOfBoxes; i--){
        boxesToRemove[i].dataset.toberemoved = true;
    }
}

function scanCols(){
    for(var colNum=0; colNum<GRID_SIZE; colNum++){
        /** CODE IN THIS SCOPE RUNS FOR EACH COLUMN */
        var arrOfBoxClassesInaCol = [];
        var boxesInACol = document.querySelectorAll('.box[data-col="'+colNum+'"]');

        for(var rowNum=0; rowNum<boxesInACol.length; rowNum++){

            /** CODE IN THIS SCOPE RUNS FOR EACH BOX IN A COLUMN */

            var className = boxesInACol[rowNum].className;
            className = className.replace('box', '').trim();
            arrOfBoxClassesInaCol.push(className);
        }

        var countClasses = 1;
        for(var i=1; i<arrOfBoxClassesInaCol.length; i++){
            if(arrOfBoxClassesInaCol[i] == arrOfBoxClassesInaCol[i-1]){
                countClasses++
            }else{
                if(countClasses >= 3){
                    console.log(countClasses, ' boxes with class ', arrOfBoxClassesInaCol[i], ' in col:',colNum , ' at: ',i);
                    markForRemovalInCol(colNum, countClasses, i);
                }
                countClasses = 1;
            }
        }

        /** SCANNING FINISHED FOR 1 COLUMN */
        console.log('AFTER SCAN finished for col: ', colNum);
        if(countClasses >= 3){
            console.log(countClasses, ' boxes with class ', arrOfBoxClassesInaCol[i], ' in col:',colNum , ' at: ',i);
            markForRemovalInCol(colNum, countClasses, i);
        }
    }
}

function scanRows(){

    for(var rowNum=0; rowNum<GRID_SIZE; rowNum++){

        /** CODE IN THIS SCOPE RUNS FOR EACH ROW */
        var arrOfBoxClassesInaRow = [];
        var boxesInARow = document.querySelectorAll('.box[data-row="'+rowNum+'"]');
        
        for(var colNum=0; colNum<boxesInARow.length; colNum++){

            /** CODE IN THIS SCOPE RUNS FOR EACH BOX IN A ROW */

            var className = boxesInARow[colNum].className;
            className = className.replace('box', '').trim();
            arrOfBoxClassesInaRow.push(className);
        }

        var countClasses = 1;
        for(var i=1; i<arrOfBoxClassesInaRow.length; i++){
            if(arrOfBoxClassesInaRow[i] == arrOfBoxClassesInaRow[i-1]){
                countClasses++
            }else{
                if(countClasses >= 3){
                    console.log(countClasses, ' boxes with class ', arrOfBoxClassesInaRow[i], ' in row:',rowNum , ' at: ',i);
                    markForRemovalInRow(rowNum, countClasses, i)
                }
                countClasses = 1;
            }
        }

        /** SCANNING FINISHED FOR 1 ROW */
        console.log('AFTER SCAN finished for row: ', rowNum);
        if(countClasses >= 3){
            console.log(countClasses, ' boxes with class ', arrOfBoxClassesInaRow[i], ' in row:',rowNum , ' at: ',i);
            markForRemovalInRow(rowNum, countClasses, i)
        }
    }

    /*console.log('AFTER ALL ROWS ARE SCANNED');
    if(countClasses >= 3){
        console.log(countClasses, ' boxes with class ', arrOfBoxClassesInaRow[i], ' in row:',rowNum-1 , ' at: ',i);
        markForRemovalInRow(rowNum-1, countClasses, i)
    }*/
}

function scanBoard(){
    scanRows();
    scanCols();

    
    setTimeout(function(){
        var markedBoxes = document.querySelectorAll('[data-toberemoved]');
        updateScoreBoard(markedBoxes.length);
        removeMarkedBoxesAndGenerateNew(markedBoxes);
    }, 500)
    
}

function touchmove_handler(ev) {
    ev.preventDefault();
    console.log('touchmove ', ev);
    //ev.dataTransfer.dropEffect = "move";
}

function touchend_handler(ev) {
    ev.preventDefault();

    console.log('touchend ', ev);
    
    swapBox2 = ev.target;

    var proceed = isSwapAllowed(swapBox1, swapBox2);

    if(proceed == true){
        swapBoxes(swapBox1, swapBox2);
        scanBoard();
    } 
}

function touchstart_handler(event){
    // store a ref. on the dragged elem
    console.log('touchstart ', event);
    swapBox1 = event.target;
}

function dragover_handler(ev) {
    ev.preventDefault();
    //ev.dataTransfer.dropEffect = "move";
}

function drop_handler(ev) {
    ev.preventDefault();
    
    swapBox2 = ev.target;

    var proceed = isSwapAllowed(swapBox1, swapBox2);

    if(proceed == true){
        swapBoxes(swapBox1, swapBox2);
        scanBoard();
    } 
}

function dragstart_handler(event){
    // store a ref. on the dragged elem
    swapBox1 = event.target;
}

function swapBoxes(box1, box2){
    var classofBox1 = box1.className;
    var classofBox2 = box2.className;

    box1.className = classofBox2;
    box2.className = classofBox1;
}

function isSwapAllowed(box1, box2){

    if(box1.className === box2.className){
        console.log('same class, cannot swap');
        return false;
    }

    var id1 = parseInt(box1.dataset.id);
    var id2 = parseInt(box2.dataset.id);

    
    console.log('isSwapAllowed 1 ', id1, id2, GRID_SIZE%id1, (id1+1)%GRID_SIZE)
    /** if the box being dragged is on left edge  */
    if(id1%GRID_SIZE===0 && id2 == id1-1){
        return false;
    }

    /** if the box being dragged is on right edge  */
    if((id1+1)%GRID_SIZE===0 && id2 == id1+1){
        return false;
    }

    console.log('isSwapAllowed 2 ', id1, id2, id1+1, id1-1, id1+GRID_SIZE, id1-GRID_SIZE)
    /** +1  -1  +GRID_SIZE  -GRID_SIZE */
    if(id2 == id1+1 || id2 == id1-1 || id2 == id1+GRID_SIZE || id2 == id1-GRID_SIZE){
        return true;
    }
    return false;
}

function createBox(count, c, row, col){
    var div = document.createElement('div');
    div.classList.add('box');
    div.dataset.id = count;

    div.dataset.row = row;
    div.dataset.col = col;

    //div.innerHTML = count
    div.classList.add(c);
    div.draggable = true;

    div.addEventListener('dragover', dragover_handler);
    div.addEventListener('drop', drop_handler);
    div.addEventListener("dragstart", dragstart_handler);

    div.addEventListener('touchmove', touchmove_handler);
    div.addEventListener('touchend', touchend_handler);
    div.addEventListener("touchstart", touchstart_handler);

    return div;
}

function getRandomCandyExcept(candyNotWanted){
    var candiesArr = Object.assign([], candies);
    var indexToRemove = candiesArr.indexOf(candyNotWanted);
    candiesArr.splice(indexToRemove, 1);

    var randomIndex = parseInt(Math.random()*candiesArr.length);
    return candiesArr[randomIndex];
}

function getRandomCandy(){
    var randomIndex = parseInt(Math.random()*candies.length);
    return candies[randomIndex];

}

function generateRandomCandies(){

    /*for(var i=0; i<GRID_SIZE*GRID_SIZE; i++){
        var c = 'c'+parseInt(Math.random()*NUM_OF_CANDIES);

        var newBox = createBox(i, c);
        
        gameBoard.append(newBox);
    }*/
    var count = 0;
    for(var rowNum=0; rowNum<GRID_SIZE; rowNum++){

        for(var colNum=0; colNum<GRID_SIZE; colNum++){
            var c = getRandomCandy();

            var newBox = createBox(count, c, rowNum, colNum);
            
            gameBoard.append(newBox);
            count++;
        }
    }
}

function main(){
    generateRandomCandies();
}

main();