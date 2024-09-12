// DLA - Diffusion Limited Aggregation

function generate_empty_matrix(size) {
    let matrix = new Array(size);
    for (let i = 0; i < size; i++) {
        matrix[i] = new Array(size);
        for (let j = 0; j < size; j++) {
            matrix[i][j] = 0;
        }
    }
    return matrix;
}

function has_neighboring_particle(matrix, x, y) {
    let directions = [
        [1, 0],  // Right
        [-1, 0], // Left
        [0, 1],  // Down
        [0, -1]  // Up
    ];

    for (let dir of directions) {
        let newX = x + dir[0];
        let newY = y + dir[1];

        // Ensure newX and newY are within bounds
        if (newX >= 0 && newX < matrix.length && newY >= 0 && newY < matrix.length) {
            if (matrix[newX][newY] === 1) {
                return true;
            }
        }
    }
    return false;
}

function randomWalk(matrix, x, y) {
    let directions = [
        [1, 0],  // Right
        [-1, 0], // Left
        [0, 1],  // Down
        [0, -1]  // Up
    ];

    let dir = directions[Math.floor(Math.random() * directions.length)];
    let newX = x + dir[0];
    let newY = y + dir[1];

    // Ensure the particle stays within bounds
    if (newX >= 0 && newX < matrix.length && newY >= 0 && newY < matrix.length) {
        return { x: newX, y: newY };
    }

    // If out of bounds, return the original position
    return { x, y };
}

function drawMatrix(matrix, canvas, cellSize) {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas

    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            if (matrix[x][y] === 1) {
                ctx.fillStyle = 'black';  // Particle color
            } else {
                ctx.fillStyle = 'white';  // Empty space color
            }
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function expand_matrix(matrix, new_size) {
    let old_size = matrix.length;
    let new_matrix = generate_empty_matrix(new_size);

    let offset = Math.floor((new_size - old_size) / 2);

    // Copy old matrix to the center of the new matrix
    for (let x = 0; x < old_size; x++) {
        for (let y = 0; y < old_size; y++) {
            new_matrix[x + offset][y + offset] = matrix[x][y];
        }
    }

    return new_matrix;
}

function DLA(init_size, matrix_fullness, number_iterations, delay, matrix_increase_per_iteration) {
    let current_size = init_size;
    let matrix = generate_empty_matrix(init_size);
    let x = Math.floor(init_size / 2);
    let y = Math.floor(init_size / 2);
    let num_particles = 1;
    matrix[x][y] = 1;

    let canvas = document.getElementById('dlaCanvas');
    let cellSize = canvas.width / current_size;

    drawMatrix(matrix, canvas, cellSize);

    let iteration = 0;

    function runSimulationStep() {
        if (num_particles >= matrix_fullness * current_size * current_size) {
            if (iteration < number_iterations) {
                // Increase matrix size
                current_size += matrix_increase_per_iteration; 
                matrix = expand_matrix(matrix, current_size);
                cellSize = canvas.width / current_size;
                drawMatrix(matrix, canvas, cellSize);
                iteration++;
            } else {
                return;  // Stop when max iterations reached
            }
        }

        // Particle random movement until it finds a neighbor
        let position = { x: Math.floor(Math.random() * current_size), y: Math.floor(Math.random() * current_size) };
        while (!has_neighboring_particle(matrix, position.x, position.y)) {
            position = randomWalk(matrix, position.x, position.y);
        }

        if (matrix[position.x][position.y] === 0) {
            matrix[position.x][position.y] = 1;
            num_particles += 1;
            drawMatrix(matrix, canvas, cellSize);
        }

        // Continue the simulation step with a delay
        setTimeout(runSimulationStep, delay);
    }

    runSimulationStep();
}


document.getElementById('startButton').addEventListener('click', () => {
    // Get user inputs
    let initSize = parseInt(document.getElementById('initSize').value);
    let matrixFullness = parseFloat(document.getElementById('fullness').value);
    let numberIterations = parseInt(document.getElementById('iterations').value);
    let delay = parseInt(document.getElementById('delay').value);
    let matrixIncreasePerIteration = parseInt(document.getElementById('increase').value);

    // Clear canvas before starting
    let canvas = document.getElementById('dlaCanvas');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Start the simulation with user-defined parameters
    DLA(initSize, matrixFullness, numberIterations, delay, matrixIncreasePerIteration);
});

// Update labels when sliders are changed
document.getElementById('initSize').addEventListener('input', (e) => {
    document.getElementById('initSizeValue').textContent = e.target.value;
});
document.getElementById('fullness').addEventListener('input', (e) => {
    document.getElementById('fullnessValue').textContent = e.target.value;
});
