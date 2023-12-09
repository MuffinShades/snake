const can = document.getElementById('c');
const ctx = can.getContext('2d');

let gSpeed = 50;
let gTicks = 0;
let boardW = 10;
let boardH = 10;

let startPosX = 1;
let startPosY = 1;

let canW = 700;
let canH = 700;

let food = [];
let foodAmount = 20;

let _pix = 32;

var gridColor1 = 'rgb(50,210,50)', gridColor2 = 'rgb(50,235,50)'

setInterval(function() {
    can.width = canW;
    can.height = canH;
    ctx.fillStyle = 'rgb(100,200,255)';
    ctx.fillRect(0,0,can.width,can.height);

    //draw grid
    drawBgGrid();

    if (gTicks >= gSpeed) {
        update();
        gTicks=0;
    }

    draw()

    gTicks++;
});

function drawBgGrid() {
    for (let i = 0; i < boardW; i++) {
        for (let j = 0; j < boardH; j++) {
            ctx.fillStyle = (i+j)%2==0 ? gridColor1 : gridColor2;

            ctx.fillRect(i*_pix,j*_pix,_pix,_pix);
        }
    }
}

let snake = [];

let head = [];

function reset() {
    dx = 1;
    dy = 0;

    //reset snek
    snake = [];

    head = [startPosX,startPosY];

    //reset food positions
    food = [];

    for (let i = 0; i < foodAmount; i++) {
        food[i] = genNewFood();
    }

    //adjust board size
    let wX = Math.floor(canW / boardW);
    let wY = Math.floor(canH / boardH);

    _pix = wX > wY ? wX : wY;
}

let dx = 1;
let dy = 0;

let movQueue = [];

let _food = false;

function update() {
    if (movQueue.length > 0) {
        let q = movQueue.pop();

        dx = q[0];
        dy = q[1];
    }

    head[0] += dx;
    head[1] += dy;

    for (let i = 0; i < food.length; i++) {
        if (head[0] == food[i][0] && head[1] == food[i][1]) {
            food.splice(i,1);
            food.push(genNewFood());
            _food = true;
        }
    }

    if (!_food) {
        snake.pop();
    }

    _food = false;

    if (head[0] < 0 || head[0] >= boardW || head[1] < 0 || head[1] >= boardH) {
        gameEnd();
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i][0] == head[0] && snake[i][1] == head[1]) {
            gameEnd();
            break;
        }
    }

    snake.unshift([head[0],head[1]]);
}

function genNewFood() {
    let p;
    let g = false;

    while (!g) {
        g = true;

        p = [
            Math.floor(Math.random()*boardW),
            Math.floor(Math.random()*boardH)
        ];

        for (let i = 0 ; i < snake.length; i++) {
            if (snake[i] == p) {
                g = false;
            }
        }
    }

    return p;
}

function draw() {
    for (let i = 0; i < food.length; i++) {
        ctx.fillStyle = '#F00';
        let f = food[i];
        ctx.fillRect(f[0]*_pix,f[1]*_pix,_pix,_pix);
    }

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = '#000';
        let s = snake[i];
        //console.log(s,i,snake.length)

        //ctx.fillRect(s[0] * _pix,s[1] * _pix, _pix, _pix);

        let cfg = [false,false,false,false];

        for (let j = i-1; j <= i+1; j++) {
            if (j >= 0 && j < snake.length && j != i) {
                let xd = snake[i][0]-snake[j][0];
                let yd = snake[i][1]-snake[j][1];

                if (Math.abs(xd) == 1 && Math.abs(yd) == 0) {
                    cfg[Math.sign(xd)==1?0:2] = true;
                }

                if (Math.abs(xd) == 0 && Math.abs(yd) == 1) {
                    cfg[Math.sign(yd)==1?1:3] = true;
                }
            }
        }

        drawCfg(s, cfg, 10);
    }
}

function drawCfg(p, cfg, iW) {
    let x = p[0]*_pix;
    let y = p[1]*_pix;
    let w = _pix;
    let h = _pix;
    ctx.fillRect(x+iW, y+iW, w - iW*2, h - iW*2);

    if (cfg[0]) {
        ctx.fillRect(x, y+iW, iW, h - iW*2);
    }

    if (cfg[1]) {
        ctx.fillRect(x+iW, y, w - iW*2, iW);
    }

    if (cfg[2]) {
        ctx.fillRect(x+w-iW, y+iW, iW, h - iW*2);
    }

    if (cfg[3]) {
        ctx.fillRect(x+iW, y+h-iW, w - iW*2, iW);
    }
}

reset();

window.addEventListener('keydown', function(e) {
    let _dx = dx, _dy = dy;

    if (movQueue.length > 0) {
        _dx = movQueue[0][0] || dx; 
        _dy = movQueue[0][1] || dy;
    }

    switch (e.key) {
        case 'w': {
            if (_dy == 0 && _dx != 0) {
                movQueue.unshift([0,-1]);
            }

            break;
        }

        case 'a': {
            if (_dx == 0 && _dy != 0) {
                movQueue.unshift([-1,0]);
            }

            break;
        }

        case 's': {
            if (_dy == 0 && _dx != 0) {
                movQueue.unshift([0,1]);
            }

            break;
        }

        case 'd': {
            if (_dx == 0 && _dy != 0) {
                movQueue.unshift([1,0]);
            }

            break;
        }
    }
})

function gameEnd() {
    reset();
}