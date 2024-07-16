import { Component } from '@angular/core';
import { ListComponent } from "../../templates/list/list.component";
import { TaskComponent } from "../../templates/task/task.component";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [ListComponent, TaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {

}
