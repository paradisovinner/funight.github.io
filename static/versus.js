document.addEventListener('DOMContentLoaded', function changeGif(option) {
    const gifContainer = document.getElementById('gif');
    const gifs = {
        indoor: [
            "https://tenor.com/view/spongebob-indoors-gif-13526077",
            "https://tenor.com/view/inside-good-outside-bad-outside-friends-joey-oo-gif-5333232",
            "https://tenor.com/view/the-office-peek-michael-scott-stay-indoors-way-too-peopley-gif-16640677",
            "https://tenor.com/view/pokemon-pikachu-eevee-lets-stay-home-rainy-day-gif-16650283",
            "https://tenor.com/view/cute-aww-dog-puppy-gif-14694340",
        ],
        outdoor: [
            "https://tenor.com/view/cool-cat-cool-kitty-cat-kitty-shades-gif-15826740",
            "https://tenor.com/view/up-wilderness-explore-disneyupkid-russell-gif-5707412",
            "https://tenor.com/view/dancing-dance-dancing-baby-baby-toddler-gif-12903266",
            "https://tenor.com/view/were-going-out-spongebob-gif-11755122",
            "https://tenor.com/view/head-bang-rock-kids-play-gif-3572636",
        ]
    };

    const randomGif = gifs[option][Math.floor(Math.random() * gifs[option].length)];
    gifContainer.src = randomGif;

    // Generate a random option on page load
    const randomOption = Math.random() < 0.5 ? 'indoor' : 'outdoor';
    changeGif(randomOption);
});

<script type="text/javascript" async src="https://tenor.com/embed.js"></script>