const allStars = [...document.getElementsByClassName("star")];
const allResult = document.querySelector(".result");

printRatingResult(allResult);

function executeRating(stars, result) {
    const starClassActive = "star";
    const starClassUnactive = "star_border";
    const starsLength = stars.length;
    let i;
    
    stars.map((star) => {
        star.onclick = () => {
            i = stars.indexOf(star);

            if (star.textContent.indexOf(starClassUnactive) !== -1) {
                printRatingResult(result, i + 1);
                for (i; i >= 0; --i) stars[i].textContent = starClassActive;
            } else {
                printRatingResult(result, i);
                for (i; i < starsLength; ++i) stars[i].textContent = starClassUnactive;
            }
        };
    });
}

function printRatingResult(result, num = 0) {
    result.textContent = num;
}

executeRating(allStars, allResult);