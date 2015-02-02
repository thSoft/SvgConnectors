declare module MiscUtils {
    function toArray(nodeList: NodeList): Array<Node>;
    function getCenter(rectangle: ClientRect): Point;
    interface Point {
        x: number;
        y: number;
    }
    function getMedian(a: number, b: number): number;
}
declare module DraggableElements {
    function manage(): void;
}
declare module SvgConnectors {
    function manage(): void;
}
