import { Component } from '@angular/core';
import { FormComponent } from "../../molecules/form/form.component";


@Component({
  selector: 'app-task',
  standalone: true,
  imports: [FormComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {

}
