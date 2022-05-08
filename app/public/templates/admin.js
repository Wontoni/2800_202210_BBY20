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
        </head>
        <body>
            <h1>Admin Dashboard</h1>
            <a href="/sign-out"><button id="sign-out">Sign Out</button></a>
            <h3>List of Users</h3>
            <div id="user-list">
            ${text}
            </div>
            <script src="/public/js/admin.js"></script>
        </body>
        </html>
        `;
    }
}