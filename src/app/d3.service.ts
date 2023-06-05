import { Injectable, EventEmitter } from '@angular/core';
import { Node, Link, ForceDirectedGraph } from './models';
const d3: any = require('d3');

@Injectable()
export class D3Service {
  /** This service will provide methods to enable user interaction with elements
    * while maintaining the d3 simulations physics
    */
  constructor() { }

  /** A method to bind a pan and zoom behaviour to an svg element */
  applyZoomableBehaviour(svgElement: any, containerElement: any) {
    let svg, container: any, zoomed, zoom;

    svg = d3.select(svgElement);
    container = d3.select(containerElement);

    zoomed = () => {
      const transform = (d3 as any).event.transform;
      container.attr('transform', 'translate(' + transform.x + ',' + transform.y + ') scale(' + transform.k + ')');
    }

    zoom = d3.zoom().on('zoom', zoomed);
    svg.call(zoom);
  }

  /** A method to bind a draggable behaviour to an svg element */
  applyDraggableBehaviour(element: any, node: Node, graph: ForceDirectedGraph) {
    const d3element = d3.select(element);
    function started() {
      /** Preventing propagation of dragstart to parent elements */
      (d3 as any).event.sourceEvent.stopPropagation();

      if (!(d3 as any).event.active) {
        graph.simulation.alphaTarget(0.3).restart();
      }

      (d3 as any).event.on('drag', dragged).on('end', ended);

      function dragged() {
        node.fx = (d3 as any).event.x;
        node.fy = (d3 as any).event.y;
      }

      function ended() {
        if (!(d3 as any).event.active) {
          graph.simulation.alphaTarget(0);
        }

        node.fx = null;
        node.fy = null;
      }
    }

    d3element.call(d3.drag()
      .on('start', started));
  }

  /** The interactable graph we will simulate in this article
  * This method does not interact with the document, purely physical calculations with d3
  */
  getForceDirectedGraph(nodes: Node[], links: Link[], options: { width: number, height: number }) {
    const sg = new ForceDirectedGraph(nodes, links, options);
    return sg;
  }
}
