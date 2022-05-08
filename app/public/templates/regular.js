module.exports = {
    HTML: (text) => {
        return `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Unified</title>
            <link rel="stylesheet" href="../public/css/mainpage.css">
        
            <!-- Fonts (Obviously Wide + Nunito Sans) -->
            <link rel="stylesheet" href="https://use.typekit.net/xup5ffl.css ">
        
            <!-- JQuery -->
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        
            <!-- Google Icons -->
            <link rel="stylesheet"
                href="https://fonts.sandbox.google.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,700,0,0" />
        </head>
        
        <body>
            <div class="userContainer">
                <div class="userNav">
                    <!-- Logo -->
                    <div id="logo">
                        <img src="../public/assets/logo/un-logo-mini_white.svg" alt="Unified logo in white">
                    </div>
        
                    <!-- Search Bar -->
                    <div class="searchForm">
                        <form>
                            <input class="searchIcon" type="text" name="search" placeholder="Search">
                        </form>
                    </div>
        
                    <div class="icons">
                        <button class="postBtn">Create</button> 
                        <button class="tipsBtn">Tips</button>
                        <button class="scheduleBtn">Schedule</button>
                        <button class="homeBtn">Home</button>
                    </div>

                    <!-- Profile Picture -->
                    <div id="dropdown">
                            ${text}
                            <img id="profilePic" src="../public/assets/homepage/kindpng_214439.png" alt="Default Profile Picture">
                            <div class="userProfileName">
                                <button class="media" id="sign-out">Log Out</button>
                            </div>
                        <div class="dropdownProfile">
                            <a href="#profilePage">Profile</a>
                            <a href="#settings">Settings</a>
                            <a href="/sign-out">Log Out</a>
                        </div>
                    </div>
                </div>

                    <div class="userContent">
                    <!-- Threads will be placed into here -->
                    <div class="cardPlaceholder"></div>

                    <div class="noPosts">
                        Oh no! Looks like there are no posts! Be the first to post a thread! (Not yet available)
                    </div>
                </div>
                <div class="userFooter">
                    BBY20
                </div>
            </div>

            <script src="../public/js/mainpage.js"></script>
            <script src="/public/js/user.js"></script>

            <!-- Jquery -->
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        </body>

        </html>
        `;
    }
}