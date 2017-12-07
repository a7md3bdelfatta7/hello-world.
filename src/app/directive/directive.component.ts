import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'directive',
  templateUrl: './directive.component.html',
  styleUrls: ['./directive.component.css']
})
export class DirectiveComponent implements OnInit {

  courses
  constructor() {     
  }

  loadCourses(){
    this.courses=[
      {id:1,name:"course 1"},
      {id:2,name:"course 2"},
      {id:3,name:"course 3"}
    ];
  }

  ngOnInit() {
  }

  trackCourse(index,course){
    return course ? course.id:undefined;
  }


}
