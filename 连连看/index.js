var linkup;
var rows = 7;
var cols = 12;
var types = 20;
var squareSet;
var chooseOne = null;
var chooseTwo = null;
var TowardEnum = { NONE: null, UP: { row: -1, col: 0 }, RIGHT: { row: 0, col: 1 }, DOWN: { row: 1, col: 0 }, LEFT: { row: 0, col: -1 } };
function checkFinish() {
	for (var i = 0; i < squareSet.length; i++) {
		for (var j = 0; j < squareSet[i].length; j++) {
			if (squareSet[i][j]) {
				return false;
			}
		}
	}
	return true;
}
function getLocation(row, col) {
	return "" + row + "," + col;
}
function isExist(row, col) {
	if (row > 0 && row < squareSet.length && col > 0 && col < squareSet[0].length && squareSet[row] && squareSet[row][col]) {
		return true;
	}
	return false;
}
function checkLink(row, col, changeTimes, nowToward, path) {//当前小方块，转弯次数，路径方向(0123上右下左)，所过路径
	if (isExist(row, col) && squareSet[row][col] == chooseTwo && changeTimes <= 3) {
		return true;
	}
	if (isExist(row, col) && squareSet[row][col] != chooseOne || changeTimes > 3 || row < 0 || col < 0 || row >= squareSet.length || col >= squareSet[0].length || path.indexOf(getLocation(row, col)) > -1) {
		path.pop();
		return false;
	}
	path.push(getLocation(row, col));

	return checkLink(row - 1, col, nowToward == TowardEnum.UP ? changeTimes : changeTimes + 1, TowardEnum.UP, path)//UP
		|| checkLink(row, col + 1, nowToward == TowardEnum.RIGHT ? changeTimes : changeTimes + 1, TowardEnum.RIGHT, path)//RIGHT
		|| checkLink(row + 1, col, nowToward == TowardEnum.DOWN ? changeTimes : changeTimes + 1, TowardEnum.DOWN, path)//DOWN
		|| checkLink(row, col - 1, nowToward == TowardEnum.LEFT ? changeTimes : changeTimes + 1, TowardEnum.LEFT, path)//LEFT
}
function createSquare(value, row, col) {
	var temp = document.createElement("div");
	temp.classList.add("square");
	temp.style.left = col * 86 + "px";
	temp.style.top = row * 78 + "px";
	temp.style.backgroundImage = "url('./img/" + value + ".png')";
	temp.num = value;
	temp.row = row;
	temp.col = col;
	return temp;
}
function clearSquare(row, col) {
	linkup.removeChild(squareSet[row][col]);
	squareSet[row][col] = null;
}
function generateSquareNumSet() {
	var tempSet = [];
	for (var i = 0; i < rows * cols / 2; i++) {
		var tempNum = Math.floor(Math.random() * types);
		tempSet.push(tempNum);
		tempSet.push(tempNum);
	}
	tempSet.sort(function () {
		return Math.random() - 0.5;
	});
	return tempSet;
}
function render() {
	for (var i = 0; i < squareSet.length; i++) {
		for (var j = 0; j < squareSet[i].length; j++) {
			if (squareSet[i][j] && squareSet[i][j] == chooseOne) {
				squareSet[i][j].style.opacity = "0.5";
			} else if (squareSet[i][j]) {
				squareSet[i][j].style.opacity = "1";
			}
		}
	}
}
function initSquareSet() {
	linkup.style.width = 86 * cols + "px";
	linkup.style.height = 78 * rows + "px";
	var squareNumSet = generateSquareNumSet();
	squareSet = new Array(rows + 2);
	for (var i = 0; i < squareSet.length; i++) {
		squareSet[i] = new Array(cols + 2);
	}
	for (var i = 1; i <= rows; i++) {
		for (var j = 1; j <= cols; j++) {
			var temp = createSquare(squareNumSet.pop(), i, j);
			squareSet[i][j] = temp;
			linkup.append(temp);
			temp.onclick = function () {
				if (chooseOne == null || this.num != chooseOne.num) {
					chooseOne = this;
				} else {
					chooseTwo = this;
					if (chooseOne != chooseTwo && checkLink(chooseOne.row, chooseOne.col, 0, TowardEnum.NONE, [])) {//可以消除
						clearSquare(chooseOne.row, chooseOne.col);
						clearSquare(chooseTwo.row, chooseTwo.col);
					}
					chooseOne = null;
					chooseTwo = null;
				}
				render();
				if (checkFinish()) {
					alert("恭喜获胜~！");
				}
			}
		}
	}
}
function init() {
	linkup = document.getElementById("linkup");
	if (rows * cols % 2 != 0) {
		throw Error("方块数量不能为奇数！");
	}
	initSquareSet();
}
window.onload = function () {
	init();
}