window.addEventListener("load", () => {
  const sortableList = document.querySelector(".body-elements");
  const items = sortableList.querySelectorAll(".item");
  var list = document.getElementById("element-list");

  document.getElementById("add-body-pg").addEventListener("click", () => {
    list = document.getElementById("element-list");
    list.appendChild(generateElement("body", "", items.length));
    makeDraggable();
  });
  document.getElementById("add-pull-quote").addEventListener("click", () => {
    list = document.getElementById("element-list");
    list.appendChild(generateElement("pull", "", items.length));
    makeDraggable();
  });
});

function generateElement(type, text, index) {
  let textarea = document.createElement("textarea");
  textarea.classList.add("input-text", type);
  textarea.placeholder = type;
  textarea.innerHTML = text;
  let div = document.createElement("div");
  div.classList.add("details");
  div.appendChild(textarea);
  let deleteImg = document.createElement("img");
  deleteImg.id = `delete-item-${index}`;
  deleteImg.classList.add("ui-delete-element");
  deleteImg.src = "/public/assets/trashcan.webp";
  let dragImg = document.createElement("img");
  dragImg.classList.add("ui-draggable-dots");
  dragImg.src = "/public/assets/draggabledots.webp";
  let li = document.createElement("li");
  li.classList.add("item");
  li.draggable = true;
  li.appendChild(div);
  li.appendChild(deleteImg);
  li.appendChild(dragImg);
  return li;
}
