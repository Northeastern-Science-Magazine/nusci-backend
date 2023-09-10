// Add new category input field
function addCategory() {
    const categoriesContainer = document.getElementById("categories-container");
    const categoryRow = document.createElement("div");
    categoryRow.classList.add("category-row");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("category-input");
    input.name = "categories";
    input.placeholder = "Category";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.classList.add("remove-category");
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", function() {
        categoriesContainer.removeChild(categoryRow);
    });

    categoryRow.appendChild(input);
    categoryRow.appendChild(removeButton);
    categoriesContainer.appendChild(categoryRow);
}

// Add new image input field
function addImage() {
    const imagesContainer = document.getElementById("images-container");
    const imageRow = document.createElement("div");
    imageRow.classList.add("images-row");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("image-input");
    input.name = "images";
    input.placeholder = "Image";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.classList.add("remove-image");
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", function() {
        imagesContainer.removeChild(imagesRow);
    });

    imageRow.appendChild(input);
    imageRow.appendChild(removeButton);
    imagesContainer.appendChild(imageRow);
}

// Add new pull quote input field
function addPullquote() {
    const pullquotesContainer = document.getElementById("pullquotes-container");
    const pullquoteRow = document.createElement("div");
    pullquoteRow.classList.add("pullquotes-row");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("pullquote-input");
    input.name = "pullquotes";
    input.placeholder = "Pull Quote";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.classList.add("remove-pullquote");
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", function() {
        pullquotesContainer.removeChild(pullquotesRow);
    });

    pullquoteRow.appendChild(input);
    pullquoteRow.appendChild(removeButton);
    pullquotesContainer.appendChild(pullquoteRow);
}

// Add new source input field
function addSource() {
    const sourcesContainer = document.getElementById("sources-container");
    const sourceRow = document.createElement("div");
    sourceRow.classList.add("source-row");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("source-input");
    input.name = "sources";
    input.placeholder = "Source";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.classList.add("remove-source");
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", function() {
        sourcesContainer.removeChild(sourceRow);
    });

    sourceRow.appendChild(input);
    sourceRow.appendChild(removeButton);
    sourcesContainer.appendChild(sourceRow);
}

// Add new element input field
function addElement() {
    const elementOrderContainer = document.getElementById("elementOrder-container");
    const elementOrderRow = document.createElement("div");
    elementRow.classList.add("element-row");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("element-input");
    input.name = "elementOrder";
    input.placeholder = "Element";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.classList.add("remove-element");
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", function() {
        elementOrderContainer.removeChild(elementRow);
    });

    elementRow.appendChild(input);
    elementRow.appendChild(removeButton);
    elementOrderContainer.appendChild(elementRow);
}

// Add event listeners for each "Add" button
document.getElementById("add-category").addEventListener("click", addCategory);
document.getElementById("add-image").addEventListener("click", addImage);
document.getElementById("add-pullquote").addEventListener("click", addPullquote);
document.getElementById("add-source").addEventListener("click", addSource);
document.getElementById("add-element").addEventListener("click", addElement);

// Remove event listeners for dynamically added "Remove" buttons
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-category")) {
        event.target.parentElement.remove();
    }
    if (event.target.classList.contains("remove-image")) {
        event.target.parentElement.remove();
    }
    if (event.target.classList.contains("remove-pullquote")) {
        event.target.parentElement.remove();
    }
    if (event.target.classList.contains("remove-source")) {
        event.target.parentElement.remove();
    }
    if (event.target.classList.contains("remove-element")) {
        event.target.parentElement.remove();
    }
});