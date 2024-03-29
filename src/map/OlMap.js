/**
 * The Openlayers map implementation
 */
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile.js";
import WMTS from "ol/source/WMTS.js";
import WMTSTileGrid from "ol/tilegrid/WMTS.js";
import { getWidth, getTopLeft } from "ol/extent.js";
import { get as getProjection, transform, fromLonLat } from "ol/proj";
import Overlay from "ol/Overlay.js";
import {defaults as defaultControls, ZoomToExtent} from 'ol/control.js';


import OSM from "ol/source/OSM.js";
import {easeIn, easeOut} from 'ol/easing.js';
let olMap;

export default function OlMapFunction(opts) {
  let map = null;
  let layer = new TileLayer({
    source: new OSM()
  });
  let marker = new Overlay({
    positioning: "center-center", 
    stopEvent: false
  });
  let popup = new Overlay({
    positioning: "center-center",
    stopEvent: false
  });
  let view = new View({
    center: opts.center,
    zoom: opts.zoom
  });

  let fetchingAnimation = false;

  const projection = getProjection(opts.projectionCode);
  const projectionExtent = projection.getExtent();
  const size = getWidth(projectionExtent) / 256;
  const defaultResolutions = new Array(14);
  const defaultMatrixIds = new Array(14);
  for (let z = 0; z < 14; ++z) {
    // generate resolutions and matrixIds arrays for this WMTS
    defaultResolutions[z] = size / 2 ** z;
    defaultMatrixIds[z] = z;
  }

  const getLayer = (map, id) =>
    map
      .getLayers()
      .getArray()
      .filter(layer => layer.get("layerId") === id)[0];

  class OlMap {
    constructor(options) {
      map = new Map({
        controls: defaultControls().extend([
          new ZoomToExtent({
            extent: [
              813079.7791264898, 5929220.284081122,
              848966.9639063801, 5936863.986909639
            ]
          })
        ]),
        layers: [layer],
        target: options.divId,
        view: view
      });
    }

    addWMTSLayer(
      layerId,
      title,
      dataSource,
      layer,
      imageFormat,
      bounds,
      resolutions,
      matrixIds,
      matrixSet
    ) {
      const wmtsSource = new WMTS({
        crossOrigin: "",
        url: dataSource,
        layer,
        matrixSet,
        format: imageFormat,
        projection,
        tileGrid: new WMTSTileGrid({
          origin: bounds ? getTopLeft(bounds) : getTopLeft(projectionExtent),
          resolutions: resolutions || defaultResolutions,
          matrixIds: matrixIds || defaultMatrixIds
        })
      });

      const options = {
        layerId,
        title,
        source: wmtsSource
      };

      const wmtsLayer = new TileLayer(options);

      map.addLayer(wmtsLayer);
    }

    getLayerVisibility(layerId) {
      
      return getLayer(map, layerId).getVisible();
    }
    setLayerVisibility(layerId, value) {
      return getLayer(map, layerId).setVisible(value);
    }
    addMapEvent(type, handler) {
      return map.on(type, handler);
    }
    convertCoordinates(coords, source, destination) {
      return transform(coords, source, destination);
    }


    centerMap(long, lat, outZoom) {
      const coords = fromLonLat([long, lat]);
      let rotation = 0;
      view.animate(
        {
        rotation: rotation + Math.PI,
        anchor: this.convertCoordinates(coords, "EPSG:3857", "EPSG:3857"),
        easing: easeIn,
        duration:500,
      }, {
        rotation: rotation + 2 * Math.PI,
        anchor: this.convertCoordinates(coords, "EPSG:3857", "EPSG:3857"),
        easing: easeOut,
        center: this.convertCoordinates(coords, "EPSG:3857", "EPSG:3857"),
        zoom: outZoom,
        duration:500,
      });

      // view.animate({
      //   center: this.convertCoordinates(coords, "EPSG:3857", "EPSG:3857"),
      //   zoom: 6,
      //   duration: 1000
      // });
    }
    
    addMarker(long, lat, el) {
      const coords = fromLonLat([long, lat]);
      marker.setElement(el);
      marker.setPosition(coords);
      map.addOverlay(marker);
    }

    addPopup(long, lat, el) {
      const coords = fromLonLat([long, lat]);
      popup.setElement(el);
      popup.setPosition(coords);
      map.addOverlay(popup);
    }

    createOverlay(element, autopan, autopananimation, duration) {
      let overlay;
      if (autopananimation) {
        overlay = new Overlay({
          element: element,
          autoPan: autopan,
          autoPanAnimation: {
            duration: duration
          }
        });
      } else {
        overlay = new Overlay({
          element: element,
          autoPan: autopan
        });
      }
      map.addOverlay(overlay);
      return overlay;
    }

    addMultipleOverlays(elements, locations){
      console.log(elements);

      for(let i = 0; i<elements.length; i++)
      {
        const coords = fromLonLat([locations[i].longitude, locations[i].latitude]);
        console.log(i + "  fdkas");
        map.addOverlay(new Overlay({
          positioning: "center-center", 
          stopEvent: false,
          element:elements[i],
          position: coords,
        }));
      }

    }
  }





  olMap = new OlMap(opts);
  return olMap;
}
