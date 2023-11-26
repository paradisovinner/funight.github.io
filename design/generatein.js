function generateResult() {
    // Show loading animation
    document.getElementById('loading').style.display = 'block';

    // Simulate an asynchronous operation (e.g., fetching data from a server)
    setTimeout(() => {
        const mealOptions = ['Italian Pasta', 'Grilled Chicken Caesar Salad', 'Vegetarian Sushi Rolls', 'BBQ Pulled Pork Sandwiches', 'Shrimp Pad Thai', 'Margherita Pizza', 'Beef Stir-Fry', 'Spinach and Feta Stuffed Chicken', 'Veggie-loaded Quinoa Bowl', 'Salmon with Lemon-Dill Sauce'];
        const dessertOptions = ['Chocolate Fondue', 'Cheesecake', 'Strawberry Shortcake', 'Tiramisu', 'Mango Sorbet', 'Red Velvet Cupcakes', 'Apple Pie', 'Chocolate Mousse', 'Lemon Bars', 'Peanut Butter Cookies'];
        const activityOptions = ['Movie Night', 'Board Game Marathon', 'DIY Paint and Sip Night', 'Indoor Picnic', 'Virtual Reality Gaming', 'Cooking Class Together', 'Puzzle Challenge', 'Home Spa Night', 'Karaoke Party', 'Learn a Dance Routine'];
        const endingOptions = ['Cuddling under Blankets with a Movie', 'Romantic Stargazing', 'Candlelit Bubble Bath', 'Massage Exchange', 'DIY Home Spa', 'Late-night Walk', 'Cozying Up with a Book', 'Sharing Secrets and Dreams', 'Soft Music and Relaxing', 'Planning Future Adventures'];

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

// Initial result generation on page load
generateResult();