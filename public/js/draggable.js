function makeDraggable() {
  //clone to get rid of all existing event listeners
  let sortableListOld = document.querySelector(".body-elements");
  let sortableListNew = sortableListOld.cloneNode(true);
  sortableListOld.parentNode.replaceChild(sortableListNew, sortableListOld);
  const sortableList = document.querySelector(".body-elements");
  const items = sortableList.querySelectorAll(".item");

  items.forEach((item) => {
    item.addEventListener("dragstart", () => {
      // Adding dragging class to item after a delay
      setTimeout(() => item.classList.add("dragging"), 0);
    });
    // Removing dragging class from item on dragend event
    item.addEventListener("dragend", () => item.classList.remove("dragging"));
  });

  const initSortableList = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    // Getting all items except currently dragging and making array of them
    let siblings = [...sortableList.querySelectorAll(".item:not(.dragging)")];

    // Finding the sibling after which the dragging item should be placed
    let nextSibling = siblings.find((sibling) => {
      let scrollTop = (document.documentElement || document.body.parentNode || document.body).scrollTop;
      return e.clientY + scrollTop <= sibling.offsetTop + sibling.offsetHeight / 2;
    });

    // Inserting the dragging item before the found sibling
    sortableList.insertBefore(draggingItem, nextSibling);
  };

  sortableList.addEventListener("dragover", initSortableList);
  sortableList.addEventListener("dragenter", (e) => e.preventDefault());
}

makeDraggable();
