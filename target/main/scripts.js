var MiscUtils;
(function (MiscUtils) {
    function toArray(nodeList) {
        return Array.prototype.slice.call(nodeList);
    }
    MiscUtils.toArray = toArray;
    function getCenter(rectangle) {
        return {
            x: getMedian(rectangle.left, rectangle.right),
            y: getMedian(rectangle.top, rectangle.bottom)
        };
    }
    MiscUtils.getCenter = getCenter;
    function getMedian(a, b) {
        return Math.min(a, b) + Math.abs(a - b) / 2;
    }
    MiscUtils.getMedian = getMedian;
})(MiscUtils || (MiscUtils = {}));
///<reference path="MiscUtils.ts"/>
var DraggableElements;
(function (DraggableElements) {
    function manage() {
        var format = "text/plain";
        MiscUtils.toArray(document.querySelectorAll("[draggable=true]")).forEach(function (node) {
            var element = node;
            element.ondragstart = function (event) {
                event.dataTransfer.setData(format, element.id);
            };
        });
        document.ondragover = function (event) {
            var draggedElement = document.getElementById(event.dataTransfer.getData(format));
            draggedElement.style.left = event.pageX.toString() + "px";
            draggedElement.style.top = event.pageY.toString() + "px";
        };
    }
    DraggableElements.manage = manage;
})(DraggableElements || (DraggableElements = {}));
///<reference path="MiscUtils.ts"/>
var SvgConnectors;
(function (SvgConnectors) {
    function manage() {
        refreshAll();
        document.addEventListener("DOMSubtreeModified", refreshAll);
    }
    SvgConnectors.manage = manage;
    function refreshAll() {
        var sourceAttribute = "data-source";
        var targetAttribute = "data-target";
        var connectors = MiscUtils.toArray(document.querySelectorAll("[" + sourceAttribute + "][" + targetAttribute + "]"));
        connectors.forEach(function (node) {
            var connector = node;
            var source = document.getElementById(connector.getAttribute(sourceAttribute));
            var target = document.getElementById(connector.getAttribute(targetAttribute));
            connect(connector, source, target);
        });
    }
    function connect(connectorNode, source, target) {
        refresh(connectorNode, source, target);
        observe(source, connectorNode, source, target);
        observe(target, connectorNode, source, target);
    }
    function refresh(connectorNode, source, target) {
        if (connectorNode instanceof SVGElement) {
            var connector = connectorNode;
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
                    children.forEach(function (child) { return refresh(child, source, target); });
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
    function toPage(point) {
        return {
            x: point.x + window.pageXOffset,
            y: point.y + window.pageYOffset
        };
    }
    function observe(observed, connectorNode, source, target) {
        var observer = new MutationObserver(function (_, __) {
            refresh(connectorNode, source, target);
        });
        observer.observe(observed, {
            attributes: true
        });
    }
})(SvgConnectors || (SvgConnectors = {}));
