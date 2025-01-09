// DOM Elements
const newPostBtn = document.getElementById('new-post-btn');
const modal = document.getElementById('new-post-form');
const closeForm = document.getElementById('close-form');
const finishPostBtn = document.getElementById('finish-post-btn');
const nameInput = document.getElementById('name');
const blogTextInput = document.getElementById('blog-text');
const imageUpload = document.getElementById('image-upload');
const wallPostsContainer = document.getElementById('wall-posts');
const imagePreviewOverlay = document.getElementById('image-preview-overlay');
const closeImageBtn = document.getElementById('close-image-btn');

// Open the modal
newPostBtn.addEventListener('click', () => {
    modal.style.display = "block";
});

// Close the modal
closeForm.addEventListener('click', () => {
    modal.style.display = "none";
});

// Handle post submission
finishPostBtn.addEventListener('click', () => {
    let name = nameInput.value.trim();
    const text = blogTextInput.value.trim();
    const imageFile = imageUpload.files[0];

    // Check if the name is empty, and prompt for previously entered name if applicable
    if (name === "") {
        const storedName = localStorage.getItem('username');
        if (storedName) {
            name = storedName; // Use previously entered name if available
        } else {
            alert("Please enter a name!");
            return;
        }
    } else {
        // Save name to localStorage for future use
        localStorage.setItem('username', name);
    }

    if (text || imageFile) {
        const date = new Date().toLocaleString();

        let image = null;
        if (imageFile) {
            // Convert image to base64 string to persist it across page reloads
            const reader = new FileReader();
            reader.onloadend = function () {
                image = reader.result; // Store the base64 image
                savePostToLocalStorage(name, text, date, image);
            };
            reader.readAsDataURL(imageFile); // Convert to base64
        } else {
            savePostToLocalStorage(name, text, date, image);
        }
    }
});

// Function to save post to localStorage
function savePostToLocalStorage(name, text, date, image) {
    const post = { name, text, date, image };

    // Save post to localStorage
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));

    // Add post to the wall
    displayPosts();

    // Clear input fields
    nameInput.value = '';
    blogTextInput.value = '';
    imageUpload.value = '';

    // Close the modal
    modal.style.display = "none";
}

// Display posts from localStorage
function displayPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    wallPostsContainer.innerHTML = '';
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        let imageSection = '';
        if (post.image) {
            imageSection = `
                <button class="see-image-btn" onclick="showImage('${post.image}')">See Image</button>
            `;
        }

        postDiv.innerHTML = `
            <strong>${post.name}</strong> <em>(${post.date})</em>
            <p>${post.text}</p>
            ${imageSection}
        `;
        wallPostsContainer.appendChild(postDiv);
    });
}

// Show the image in the overlay
function showImage(imageUrl) {
    // Set the image URL in the overlay
    imagePreviewOverlay.querySelector('img').src = imageUrl;
    imagePreviewOverlay.style.display = 'flex'; // Show the overlay
    document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'; // Darken the background
}

// Close the image overlay
closeImageBtn.addEventListener('click', () => {
    imagePreviewOverlay.style.display = 'none'; // Hide the overlay
    document.body.style.backgroundColor = ''; // Restore the background
});

// Display posts when the page loads
window.onload = displayPosts;
