///<reference path="MiscUtils.ts"/>

module SvgConnectors {

  export function manage() {
    refreshAll();
    document.addEventListener("DOMSubtreeModified", refreshAll);
  }

  function refreshAll() {
    var sourceAttribute = "data-source";
    var targetAttribute = "data-target";
    var connectors = MiscUtils.toArray(document.querySelectorAll("["+sourceAttribute+"]["+targetAttribute+"]"));
    connectors.forEach(node => {
      var connector = <Element>node;
      var source = document.getElementById(connector.getAttribute(sourceAttribute));
      var target = document.getElementById(connector.getAttribute(targetAttribute));
      connect(connector, source, target);
    });
  }

  function connect(connectorNode: Node, source: Element, target: Element) {
    refresh(connectorNode, source, target);
    observe(source, connectorNode, source, target);
    observe(target, connectorNode, source, target);
  }

  function refresh(connectorNode: Node, source: Element, target: Element) {
    if (connectorNode instanceof SVGElement) {
      var connector = <SVGElement>connectorNode;
      var sourceRect = source.getBoundingClientRect();
      var targetRect = target.getBoundingClientRect();
      var sourceCenter = toPage(MiscUtils.getCenter(sourceRect));
      var targetCenter = toPage(MiscUtils.getCenter(targetRect));
      switch (connector.tagName.toLowerCase()) {
        case "line":
          connector.setAttribute("x1", sourceCenter.x.toString());
          connector.setAttribute("y1", sourceCenter.y.toString());
          connector.setAttribute("x2", targetCenter.x.toString());
          connector.setAttribute("y2", targetCenter.y.toString());
          break;
        case "text":
          connector.setAttribute("text-anchor", "middle");
          var x = MiscUtils.getMedian(sourceCenter.x, targetCenter.x);
          connector.setAttribute("x", x.toString());
          var y = MiscUtils.getMedian(sourceCenter.y, targetCenter.y);
          connector.setAttribute("y", y.toString());
          break;
        case "g":
          var children = MiscUtils.toArray(connector.childNodes);
          children.forEach(child => refresh(child, source, target));
          break;
      }
      var containerSvg = connector.ownerSVGElement;
      if (containerSvg != null) {
        var scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth); // XXX
        containerSvg.setAttribute("width", scrollWidth.toString());
        var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight); // XXX
        containerSvg.setAttribute("height", scrollHeight.toString());
      }
    }
  }

  function toPage(point: MiscUtils.Point): MiscUtils.Point {
    return {
      x: point.x + window.pageXOffset,
      y: point.y + window.pageYOffset
    };
  }

  function observe(observed: Element, connectorNode: Node, source: Element, target: Element) {
    var observer = new MutationObserver((_, __) => {
      refresh(connectorNode, source, target);
    });
    observer.observe(observed, {
      attributes: true
    });
  }

}