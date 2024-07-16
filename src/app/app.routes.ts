import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { TasksComponent } from './components/pages/tasks/tasks.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'tasks/:id', component: TasksComponent },
    { path: '',   redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: HomeComponent }
];
