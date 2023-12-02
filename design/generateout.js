let mealOptions = [];
let dessertOptions = [];
let activityOptions = [];
let endingOptions = [];

function generateResult() {
    // Show loading animation
    document.getElementById('loading').style.display = 'block';

    // Simulate an asynchronous operation (e.g., fetching data from a server)
    setTimeout(() => {
        mealOptions = ['Italian Pasta', 'BBQ Meats', 'Sushi Night', 'Mediterranean', 'Mexican fiesta', 'Italian Pizzas', 'Veggie Delight', 'Diner Classics', 'Veggie Bowl', 'Seafood Party'];
        dessertOptions = ['Chocolate Fondue', 'Cheesecake', 'Strawberry Shortcake', 'Tiramisu', 'Artisanal Gelato', 'French bakery', 'Apple Pie', 'Gourmet Donuts', 'Frozen yogurt', 'Dessert Bar'];
        activityOptions = ['Movie Theatre', 'Outdoor Movie', 'Picnic in a Park', 'Hiking Adventure', 'Camping Under Stars', 'Midnight Arcade', 'Bar Hopping', 'Casino Night', 'Karaoke Party', 'Escape Room'];
        endingOptions = ['Cuddling under Blankets with a Movie', 'Stargazing', 'Candlelit Bubble Bath', 'Massage Exchange', 'DIY Home Spa', 'Late-night Walk', 'Cozying Up with a Book', 'Sharing Secrets and Dreams', 'Soft Music and Relaxing', 'Planning Future Adventures'];

        // Randomly select options for each category
        const randomMeal = mealOptions[Math.floor(Math.random() * mealOptions.length)];
        const randomDessert = dessertOptions[Math.floor(Math.random() * dessertOptions.length)];
        const randomActivity = activityOptions[Math.floor(Math.random() * activityOptions.length)];
        const randomEnding = endingOptions[Math.floor(Math.random() * endingOptions.length)];

        // Display the results
        document.getElementById('meal-result').innerText = randomMeal;
        document.getElementById('dessert-result').innerText = randomDessert;
        document.getElementById('activity-result').innerText = randomActivity;
        document.getElementById('ending-result').innerText = randomEnding;

        // Hide loading animation
        document.getElementById('loading').style.display = 'none';
    }, 2000); // Simulate a delay of 2000 milliseconds (2 seconds)
}


function updateGenerator(options) {
    // Update generator options with the received personalized options
    mealOptions = options.meals;
    dessertOptions = options.desserts;
    activityOptions = options.activities;
    endingOptions = options.endofnight;

    // Rest of the update logic...
}

// Function to fetch personalized options from the server
function fetchPersonalizedOptions() {
    // Fetch options from the server using an AJAX request
    fetch('/getOptions')
        .then(response => response.json())
        .then(options => {
            // Update the generator options with personalized options
            updateGenerator(options);

            // Call the existing result generation logic
            generateResult();
        })
        .catch(error => console.error('Error fetching personalized options:', error));
}

// Initial result generation on page load, including fetching personalized options
fetchPersonalizedOptions();