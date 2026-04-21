// i didnt code this btw. only the things labeled subpages, stuff, and index
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


canvas.width = 800;
canvas.height = 600;

// Game state
const gameState = {
    player: {
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 30,
        height: 30,
        speed: 5,
        health: 100,
        bullets: 20
    },
    enemies: [],
    bullets: [],
    ammoCrates: [],
    lastSpawnTime: 0,
    spawnInterval: 3000, // Spawn enemies every 3 seconds
    lastDamageTime: 0,
    damageInterval: 1000,
    gameOver: false
};

// Enemy types
const enemyTypes = [
    { type: 'headcrab', color: 'green', speed: 4, damage: 5, health: 10, width: 15, height: 15 },
    { type: 'gas_mask_guy', color: 'grey', speed: 1.5, damage: 15, health: 30, width: 30, height: 30 }
];

// Controls
const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

// Mouse position
let mouseX = 0;
let mouseY = 0;

// Event listeners
window.addEventListener('keydown', (e) => {
    if (e.key === 'w') keys.w = true;
    if (e.key === 'a') keys.a = true;
    if (e.key === 's') keys.s = true;
    if (e.key === 'd') keys.d = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'w') keys.w = false;
    if (e.key === 'a') keys.a = false;
    if (e.key === 's') keys.s = false;
    if (e.key === 'd') keys.d = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

// Mouse click for shooting
canvas.addEventListener('click', () => {
    if (gameState.player.bullets > 0 && !gameState.gameOver) {
        shootBullet();
    }
});

// Collision detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Shoot a bullet
function shootBullet() {
    const dx = mouseX - (gameState.player.x + gameState.player.width / 2);
    const dy = mouseY - (gameState.player.y + gameState.player.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
        const speed = 10;
        gameState.bullets.push({
            x: gameState.player.x + gameState.player.width / 2,
            y: gameState.player.y + gameState.player.height / 2,
            width: 5,
            height: 5,
            dx: (dx / distance) * speed,
            dy: (dy / distance) * speed,
            color: 'yellow'
        });

        gameState.player.bullets--;
    }
}

// Update bullets
function updateBullets(deltaTime) {
    for (let i = gameState.bullets.length - 1; i >= 0; i--) {
        const bullet = gameState.bullets[i];

        // Move bullet
        bullet.x += bullet.dx * deltaTime;
        bullet.y += bullet.dy * deltaTime;

        // Check if bullet is out of bounds
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            gameState.bullets.splice(i, 1);
            continue;
        }

        // Check collision with enemies
        for (let j = gameState.enemies.length - 1; j >= 0; j--) {
            const enemy = gameState.enemies[j];
            if (checkCollision(bullet, enemy)) {
                enemy.health -= 10; // Damage enemy
                gameState.bullets.splice(i, 1); // Remove bullet
                if (enemy.health <= 0) {
                    gameState.enemies.splice(j, 1); // Remove enemy if dead
                }
                break;
            }
        }
    }
}

// Generate enemies
function generateEnemies(count) {
    for (let i = 0; i < count; i++) {
        const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        let x, y;

        switch (side) {
            case 0: // top
                x = Math.random() * canvas.width;
                y = -enemyType.height;
                break;
            case 1: // right
                x = canvas.width;
                y = Math.random() * canvas.height;
                break;
            case 2: // bottom
                x = Math.random() * canvas.width;
                y = canvas.height;
                break;
            case 3: // left
                x = -enemyType.width;
                y = Math.random() * canvas.height;
                break;
        }

        gameState.enemies.push({
            ...enemyType,
            x: x,
            y: y,
            health: enemyType.health
        });
    }
}

// Update enemies
function updateEnemies(deltaTime) {
    const currentTime = Date.now();

    gameState.enemies.forEach(enemy => {
        // Move towards player
        const dx = gameState.player.x - enemy.x;
        const dy = gameState.player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            enemy.x += (dx / distance) * enemy.speed * deltaTime;
            enemy.y += (dy / distance) * enemy.speed * deltaTime;
        }

        // Check collision with player
        if (checkCollision(enemy, gameState.player) &&
            currentTime - gameState.lastDamageTime > gameState.damageInterval) {
            gameState.player.health -= enemy.damage;
            gameState.lastDamageTime = currentTime;

            if (gameState.player.health <= 0) {
                gameState.gameOver = true;
            }
        }
    });
}

// Generate ammo crates
function generateAmmoCrates(count) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * (canvas.width - 40) + 20;
        const y = Math.random() * (canvas.height - 40) + 20;
        gameState.ammoCrates.push({
            x: x,
            y: y,
            width: 40,
            height: 20,
            ammo: 5 // Bullets per crate
        });
    }
}

// Update ammo crates
function updateAmmoCrates() {
    for (let i = gameState.ammoCrates.length - 1; i >= 0; i--) {
        const crate = gameState.ammoCrates[i];
        if (checkCollision(gameState.player, crate)) {
            gameState.player.bullets += crate.ammo;
            gameState.ammoCrates.splice(i, 1);
        }
    }
}

// Update player
function updatePlayer(deltaTime) {
    if (keys.w) gameState.player.y -= gameState.player.speed * deltaTime;
    if (keys.s) gameState.player.y += gameState.player.speed * deltaTime;
    if (keys.a) gameState.player.x -= gameState.player.speed * deltaTime;
    if (keys.d) gameState.player.x += gameState.player.speed * deltaTime;

    // Keep player in bounds
    gameState.player.x = Math.max(0, Math.min(canvas.width - gameState.player.width, gameState.player.x));
    gameState.player.y = Math.max(0, Math.min(canvas.height - gameState.player.height, gameState.player.y));
}

// Update game
function update(deltaTime) {
    const currentTime = Date.now();

    updatePlayer(deltaTime);
    updateBullets(deltaTime);
    updateEnemies(deltaTime);
    updateAmmoCrates();

    // Spawn enemies
    if (currentTime - gameState.lastSpawnTime > gameState.spawnInterval) {
        generateEnemies(1);
        // Occasionally spawn ammo crate
        if (Math.random() < 0.3) { // 30% chance
            generateAmmoCrates(1);
        }
        gameState.lastSpawnTime = currentTime;
    }

    // Update UI
    document.getElementById('health').textContent = Math.max(0, Math.floor(gameState.player.health));
    document.getElementById('bullets').textContent = gameState.player.bullets;
    document.getElementById('health-bar').style.width = `${Math.max(0, gameState.player.health)}%`;
}

// Draw game
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player (orange cube)
    ctx.fillStyle = 'orange';
    ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);

    // Draw aim line
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gameState.player.x + gameState.player.width / 2, gameState.player.y + gameState.player.height / 2);
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();

    // Draw bullets
    gameState.bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw enemies
    gameState.enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Draw ammo crates
    gameState.ammoCrates.forEach(crate => {
        ctx.fillStyle = 'brown';
        ctx.fillRect(crate.x, crate.y, crate.width, crate.height);
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('AMMO', crate.x + crate.width / 2, crate.y + crate.height / 2 + 4);
    });

    // Draw game over
    if (gameState.gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    }
}

// Game loop
let lastTime = 0;
function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 16.67; // Normalize to ~60 FPS
    lastTime = currentTime;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

// Start game
requestAnimationFrame(gameLoop);