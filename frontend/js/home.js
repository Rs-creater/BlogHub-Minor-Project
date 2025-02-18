// // Initialize an array to store posts
// let posts = [
//     {
//         title: "Aman",
//         content: "first Image",
//         image: "Aman.png",
//         comment: "goof img"
//     }
// ];

// // Post creation functionality
// document.getElementById('createPostForm').addEventListener('submit', function (e) {
//     e.preventDefault();

//     const title = document.getElementById('postTitle').value;
//     const content = document.getElementById('postContent').value;
//     const imageFile = document.getElementById('postImage').files[0];

//     if (title && content && imageFile) {
//         const post = {
//             title,
//             content,
//             image: URL.createObjectURL(imageFile),
//             comments: [] // Each post starts with an empty comment array
//         };

//         // Add post to the posts array
//         posts.push(post);

//         // Clear the form fields
//         document.getElementById('postTitle').value = '';
//         document.getElementById('postContent').value = '';
//         document.getElementById('postImage').value = '';

//         // Call the function to render the posts
//         renderPosts();
//     }
// });

// // Render posts dynamically
// function renderPosts() {
//     const postsContainer = document.getElementById('postsContainer');
//     postsContainer.innerHTML = ''; // Clear existing posts

//     posts.forEach((post, index) => {
//         const postElement = document.createElement('div');
//         postElement.classList.add('post');

//         postElement.innerHTML = `
//             <img src="${posts.image}" alt="Post Image">
//             <h3>${posts.title}</h3>
//             <p>${posts.content}</p>
//             <button onclick="deletePost(${index})">Delete Post</button>
//             <button onclick="editPost(${index})">Edit Post</button>
//             <div class="comments-section">
//                 <h4>Comments</h4>
//                 <textarea class="comment-box" placeholder="Add a comment" oninput="autoResize(this)"></textarea>
//                 <button onclick="addComment(${index})">Comment</button>
//                 <div class="comments-list" id="comments-list-${index}">
//                     ${post.comments.map(comment => `<p>${comment}</p>`).join('')}
//                 </div>
//             </div>
//         `;
//         postsContainer.appendChild(postElement);
//     });
// }

// // Delete post functionality
// function deletePost(index) {
//     posts.splice(index, 1); // Remove the post from the array
//     renderPosts(); // Re-render the posts
// }

// // Edit post functionality
// function editPost(index) {
//     const post = posts[index];
//     const title = prompt('Edit Post Title:', post.title);
//     const content = prompt('Edit Post Content:', post.content);

//     if (title && content) {
//         post.title = title;
//         post.content = content;
//         renderPosts(); // Re-render the posts
//     }
// }

// // Add comment functionality
// function addComment(postIndex) {
//     const commentBox = document.querySelector(`#comments-list-${postIndex}`).previousElementSibling.previousElementSibling;
//     const commentText = commentBox.value;

//     if (commentText) {
//         posts[postIndex].comments.push(commentText);
//         renderPosts(); // Re-render the posts with updated comments
//     }

//     commentBox.value = ''; // Clear the comment box
// }

// // Auto resize the comment box
// function autoResize(element) {
//     element.style.height = 'auto';
//     element.style.height = (element.scrollHeight) + 'px';
// }

// // Call renderPosts initially to show any existing posts
// renderPosts();

const posts = [
  {
    title: "Goa Tourism",
    content:
      "East meets West in this sun-soaked state, where Indian culture intertwines with Portuguese influences left over from a 500-year occupation.",
    image: "goa.jfif",
  },
  {
    title: "Goa Tourism",
    content:
      "East meets West in this sun-soaked state, where Indian culture intertwines with Portuguese influences left over from a 500-year occupation.",
    image: "goa.jfif",
  },
  {
    title: "Goa Tourism",
    content:
      "East meets West in this sun-soaked state, where Indian culture intertwines with Portuguese influences left over from a 500-year occupation.",
    image: "goa.jfif",
  },
];

// Step 2: Get the posts container element from the DOM
const postsContainer = document.getElementById("postsContainer");

// Step 3: Loop through the posts array and use template literals to insert the posts into the HTML
posts.forEach((post) => {
  postsContainer.innerHTML += `
                <div class="post">
                    <img src="${post.image}" alt="Post Image">
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <button>Manage Post</button>
                </div>
            `;
});
