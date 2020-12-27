import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DivIcon, DomEvent, latLng, LatLng, Layer, marker, Polyline } from 'leaflet';
import { LayerMap } from 'src/app/models/LayerMap';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'], 
  providers: [ProjectService]
})
export class ProjectDetailComponent implements OnInit {
  public idProject: number;
  public project: Project;
  public lat: number;
  public lon: number;
  public layers: Layer[] = [];
  @ViewChild(MapComponent)
  private mapComponent: MapComponent;

  constructor(
    private route:ActivatedRoute, 
    private projectService:ProjectService
  ) {
    this.lat = 200;
    this.lon = 200;
    
    // this.getProjects();
   }

  ngOnInit(): void {
    this.getLocation();
    this.route.params.subscribe(params => {
      this.idProject = +params['id'];

      this.getDataProject();
   });
    
    
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

  getDataProject(){

this.projectService.getProjectsExpandedById(this.idProject).subscribe(resp => {
  
this.project = resp;

this.lat = this.project.lat;
this.lon = this.project.long;
console.log(this.project);

let e = this.project;
this.project.universities_network.forEach(n => {

  let poly = new Polyline([[n.lat, n.long], [n.lat_assoc, n.long_assoc]], {
    color: '#03a7e5',
    weight: 5,
    opacity: 0.5
  });//.bindPopup(e.name);

  this.layers.push(poly);

  
  
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

                                  

                              </div>
                              <!--end feature-->
                          </div>                               
    
    `, latLng(e.lat, e.long));
  }, e);

});

this.project.communities_network.forEach(n => {

  let poly = new Polyline([[n.lat, n.long], [n.lat_assoc, n.long_assoc]], {
    color: '#63bb8c',
    weight: 5,
    opacity: 0.5
  });//.bindPopup(e.name);
  this.layers.push(poly);


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

this.project.nodes_universities.forEach(n => {

  let myIcon = new DivIcon({
    className: 'div-icon color1',
    iconSize: [n.points, n.points],
    iconAnchor: [n.points / 2, n.points / 2]

  });

  let myIconSelected = new DivIcon({
    className: 'div-icon color3',
    iconSize: [n.points, n.points],
    iconAnchor: [n.points / 2, n.points / 2]

  });

  let mark = marker([n.lat, n.long], {
    icon: myIcon,
  });//.bindPopup(n.name);

  let layerMap: LayerMap = {
    id: n.id,
    name: n.name,
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
                                  <h5>${n.name}</h5>
                                  
                              </div>
                              <!--end feature-->
                          </div>                               
    
    `, latLng(n.lat, n.long));
  }, n);

  this.project.nodes_communities.forEach(e => {
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

});


}, 
(err) => {
  console.log(err);
});
  }

  markerMoved(e: LatLng) {
    console.log(e);
  }

}
