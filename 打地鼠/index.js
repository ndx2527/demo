var ground;//游戏背景图片
var maxMouseCount = 2;//可以同时存在的最大地鼠数量
var mouse = [null, null, null, null, null, null, null, null, null];//地鼠集合，最大九个。
var coordinate = [{x: 130, y:173}, {x: 320, y:171}, {x: 515, y:175}, {x: 105, y: 265}, {x: 320, y: 256}, {x: 522, y: 256}, {x: 96, y: 350}, {x: 320, y: 355}, {x: 540, y: 358}];//洞口坐标
var mask = [];//遮罩div
var frame = 20;
var life = 10;
var score = 0;
var gameTimer;
function disappear(index, isHit) {
    if (mouse[index] != null) {
        mouse[index].status = 1;
        mouse[index].style.transition = "top 0.5s";
        mouse[index].style.top = "70px";
        if (isHit) {
            score += 10;
            var bomb = document.createElement("img");
            bomb.classList.add("mouse");
            bomb.style.top = "-40px";
            bomb.src = "./images/bomb.gif";
            mouse[index].appendChild(bomb);
            mouse[index].style.background = "url('./images/hit" + mouse[index].num + ".png') no-repeat";
            clearTimeout(mouse[index].timer);
        } else {
            life -= 1;
        }
        setTimeout(function () {
            if (mouse[index]) {
                mask[index].removeChild(mouse[index]);
            }
            mouse[index] = null;
        }, 500);
    }
}
function createMask() {
    for (var i = 0 ; i < coordinate.length ; i ++) {
        var temp = document.createElement("div");
        temp.classList.add("mask");
        temp.style.left = coordinate[i].x + "px";
        temp.style.top = coordinate[i].y + "px";
        temp.index = i;
        temp.onclick = function () {
            disappear(this.index, true);
        }
        var img = document.createElement("div");
        img.classList.add("mask");
        img.style.backgroundImage = "url('./images/mask" + i + ".png')";
        img.style.zIndex = i * 2 + 1;
        temp.appendChild(img);
        mask.push(temp);
        ground.appendChild(temp);
    }
}
function createMouse(i) {
    var num = Math.floor(Math.random() * 4);
    var temp = document.createElement("div");
    temp.num = num;
    temp.classList.add("mouse");
    temp.style.background = "url('./images/mouse" + num + ".png') no-repeat";
    temp.style.zIndex = i * 2;
    temp.style.animation = "moveTop 0.5s linear";
    mouse[i] = temp;
    mask[i].appendChild(temp);
    var timer = setTimeout(function () {
        disappear(i, false);
    }, 2000);
    temp.timer = timer;
}
function generateMouse() {
    var num = Math.floor(Math.random() * mask.length);
    if (mouse.filter(function (item) {
        return item;
    }).length < maxMouseCount && mouse[num] == null) {
        createMouse(num);
    }
}
function init() {
    createMask();
    gameTimer = setInterval(function () {
        generateMouse();
        if (life <= 0) {
            clearInterval(gameTimer);
            alert("游戏结束，您的分数为：" + score);
        }
        document.getElementsByClassName("score")[0].getElementsByTagName("span")[0].innerHTML = score + "，生命：" + life;
        maxMouseCount = score / 100 + 1;
    }, 1000 / frame);
}
window.onload = function () {
    ground = document.getElementById("ground");
    ground.onmousedown = function () {
        ground.style.cursor = "url('./images/hammer2.png'), auto";
    }
    ground.onmouseup = function () {
        ground.style.cursor = "url('./images/hammer.png'), auto";
    }
    init();
}