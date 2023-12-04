document.getElementById('releaseButton').addEventListener('click', function() {
    const balloonContainer = document.getElementById('balloonContainer');
    const colors = ['#E95793', '#C2D9FF', '#940B92', '#7752FE', '#FFE5E5', '#E5CFF7']; // Array of balloon colors

    // Create and release multiple balloons
    for (let i = 0; i <6; i++) {
        // Create a new balloon element
        const balloon = document.createElement('div');
        balloon.className = 'balloon';

        // Randomly select a color from the array
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // Set the background color of the balloon
        balloon.style.backgroundColor = randomColor;

        // Set a random position for the balloon
        const randomX = Math.random() * 90; // Horizontal position
        balloon.style.left = randomX + 'vw';

        // Add the balloon to the container
        balloonContainer.appendChild(balloon);

        // Remove the balloon when it rises
        balloon.addEventListener('animationiteration', function() {
            balloonContainer.removeChild(balloon);
        });
    }
});
