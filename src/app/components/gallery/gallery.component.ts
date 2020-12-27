import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  providers: [ProjectService]
})
export class GalleryComponent implements OnInit {

  public projects: Project[];

  constructor(
    private projectService: ProjectService
  ) {
    this.getProjects();
  }

  ngOnInit(): void {
  }

  getProjects() {

    this.projectService.getProjectsExpanded().subscribe(resp => {

      this.projects = resp;
      console.log(this.projects);
    },
      (err) => {

      });

  }
}
