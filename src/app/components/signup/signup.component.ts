import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { PlacesService } from '../../services/places.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ValidatorsService } from 'src/app/services/validators.service';
import { Place } from 'src/app/models/place';
import { LatLng, Layer } from 'leaflet';
import { faOm } from '@fortawesome/free-solid-svg-icons';
import { CategoryService } from 'src/app/services/category.service';
import { Profile } from 'src/app/models/profile';
import { University } from 'src/app/models/university';
import { UniversityService } from 'src/app/services/university.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [UserService, AuthService, PlacesService, CategoryService, UniversityService
  ]
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;
  public resultUni: Place[];

  public url: string;
  public lat: number;
  public lon: number;
  public finishedGetLocation: boolean;
  public layers: Layer[];
  public degrees = [];
  public fieldsOfStudy = [];
  public universities: any[] = [];
  public modalAddUniversityActive = false;
  @ViewChild(MapComponent)
  private mapComponent: MapComponent;
  public universityRegistered: University;

  // @Input() modalActive: boolean;
  // @Output() eventSignUpModalClose = new EventEmitter<boolean>();

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private placesService: PlacesService,
    private categoryService: CategoryService,
    private universityService: UniversityService

  ) {
    // this.modalActive = false;
    this.createForm();
    this.loadFormData();
    this.createListeners();
    this.resultUni = [];
    this.lat = 200;
    this.lon = 200;
    this.layers = [];

  }


  ngOnInit(): void {
    this.getLocation();
    this.getUniversities();
  }

  onSubmit() {
    console.log(this.signUpForm);
    let user: User = this.signUpForm.value;

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...',

    });

    Swal.showLoading();

    this._authService.singUp(user)
      .subscribe(
        resp => {
          console.log(resp);

          let idRegistrado = resp.id;
          // let university = new University(null, this.signUpForm.value.university, `POINT(${this.lon} ${this.lat})`);

          // let university: University = {
          //   id: null, name: this.signUpForm.value.name,
          //   location: {
          //     coordinates: [this.lon, this.lat],
          //     type: "Point"

          //   }
          // };
          let profile: Profile = this.signUpForm.value;
                profile.user = idRegistrado;
                // profile.university = idUniversity;
          this._userService.createProfile(profile)
                  .subscribe(
                    resp => {
                      console.log(resp);
                      if(this.universityRegistered){
                        this.universityRegistered.created_by = idRegistrado;
                      this.universityService
                      .updateOwnerUniversity(this.universityRegistered, idRegistrado)
                      .subscribe(resp => {
                        this.signUpForm.reset();
                        // this.modalActive = false;
                        Swal.fire({
                          icon: 'success',
                          title: 'Registro exitoso'
  
                        });
                      }, 
                      (err)=> {
                        
                      });
                      }
                      else{
                        this.signUpForm.reset();
                        // this.modalActive = false;
                        Swal.fire({
                          icon: 'success',
                          title: 'Registro exitoso'
  
                        });
                      }
                      
                      
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
          // this.universityService.createUniversity(university)
          //   .subscribe(
          //     resp => {
          //       console.log(resp);
          //       let idUniversity = resp.id;

          //     },
          //     (err) => {
          //       console.log(err);
          //     }
          //   );


        },
        (err) => {
          console.log(err.error.email);
          if (err.error.email) {
            Swal.fire({
              icon: 'error',
              title: 'Error al registrarse',
              text: err.error.email.join(',')
            });

          }

        }
      );

  }

  // closeModal(){
  //   this.modalActive = false;
  //   this.eventSignUpModalClose.emit(true);
  // }

  noMatchPasswords() {
    const password = this.signUpForm.get('password').value;
    const confirmPassword = this.signUpForm.get('confirmPassword').value;

    return (password === confirmPassword) ? false : true;
  }

  createForm() {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      last_name: ['', Validators.required],
      email: ['',
        [Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')], this.validatorsService.existeEmail],
      degree: ['', Validators.required],
      field_of_study: ['', Validators.required],
      description: ['', Validators.required],
      university: ['', Validators.required],
      websites: ['', Validators.required],
      //university: ['', Validators.required],  
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required], 
      agree: [false, Validators.requiredTrue]
    }, {
      validators: this.validatorsService.passwordMatch('password', 'confirmPassword')
    });
    console.log(this.signUpForm);
  }

  loadFormData() {
    this.signUpForm.setValue(
      {
        name: 'Erick',
        last_name: 'Saenz',
        email: 'ericksaenz37@outlook.com',
        degree: '1',
        field_of_study: '7',
        description: 'Esta es una descripción',
        university: null,
        websites: 'elatlas.org',
        //university: '', 
        password: '123456',
        confirmPassword: '123456', 
        agree: false
      }
    );
    this.getDegrees();
    this.getFieldsOfStudy();
  }

  createListeners() {

    this.signUpForm.valueChanges.subscribe(form => {
      //console.log(form);
      console.log(this.signUpForm);


    });

    //     this.signUpForm.get('university').valueChanges.subscribe(value =>{

    // this.resultUni = [];
    // if(value.length >= 3){

    //   this.placesService.getPlaces(value).subscribe(
    //     resp => {


    //       let data = JSON.parse(JSON.stringify(resp));

    //       for(let i=0;i < data.length;i++){
    //         console.log(data[i].description);
    //         let place = new Place(data[i].description, data[i].place_id);
    //         this.resultUni.push(place);
    //       }


    //     }
    //   );

    // }


    //     });
  }

  getLocation() {

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {

        this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;
        console.log(`Se obtuvo la ubicacion ${this.lat}-${this.lon}`);

      });
    } else {
      this.lat = 39.952583;
      this.lon = -75.165222;

    }

    console.log(`Se obtuvo la ubicacion ${this.lat}-${this.lon}`);

  }

  markerMoved(e: LatLng) {
    console.log(e);
    this.lat = e.lat;
    this.lon = e.lng;
  }

  getDegrees() {
    this.categoryService.getDegrees().subscribe(resp => {
      console.log(resp);
      this.degrees = resp;
    },
      (err) => {
        console.log(err);
      });
  }

  getFieldsOfStudy() {
    this.categoryService.getFieldsOfStudy().subscribe(resp => {
      console.log(resp);
      this.fieldsOfStudy = resp;
    },
      (err) => {
        console.log(err);
      });
  }

  getUniversities() {
    this.universityService.getUniversities().subscribe(
      resp => {
        this.universities = resp;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onChange(e: any) {
    console.log(e);
    if (e != null) {
      this.lat = e.location.coordinates[1];
      this.lon = e.location.coordinates[0];
      console.log(this.lat, this.lon);
      this.mapComponent.updateMark(new LatLng(this.lat, this.lon));

    }


  }

  toggleAddUniversity() {
    console.log("Añadir University");
    document.body.classList.toggle("modal-open");
    console.log(this.modalAddUniversityActive);
    this.modalAddUniversityActive = !this.modalAddUniversityActive;
    
  }

  universiyRegistered(e: University) {
    console.log(e);
    this.universityRegistered = e;
    this.getUniversities();
    this.signUpForm.get('university').setValue(e.id);
    this.lat = e.location.coordinates[1];
    this.lon = e.location.coordinates[0];
    this.mapComponent.updateMark(new LatLng(this.lat, this.lon));
  }





}
