import { Component, OnInit, ViewChild } from '@angular/core';
import { circle, Icon, LatLng, Layer, marker, Marker, point, Point, Polyline, polyline, DivIcon, DomEvent, latLng, svgOverlay, SVGOverlay, LatLngBounds, icon, divIcon, Map, ZoomAnimEvent, canvas, svg, SVG, layerGroup, LayerGroup, DomUtil, map } from 'leaflet';
import { Enlace } from 'src/app/models/enlace';
import { LayerMap } from 'src/app/models/LayerMap';
import { ProjectService } from 'src/app/services/project.service';
import { MapComponent } from '../map/map.component';






@Component({
  selector: 'app-project-network',
  templateUrl: './project-network.component.html',
  styleUrls: ['./project-network.component.css'],
  providers: [ProjectService]
})
export class ProjectNetworkComponent implements OnInit {

  public lat: number;
  public lon: number;
  public finishedGetLocation: boolean;
  public layers: Layer[] = [];
  @ViewChild(MapComponent)
  private mapComponent: MapComponent;
  public enlaces: Enlace[] = [];
  public enlacesMap = new LayerGroup();
  public markCanvas: Marker;
  public groundZoom: number;
  public lastZoom: number;
  public lastTopLeftlatLng: LatLng;
  public initTopLeftlatLng: LatLng;
  public shift: Point;
  public svg: any;
  public g: any;
  public lockUpdateEnlances = false;
  public initZoom: number;
  public colorU = '#03a7e5';
  public colorC = '#63bb8c';

