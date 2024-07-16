import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => 
            import('./components/pages/home/home.component')
                .then(m => m.HomeComponent)
    },
    {
        path: 'tasks/:id',
        loadComponent: () => 
            import('./components/pages/tasks/tasks.component')
                .then(m => m.TasksComponent)
    },
    { path: '',   redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: HomeComponent }
];
