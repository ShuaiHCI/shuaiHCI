// const SERVER_URL = 'http://localhost:5000';  // 改成你服务器的 IP + 端口

const SERVER_URL = 'http://23.251.33.247:5000';  // 改成你服务器的 IP + 端口

const TILE_SIZE = 80;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileNameMap = {
    0: "space.png",
    1: "counter.png",
    3: "FreshTomato.png",
    4: "FreshLettuce.png",
    5: "plate.png",
    6: "cutboard.png",
    7: "delivery.png",
    8: "FreshOnion.png",
    9: "dirtyplate.png",
    10: "BadLettuce.png"
};

const images = {};

function preloadImages(callback) {
    let loadedImages = 0;
    const imageNames = [
        "space.png", "counter.png", "FreshTomato.png", "ChoppedTomato.png",
        "FreshLettuce.png", "ChoppedLettuce.png", "plate.png", "cutboard.png",
        "delivery.png", "FreshOnion.png", "ChoppedOnion.png", "dirtyplate.png",
        "BadLettuce.png", "agent-red.png", "agent-blue.png", "agent-robot.png"
    ];

    imageNames.forEach(name => {
        images[name] = new Image();
        images[name].src = "static/images/" + name;  // 假设你 host 这些图片
        images[name].onload = () => {
            loadedImages++;
            if (loadedImages === imageNames.length) {
                callback();
            }
        };
        images[name].onerror = () => {
            console.log(`Missing image for ${name}`);
            loadedImages++;
            if (loadedImages === imageNames.length) {
                callback();
            }
        };
    });
}

function drawState(state) {
    canvas.width = state.ylen * TILE_SIZE;
    canvas.height = state.xlen * TILE_SIZE;

    // Draw map
    for (let x = 0; x < state.xlen; x++) {
        for (let y = 0; y < state.ylen; y++) {
            const tile = state.map[x][y];
            const imgName = tileNameMap[tile] || "space.png";
            const img = images[imgName];
            if (img) {
                ctx.drawImage(img, y * TILE_SIZE, x * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }

    // Draw items
    const holdingPositions = new Set(state.agents.map(agent => `${agent.x},${agent.y}`));
    state.items.forEach(item => {
        const posKey = `${item.x},${item.y}`;
        if (!holdingPositions.has(posKey)) {
            const counterImg = images["counter.png"];
            if (counterImg) {
                ctx.drawImage(counterImg, item.y * TILE_SIZE, item.x * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }

            const baseImgName = item.type + ".png";
            const baseImg = images[baseImgName];
            if (baseImg) {
                ctx.drawImage(baseImg, item.y * TILE_SIZE, item.x * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }

            if (item.containing) {
                const containedImg = images[item.containing + ".png"];
                if (containedImg) {
                    ctx.drawImage(containedImg, item.y * TILE_SIZE, item.x * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }

            if (item.holding) {
                const holdingImg = images[item.holding + ".png"];
                if (holdingImg) {
                    ctx.drawImage(holdingImg, item.y * TILE_SIZE, item.x * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }
        }
    });

    // Draw agents
    state.agents.forEach(agent => {
        const agentImg = images[`agent-${agent.color}.png`];
        if (agentImg) {
            ctx.drawImage(agentImg, agent.y * TILE_SIZE, agent.x * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }

        if (agent.holding) {
            const holdImg = images[agent.holding + ".png"];
            if (holdImg) {
                ctx.drawImage(
                    holdImg,
                    agent.y * TILE_SIZE + TILE_SIZE * 0.5,
                    agent.x * TILE_SIZE + TILE_SIZE * 0.5,
                    TILE_SIZE * 0.5,
                    TILE_SIZE * 0.5
                );
            }

            if ((agent.holding === "plate" || agent.holding === "dirtyplate") && agent.holding_containing) {
                const containedImg = images[agent.holding_containing + ".png"];
                if (containedImg) {
                    ctx.drawImage(
                        containedImg,
                        agent.y * TILE_SIZE + TILE_SIZE * (0.5 + 0.25 * 0.5),
                        agent.x * TILE_SIZE + TILE_SIZE * (0.5 + 0.25 * 0.5),
                        TILE_SIZE * 0.5 * 0.7,
                        TILE_SIZE * 0.5 * 0.7
                    );
                }
            }
        }
    });
}


let gameOver = false;  // 游戏是否结束 flag

// 监听键盘
document.addEventListener('keydown', function(event) {

    // Prevent page from scrolling when using arrow keys
    const keysToPrevent = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (keysToPrevent.includes(event.key)) {
        event.preventDefault();
    }

    
    if (gameOver) return;  // 游戏结束后不处理按键
    
    console.log("Key pressed:", event.key);
    fetch(SERVER_URL + '/key_event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'key': event.key})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.state) {
            drawState(data.state);  // 直接用返回的 state 更新画面
        }


        // 更新剩余步数
        if ('steps_left' in data) {
            document.getElementById('stepsLeft').textContent = data.steps_left;
            if (data.steps_left <= 0 && !gameOver) {
                gameOver = true;
                alert("Task Completed!");
            }
        }


    })
    .catch(error => console.error('Error sending key_event:', error));
});

// 初始化，先 preload 图片 + 拉取初始 state
preloadImages(() => {
    // 初始化拉取一次 /get_state 画第一帧（可选）
    fetch(SERVER_URL + '/get_state')
        .then(response => response.json())
        .then(state => {
            drawState(state);
        })
        .catch(error => console.error('Error getting initial state:', error));
});


// Restart button click handler
document.getElementById('restartButton').addEventListener('click', function() {
    console.log("Restart button clicked.");
    fetch(SERVER_URL + '/reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.state) {
            drawState(data.state);
            document.getElementById('stepsLeft').textContent = data.steps_left;
            gameOver = false;  // 重置 gameOver flag
        }
    })
    .catch(error => console.error('Error sending reset:', error));
});