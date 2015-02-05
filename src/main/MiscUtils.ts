module MiscUtils {

  export function toArray(nodeList: NodeList): Array<Node> {
    return Array.prototype.slice.call(nodeList);
  }

  export function getCenter(rectangle: ClientRect): Point {
    return {
      x: getMedian(rectangle.left, rectangle.right),
      y: getMedian(rectangle.top, rectangle.bottom)
    };
  }

  export interface Point {
    x: number;
    y: number;
  }

  export function getMedian(a: number, b: number) {
    return Math.min(a, b) + Math.abs(a - b) / 2;
  }

  export function getIntersection(inner: Point, outer: Point, rectangle: ClientRect): Point {
    var height = outer.y - inner.y;
    var width = outer.x - inner.x;
    if (inner.x < outer.x) {
      var distanceFromRight = rectangle.right - inner.x;
      var rightY = inner.y + height * distanceFromRight / width;
      if ((rectangle.top <= rightY) && (rightY <= rectangle.bottom)) {
        return {
          x: rectangle.right,
          y: rightY
        };
      }      
    }
    if (outer.x < inner.x) {
      var distanceFromLeft = inner.x - rectangle.left;
      var leftY = inner.y - height * distanceFromLeft / width;
      if ((rectangle.top <= leftY) && (leftY <= rectangle.bottom)) {
        return {
          x: rectangle.left,
          y: leftY
        };
      }
    }
    if (inner.y < outer.y) {
      var distanceFromBottom = rectangle.bottom - inner.y;
      var bottomX = inner.x + width * distanceFromBottom / height;
      if ((rectangle.left <= bottomX) && (bottomX <= rectangle.right)) {
        return {
          x: bottomX,
          y: rectangle.bottom
        };
      }
    }
    if (outer.y < inner.y) {
      var distanceFromTop = inner.y - rectangle.top;
      var topX = inner.x - width * distanceFromTop / height;
      if ((rectangle.left <= topX) && (topX <= rectangle.right)) {
        return {
          x: topX,
          y: rectangle.top
        };
      }
    }
    return null;
  }

}