  public canvasIconClean = divIcon({
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, 0],
    html: '',
    className: 'canvas-project-network'
  });

  constructor(
    private projectService: ProjectService
  ) {
    this.lat = 200;
    this.lon = 200;
    this.getLocation();
    // this.getProjects();


  }

  ngOnInit(): void {
    // this.layers =
    //   [
    //     circle([6.15, -75.64], { radius: 10000 })
    //   ]


  }

  getLocation() {

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {

        this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;


      });
    } else {
      this.lat = 39.952583;
      this.lon = -75.165222;

    }


  }

  markerMoved(e: LatLng) {
    console.log(e);
  }

  mapReady(e: boolean) {
    this.getProjectNetwork();
  }

  getProjects() {
    this.projectService.getProjects().subscribe(resp => {
      console.log(resp);
    },
      (err) => {
        console.log(err);
      }
    );
  }

  getProjectNetwork() {
    this.projectService.getProjectNetwork().subscribe(resp => {



      console.log(resp);
      resp.forEach(e => {
        console.log(e);
        e.universities_network.forEach(n => {

          let enl: Enlace = {
            id: e.id,
            name: e.name,
            description: e.description,
            createdAt: e.created_at,
            initPoint: latLng([n.lat, n.long]),
            endPoint: latLng([n.lat_assoc, n.long_assoc]),
            type: 'U',

          };

          this.enlaces.push(enl);

          let poly = new Polyline([[n.lat, n.long], [n.lat_assoc, n.long_assoc]], {
            color: '#03a7e5',
            weight: 5,
            opacity: 0.5
          });//.bindPopup(e.name);

          // this.markCanvas = marker(this.mapComponent.map.layerPointToLatLng([0, 0]))
          // .addTo(this.mapComponent.map);

          // this.layers.push(poly);




          

          


          // let svgrect = `<svg xmlns='http://www.w3.org/2000/svg' width='${mapSize.x}' height='${mapSize.y}' viewBox="0 0 ${width} ${height}"><path d='M${point1.x},${point1.y} Q${xmed},${ymed} ${point2.x},${point2.y}' fill='none' stroke="red" stroke-width="5"/></svg>`;

          
          

          let columns_images = `<div class="column">`;
          console.log(e.images.length);
          e.images.slice(0, Math.round(e.images.length / 2)).forEach(img => {
            columns_images += `<img src="${img.url}">`;


          });
          columns_images += `</div><div class="column">`;
          e.images.slice(Math.round(e.images.length / 2), e.images.length).forEach(img => {
            columns_images += `<img src="${img.url}">`;

          });
          columns_images += `</div>`;

          console.log(columns_images);


          let slider_images = `<div class="slider" data-arrows="true">
          <ul class="slides">`;
          console.log(e.images.length);
          e.images.slice(0, Math.round(e.images.length / 2)).forEach(img => {
            slider_images += `<li><img alt="Image project ${e.name}"src="${img.url}"></li>`;


          });
          slider_images += `</ul>
          </div>`;

          e.columns_images = columns_images;
          e.slider_images = slider_images;

          poly.addEventListener('click', (layer) => {
            console.log(e);



            this.mapComponent.showInfoLayer(`
            <div class="row">
                                  <div class="col-md-12">
                                      <div>
                                      
                                      <i class="fa fa-map-marker fa-2x" aria-hidden="true" title="Project"></i>
                                      
                                          <h5>${e.name}</h5>
                                                                                   
                                          
                                          <p>
                                          ${e.description.replace(/\n/g, "<br />")}
                                          </p>

                                          <div class="grid-image"> 
                                          
                                          ${e.columns_images}
                                          </div>

                                      </div>
                                      <!--end feature-->
                                  </div>                               
            
            `, latLng(e.lat, e.long));
          }, e);

        });



        e.communities_network.forEach(n => {

          let poly = new Polyline([[n.lat, n.long], [n.lat_assoc, n.long_assoc]], {
            color: '#63bb8c',
            weight: 5,
            opacity: 0.5
          });//.bindPopup(e.name);
          // this.layers.push(poly);

          let enl: Enlace = {
            id: e.id,
            name: e.name,
            description: e.description,
            createdAt: e.created_at,
            initPoint: latLng([n.lat, n.long]),
            endPoint: latLng([n.lat_assoc, n.long_assoc]),
            type: 'C',

          };

          this.enlaces.push(enl);

          poly.addEventListener('click', (layer) => {
            console.log(e);
            this.mapComponent.showInfoLayer(`
            <div class="row">
                                  <div class="col-md-12">
                                      <div class="">
                                      <i class="fa fa-map-marker fa-2x" aria-hidden="true" title="Project"></i>
                                          <h5>${e.name}</h5>
                                          
                                          <p>
                                          ${e.description.replace(/\n/g, "<br />")}
                                          </p>
                                      </div>
                                      <!--end feature-->
                                  </div>                               
            
            `, latLng(e.lat, e.long));
          }, e);

        });

        

        this.projectService.getNodes().subscribe(resp => {
          console.log(resp);
          resp.universities.forEach(e => {
            console.log(e);

            let myIcon = new DivIcon({
              className: 'div-icon color1',
              iconSize: [e.points, e.points],
              iconAnchor: [e.points / 2, e.points / 2]

            });

            let myIconSelected = new DivIcon({
              className: 'div-icon color3',
              iconSize: [e.points, e.points],
              iconAnchor: [e.points / 2, e.points / 2]

            });

            let mark = marker([e.lat, e.long], {
              icon: myIcon,
            });//.bindPopup(e.name);

            let layerMap: LayerMap = {
              id: e.id,
              name: e.name,
              layer: mark
            }

            console.log(mark);

            this.layers.push(mark);



            mark.addEventListener('click', (layer) => {
              console.log(e);
              this.mapComponent.showInfoLayer(`
              <div class="row">
                                    <div class="col-md-12">
                                        <div class="">
                                        <i class="fa fa-university fa-2x" aria-hidden="true" title="University"></i>
                                            <h5>${e.name}</h5>
                                            
                                        </div>
                                        <!--end feature-->
                                    </div>                               
              
              `, latLng(e.lat, e.long));
            }, e);

          });

          resp.communities.forEach(e => {
            console.log(e);

            let myIcon = new DivIcon({
              className: 'div-icon color2',
              iconSize: [e.points, e.points],
              iconAnchor: [e.points / 2, e.points / 2]

            });

            let mark = marker([e.lat, e.long], {
              icon: myIcon
            });//.bindPopup(`<span hidden>${e.id}</span>${e.name}`);

            this.layers.push(mark);


            mark.addEventListener('click', (layer) => {
              console.log(e);
              this.mapComponent.showInfoLayer(`
              <div class="row">
                                    <div class="col-md-12">
                                        <div class="">
                                        
                                        <i class="fa fa-users fa-2x" aria-hidden="true" title="Community"></i>
                                            <h5>${e.name}</h5>
                                            
                                        </div>
                                        <!--end feature-->
                                    </div>                               
              
              `, latLng(e.lat, e.long));
            }, e);

          });

        },
          (err) => {
            console.log(err);
          });

      });

      this.drawEnlaces();
    },
      (err) => {
        console.log(err);
      });
  }

  mapZoomEnd(e: ZoomAnimEvent) {
    this.updateLinesNetwork();
    // let map = this.mapComponent.map;
    // let scale = map.getZoomScale(e.zoom, this.lastZoom);
    // let offSet = map._latLngToNewLayerPoint(this.lastTopLeftlatLng, e.zoom, e.center);
    // DomUtil.setTransform(this.svg, );
    // this.updatePaths();
    
  }
  mapMoveEnd(e: boolean){
    let map = this.mapComponent.map;
    this.updateSVG();
    // if(this.lastZoom != map.getZoom()){
    //   this.updateScaleSVG();
    //   this.updateScaleSVG();
    // }else{
    //   this.updatePositionSVG();
    //   this.updateSVG();
    // }
    
  }
  mapSizeChange(e: boolean){
    this.updateSVG();
    
  }

  drawEnlaces(){
    console.log("drawEnlaces");
    let map = this.mapComponent.map;
    

    let pane = map.getPanes().overlayPane;

    let xmlns = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(xmlns, "svg");
    let g = document.createElementNS(xmlns, "g");
    let mapSize = map.getSize();

    svg.setAttribute('width', mapSize.x.toString());
    svg.setAttribute('height', mapSize.y.toString());
    svg.setAttribute('id', "canvas-project-network");

    svg.setAttribute('viewBox', `0 0 ${mapSize.x.toString()} ${mapSize.y.toString()}`);

    svg.appendChild(g);
    
    this.groundZoom = map.getZoom();
    
    this.shift = new Point(0,0);
    this.lastZoom = map.getZoom();
    this.initZoom = map.getZoom();

    let bounds = map.getBounds();

    this.lastTopLeftlatLng = new LatLng(bounds.getNorth(), bounds.getWest());

    this.initTopLeftlatLng = new LatLng(bounds.getNorth(), bounds.getWest())

    let paths = ``;
    
    this.enlaces.forEach(enl => {
      let point1 = this.mapComponent.map.latLngToLayerPoint(enl.initPoint);
          let point2 = this.mapComponent.map.latLngToLayerPoint(enl.endPoint);

          let width = Math.abs(point2.x - (point1.x));
          let height = Math.abs(point2.y - (point1.y));

          
          let minx = point1.x;
          let maxx = point2.x;
          let despx = 0;
          if (point2.x < minx) {
            minx = point2.x;
            maxx = point1.x;
            despx = width;
          }

          let miny = point1.y;
          let maxy = point2.y;
          let despy = 0;
          if (point2.y < miny) {
            miny = point2.y;
            maxy = point1.y;
            despy = height;
          }
          let xmed = minx + (width / 2);
          let ymed = maxy;

          let color = this.colorU;
          if(enl.type == 'C'){
            color = this.colorC;
          }
          
          // paths += `<path d='M${point1.x},${point1.y} Q${xmed},${ymed} ${point2.x},${point2.y}' fill='none' stroke="red" stroke-width="5" class="line-network"/>`;
          paths += this.arcLines(point1.x, point1.y, point2.x, point2.y, 1, 1000, false, color);

    });
    
    g.innerHTML = paths;
    // svg.innerHTML = paths;

    pane.appendChild(svg);
    
    this.svg = svg;
    this.g = g;
   
  }

  updateSVG(){
    let map = this.mapComponent.map;
    let bounds = map.getBounds();
    let size = map.getSize();
    let topLeftLatLng = new LatLng(bounds.getNorth(), bounds.getWest());
    let topLeftLayerPoint  = map.latLngToLayerPoint(topLeftLatLng);
    let lastLeftLayerPoint = map.latLngToLayerPoint(this.lastTopLeftlatLng);
    let initTopLeftlatLngLayerPoint = map.latLngToLayerPoint(this.initTopLeftlatLng);
    let delta = lastLeftLayerPoint.subtract(topLeftLayerPoint);
    let delta2 = initTopLeftlatLngLayerPoint.subtract(topLeftLayerPoint);
    let zoom = map.getZoom();
    let scaleDelta = map.getZoomScale(zoom, this.lastZoom);
    let scaleDelta2 = map.getZoomScale(zoom, this.initZoom);
    // let scaleDelta = map.getZoomScale(this.initZoom, zoom);
    let scaleDiff = this.getScaleDiff(zoom);

    let difZoom = this.initZoom - zoom;
    let scaleZoomNew = Math.pow(2, Math.abs(difZoom));


    // this.shift = this.shift.multiplyBy(scaleDelta).add(delta);
    // let shift = this.shift.multiplyBy(scaleDelta).add(delta);
    let shift = this.shift.multiplyBy(scaleDelta).add(delta2);

    this.svg.setAttribute('width', size.x);
    this.svg.setAttribute('height', size.y);

    DomUtil.setPosition(this.svg, topLeftLayerPoint);

    this.svg.setAttribute('viewBox', `0 0 ${size.x} ${size.y}`);

    this.g.setAttribute("transform", "translate(" + shift.x + "," + shift.y + ") scale(" + scaleDelta2 + ")");

    // this.g.setAttribute("transform", "translate(" + this.shift.x + "," + this.shift.y + ")");
    // this.updatePaths();
    this.lastTopLeftlatLng = topLeftLatLng;
    this.lastZoom = zoom;
    

  }
  
  updateLinesNetwork(){
    let map = this.mapComponent.map;
    let zoom = map.getZoom();
    let delta = this.initZoom - zoom;
    let propZoom = Math.pow(2, delta)*0.5;
    let lines = document.getElementsByClassName("line-network");
    
    for(let i=0;i < lines.length; i++){
lines[i].setAttribute("stroke-width", `${propZoom.toString()}%`);
    }

  }

  getScaleDiff(zoom: number) {
    let zoomDiff = this.groundZoom - zoom;
    let scale = (zoomDiff < 0 ? Math.pow(2, Math.abs(zoomDiff)) : 1 / (Math.pow(2, zoomDiff)));
    return scale;
}

arcLines(x1:number, y1: number, x2: number, y2: number, n: number, k:number, lineMiddle: boolean, color: string): string {
  let cx = (x1+x2)/2;
  let cy = (y1+y2)/2;
  let dx = (x2-x1)/2;
  let dy = (y2-y1)/2;
  let items = '';
  for (let i=0; i<n; i++) {
    if ((i==(n-1)/2) && lineMiddle) {
      items += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" fill='none' stroke="${color}" stroke-width="5" class="line-network"/>`;
      
    }
    else {
      
      let dd = Math.sqrt(dx*dx+dy*dy);
      // let ex = cx + dy/dd * k * (i-(n-1)/2);
      // let ey = cy - dx/dd * k * (i-(n-1)/2);
      let distance = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2))
      let ex = cx + dy/dd * (distance/4);
      let ey = cy - dx/dd * (distance/4);
      items += `<path d='M${x1},${y1} Q${ex},${ey} ${x2},${y2}' fill='none' stroke="${color}" stroke-width="5" class="line-network"/>`;
    }
  }

  return items;
}

}
