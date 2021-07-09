import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-hobbies',
  templateUrl: './hobbies.component.html',
  styleUrls: ['./hobbies.component.scss']
})
export class HobbiesComponent implements OnInit {


  slides = [
    {src: '../../../assets/hobbies/japan/Japan00001.jpeg'},
    {src: '../../../assets/hobbies/japan/Japan00002.jpeg'},
    {src: '../../../assets/hobbies/japan/Japan00003.jpeg'},
    {src: '../../../assets/hobbies/japan/Japan00004.jpeg'},
    {src: '../../../assets/hobbies/japan/Japan00005.jpeg'},
    {src: '../../../assets/hobbies/japan/Japan00006.jpeg'},
    {src: '../../../assets/hobbies/japan/Japan00007.jpeg'},
    {src: '../../../assets/hobbies/japan/Japan00008.jpeg'},
    {src: '../../../assets/hobbies/japan/Japan00009.jpeg'},
    {src: '../../../assets/hobbies/japan/Japan00010.jpeg'},
    {src: '../../../assets/hobbies/japan/Japan00011.jpeg'},
    {src: '../../../assets/hobbies/japan/Japan00012.jpeg'},
    {src: '../../../assets/hobbies/japan/Japan00013.jpeg'},
    {src: '../../../assets/hobbies/japan/Japan00014.jpeg'},
    {src: '../../../assets/hobbies/japan/Japan00015.jpeg'},
    {src: '../../../assets/hobbies/japan/Japan00016.jpeg'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
