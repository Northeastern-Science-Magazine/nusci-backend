window.addEventListener("load", () => {
  const sortableList = document.querySelector(".body-elements");
  const items = sortableList.querySelectorAll(".item");
  var list = document.getElementById("element-list");

  updateFormFields();

  document.getElementById("add-body-pg").addEventListener("click", () => {
    list = document.getElementById("element-list");
    list.appendChild(generateElement("body", "", items.length));
    makeDraggable();
    updateFormFields();
  });
  document.getElementById("add-pull-quote").addEventListener("click", () => {
    list = document.getElementById("element-list");
    list.appendChild(generateElement("pull", "", items.length));
    makeDraggable();
    updateFormFields();
  });
});

function generateElement(type, text, index) {
  //textarea
  let textarea = document.createElement("textarea");
  textarea.classList.add("input-text", type);
  textarea.placeholder = type;
  textarea.innerHTML = text;

  //div to contain the textarea
  let div = document.createElement("div");
  div.classList.add("details");
  div.appendChild(textarea);

  //delete image icon
  let deleteImg = document.createElement("img");
  deleteImg.id = `delete-item-${index}`;
  deleteImg.classList.add("ui-delete-element");
  deleteImg.src = "/public/assets/trashcan.webp";

  //draggable dots icon
  let dragImg = document.createElement("img");
  dragImg.classList.add("ui-draggable-dots");
  dragImg.src = "/public/assets/draggabledots.webp";

  //list element object to contain all
  let li = document.createElement("li");
  li.classList.add("item");
  li.draggable = true;
  li.appendChild(div);
  li.appendChild(deleteImg);
  li.appendChild(dragImg);
  return li;
}

function updateFormFields() {
  const bps = JSON.stringify(getAllBodyParagraphs());
  const pqs = JSON.stringify(getAllPullQuotes());
  const order = JSON.stringify(getOrder());

  document.getElementById("body-list").value = bps;
  document.getElementById("pull-list").value = pqs;
  document.getElementById("order").value = order;
}

//may want to abstract in the future when there are more dynamic text-based elements

function getAllBodyParagraphs() {
  const bodyElements = document.querySelectorAll(".body");
  const bodyParagraphs = [];
  for (let bp of bodyElements) {
    bodyParagraphs.push(bp.value);
  }
  return bodyParagraphs;
}

function getAllPullQuotes() {
  const pullElements = document.querySelectorAll(".pull");
  const pullQuotes = [];
  for (let pq of pullElements) {
    pullQuotes.push(pq.value);
  }
  return pullQuotes;
}

function getOrder() {
  const elements = document.querySelectorAll(".body, .pull");
  const order = [];
  for (let e of elements) {
    if (e.classList.contains("body")) {
      order.push("body");
    } else if (e.classList.contains("pull")) {
      order.push("pull");
    }
  }
  return order;
}
