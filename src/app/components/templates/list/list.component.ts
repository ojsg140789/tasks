import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { TasksService } from '../../../services/tasks.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CdkDropList, CdkDrag, MatTableModule, MatIconModule, CommonModule, MatDividerModule, MatButtonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  @ViewChild('table', { static: true }) table: MatTable<any>;
  displayedColumns: string[] = ['name', 'email', 'url', 'actions'];
  dataSource: any[] = [];

  constructor(private tasksService: TasksService, private router: Router) { }

  ngOnInit() {
    this.tasksService.getTasks().subscribe(tasks => {
      this.dataSource = tasks;
    });
  }

  drop(event: CdkDragDrop<string>) {
    const previousIndex = this.dataSource.findIndex(d => d === event.item.data);

    moveItemInArray(this.dataSource, previousIndex, event.currentIndex);
    this.table.renderRows();
  }

  updateTask(task:any) {
    const taskId = task ? task.id : null;
    this.router.navigate(['/tasks', taskId ]);
  }

  removeTask(task:any) {
    this.tasksService.deleteTask(task.id);
  }
}
