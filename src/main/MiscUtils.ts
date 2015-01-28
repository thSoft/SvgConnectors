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

}