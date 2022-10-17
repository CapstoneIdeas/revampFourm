import CreateView from "../createView.js"
import {getHeaders, isLoggedIn} from "../auth.js";

let posts;
export default function prepareUserHTML(props) {
    const postsHTML = generatePostsHTML(props.posts);
    posts = props.posts
    return `
    <header>
        <h2>User Blog</h2>
    </header>
    <main>
        <div class= 'userContainer'>
            <div class= 'userLeftDiv'>
                <div class= 'userInfoDiv'>
                    
                </div>
                <div class= 'newPostDiv'>
                    <h3>New Blog Entry: </h3>
                    <form action="">
                        <label for="title">Title</label><br>
                        <input id="title" name="title" type="text" placeholder="Enter a title..."><br>
                        <label for="content">Content</label><br>
                        <textarea name="content" id="content" cols="50" rows="10" placeholder="Enter some content..."></textarea>
                        <button id="addPost" name="addPost">Add blog</button>
                    </form>
                </div>
            </div>
            <div class= 'userRightDiv'>
                <h3>Blog History</h3>
                <div class= 'userPostHistory'> ${postsHTML} </div>
            </div>
        </div>
    </main>
    `;
}

// GENERATE TABLE OF POSTS WITH EDIT AND DELETE OPTION
function generatePostsHTML(posts) {
    let postsHTML = `
        <table class="table">
        <thead>
        <tr>
            <th scope="col">Title</th>
            <th scope="col" colspan="3">Content</th>
        </tr>
        </thead>
        <tbody>
    `;

    // CHECK(LOG) POSTS
    // console.log(posts);

    if(posts) {
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            let categories = '';
            for (let j = 0; j < post?.categories?.length; j++) {
                if(categories !== "") {
                    categories += ", ";
                }
                categories += post.categories[j].name;
            }
            postsHTML += `<tr>
                <td>${post?.title}</td>
                <td>${post?.content}</td>
                <td>${categories}</td>
                <td data-user-id=${post?.author?.id}>${post?.author?.userName}</td>
                <td><button data-id=${post.id} class="button btn-primary editPost">Edit</button></td>
                <td><button data-id=${post.id} class="button btn-danger deletePost">Delete</button></td>
                </tr>`;
        }
    }
    postsHTML += `</tbody></table>`;
    return postsHTML;
}

// EXPORT FUNCTION FOR CRUD METHODS
export function blogSetup() {
    addPostHandler();
    editPostHandlers();
    deletePostHandlers();
}

// CREATE A BLOG POST
function addPostHandler(){
    const addButton = document.querySelector("#addPost")
    addButton.addEventListener("click", function (event) {
        const titleField =  document.querySelector("#title");
        const contentField = document.querySelector("#content");
        if(isLoggedIn()){
        if((titleField.value === "") || (contentField.value === "")) {
            console.log("Content required");
        }
        else {
            let newPost = {
                title: titleField.value,
                content: contentField.value,
            }
            console.log(newPost);
            let request = {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(newPost)
            }
            fetch("http://localhost:8080/api/posts", request)
                .then(response => {
                    console.log(response.status);
                    CreateView("/user");
                })
        }}
        else{
            console.log("Login required");
        }
    })
}  

// UPDATE A BLOG POST
function editPostHandlers() {
    const editButtons = document.querySelectorAll(".editPost");
    const titleField =  document.querySelector("#title");
    const contentField = document.querySelector("#content");
    for (let i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener("click", function(event) {
            console.log(editButtons[i].getAttribute("data-id") + "will be edited");
            if(isLoggedIn()){
            if((titleField.value === "") || (contentField.value === "")) {
                console.log("Content required");
            }
            else{
            let editPost = {
                title: titleField.value,
                content: contentField.value,
            }
            let request = {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(editPost)
            }
            let url = `http://localhost:8080/api/posts/${editButtons[i].getAttribute("data-id")}`;
            fetch(url, request).then(response => response.json());
            location.reload();
        }}
        else{
            console.log("Login required");
        }});
    }
}

// DELETE A BLOG POST
function deletePostHandlers() {
    const deleteButtons = document.querySelectorAll(".deletePost");
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", function (event) {
            if (isLoggedIn()){
            console.log(deleteButtons[i].getAttribute("data-id") + "will be deleted");
            let request = {
                method: "DELETE",
                headers: getHeaders(),
            }
            let url = `http://localhost:8080/api/posts/${deleteButtons[i].getAttribute("data-id")}`
            fetch(url, request).then(response => response.json());
            location.reload();

        }
    else{
            console.log("Login required");
        }});
    }
}




// PREVIOUS CREATE POST FUNCTION
// function createPostHTML(user) {
//     let html = `
//         <table class="table">
//         <thead>
//         <tr>
//             <th scope="col">Title</th>
//             <th scope="col">Content</th>
//         </tr>
//         </thead>
//         <tbody>
//     `;
//     for (let i = 0; i < user.posts.length; i++) {
//         const post = user.posts[i];
//         html += `<tr>
//             <td>${post.title}</td>
//             <td>${post.content}</td>
//             </tr>`;
//     }
//     html += `
//         </tbody>
//         </table>`;
//     return html;
// }

// PASSWORD HANDLER PRIOR TO GOOGLE LOGIN
// export function prepareUserJS() {
//     doTogglePasswordHandler();
//     doSavePasswordHandler();
// }
// function doSavePasswordHandler() {
//     const button = document.querySelector("#updatePassword");
//     button.addEventListener("click", function(event) {
//         const oldPasswordField = document.querySelector('#oldpassword');
//         const newPasswordField = document.querySelector('#newpassword');
//         const confirmPasswordField = document.querySelector('#confirmpassword');
//         const oldPassword = oldPasswordField.value;
//         const newPassword = newPasswordField.value;
//         const confirmPassword = confirmPasswordField.value;
//         const request = {
//             method: "PUT",
//         }
//         const url = `${BACKEND_HOST}/api/users/${me.id}/updatePassword?oldPassword=${oldPassword}&newPassword=${newPassword}`
//         fetch(url, request)
//             .then(function(response) {
//                 CreateView("/");
//             });
//     });
// }
// function doTogglePasswordHandler() {
//     const button = document.querySelector("#toggleShowPassword");
//     button.addEventListener("click", function(event) {
//         const oldPassword = document.querySelector("#oldpassword");
//         const newPassword = document.querySelector("#newpassword");
//         const confirmPassword = document.querySelector("#confirmpassword");
//         if(confirmPassword.getAttribute("type") === "password") {
//             confirmPassword.setAttribute("type", "text");
//             oldPassword.setAttribute("type", "text");
//             newPassword.setAttribute("type", "text");
//         } else {
//             confirmPassword.setAttribute("type", "password");
//             oldPassword.setAttribute("type", "password");
//             newPassword.setAttribute("type", "password");
//         }
//     });
// }