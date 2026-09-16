W02 Coaching Session: Database Retrieval
1. Relational Database Design and Structure

The database uses related tables to organize information efficiently. In this example, the users table stores information about users, while the posts table stores posts created by users. The user_id in the posts table establishes a relationship between the two tables.

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE posts (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


This relationship allows the application to connect each post with the user who created it.

2. Server-Side Data Access Logic (Node.js)

The Node.js function retrieves information from the database. It sends an SQL query to the database and returns the results to the application.

async function getPosts() {
    const result = await db.all(`
        SELECT posts.title, users.name
        FROM posts
        JOIN users ON posts.user_id = users.id
    `);

    return result;
}


The function retrieves the post title and the name of the user who created the post. The JOIN statement connects related records from the posts and users tables.

3. Express Server Logic and Routing

The Express route handler connects a URL path to the appropriate server-side function. When a user visits /posts, Express calls the getPosts() function and then sends the retrieved data to the EJS template.

app.get('/posts', async (req, res) => {
    const posts = await getPosts();
    res.render('posts', { posts });
});


The /posts path is mapped to this route handler. The retrieved database information is passed to the EJS template through the posts variable.

4. Client-Side Rendering (EJS Templates)

The EJS template receives the data from the Express route and uses it to generate HTML. EJS allows JavaScript to be embedded in the HTML so that database records can be displayed dynamically.

<h1>Posts</h1>

<ul>
    <% posts.forEach(post => { %>
        <li>
            <strong><%= post.title %></strong>
            by <%= post.name %>
        </li>
    <% }); %>
</ul>


The data flows from the database → Node.js function → Express route → EJS template → webpage. This process allows information stored in the database to be retrieved and dynamically displayed to the user.

Conclusion

The database retrieval process demonstrates how the different parts of a web application work together. The relational database stores connected information, Node.js retrieves the data, Express handles the request and route, and the EJS template displays the retrieved information to the user.