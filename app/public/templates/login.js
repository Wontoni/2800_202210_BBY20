module.exports = {
    HTML: (text) => {
        return `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
            <title>Login | Unified</title>
        
            <!-- Favicon -->
            <link rel="icon" type="image/png" href="/public/assets/logo/un-logo-mini.svg">
        
            <!-- Adobe Fonts (Obviously Wide + Nunito Sans) -->
            <link rel="stylesheet" href="https://use.typekit.net/xup5ffl.css">
        
            <!-- Custom CSS -->
            <link rel="stylesheet" href="/public/css/global.css">
            <link rel="stylesheet" href="/public/css/login.css">
        </head>
        
        <body>
        
            <div class="wrapper">
                <div class="login-section">
                    <div class="section-left">
                        <div class="container">
                            <div class="login-form">
                                <h2>Welcome back</h2>
                                <form action="/login-process" method="POST">
                                    <div class="errorMsg">${text}</div>
                                    <div class="form-group">
                                        <label for="username">Username  </label>
                                        <input type="text" class="input" id="username" name="username"
                                            placeholder="Enter your username" required>
                                        <small id="usernameError" class="form-error">*Please check your username.</small>
                                    </div>
        
                                    <div class="form-group">
                                        <label for="userPassword">Password</label>
                                        <input type="password" class="input" id="userPassword" name="password"
                                            placeholder="Enter your password" required>
                                        <small id="userPasswordError" class="form-error">*Please check your password.</small>
                                    </div>
        
                                    <button type="submit" class="primary-button">Login</button>
                                </form>
                                <p>Don't have an account yet? <a href="/sign-up" class="text-button">Sign Up Now</a></p>
                            </div>
                        </div>
                    </div>
        
                    <div class="section-right">
                        <img src="/public/assets/logo/un-logo-primary_white.svg" alt="Unified logo in white">
                    </div>
                </div>
            </div>
            <!-- Custom JS -->
            <script src="/public/js/skeleton.js"></script>
            <script src="/public/js/global.js"></script>
        </body>
        
        </html>
        `;
    }
}