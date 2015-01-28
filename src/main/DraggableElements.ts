///<reference path="MiscUtils.ts"/>

module DraggableElements {

  export function manage() {
    var format = "text/plain";
    MiscUtils.toArray(document.querySelectorAll("[draggable=true]")).forEach(node => {
      var element = <HTMLElement>node;
      element.ondragstart = event => {
        event.dataTransfer.setData(format, element.id);
      };
    });
    document.ondragover = event => {
      var draggedElement = document.getElementById(event.dataTransfer.getData(format));
      draggedElement.style.left = event.pageX.toString() + "px";
      draggedElement.style.top = event.pageY.toString() + "px";
    };
  }

}