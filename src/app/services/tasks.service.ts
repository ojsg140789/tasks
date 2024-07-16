import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, docData } from '@angular/fire/firestore';
import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private firestore: Firestore, private http: HttpClient) {}

  getTasks(): Observable<any[]> {
    const tasksCollection = collection(this.firestore, 'tasks');
    return collectionData(tasksCollection, { idField: 'id' });
  }

  getTaskById(id: string): Observable<any> {
    const taskDocRef = doc(this.firestore, `tasks/${id}`);
    return docData(taskDocRef, { idField: 'id' });
  }

  addTask(data: any) {
    const tasksCollection = collection(this.firestore, 'tasks');
    return addDoc(tasksCollection, data);
  }

  updateTask(id: string, data: any) {
    const taskDocRef = doc(this.firestore, `tasks/${id}`);
    return updateDoc(taskDocRef, data);
  }

  deleteTask(id: string) {
    const taskDocRef = doc(this.firestore, `tasks/${id}`);
    return deleteDoc(taskDocRef);
  }

  getWeather(city: string) {
    return this.http.get(`${environment.baseOpenWeatherURL}/weather?appid=${environment.openWeatherApiKey}&q=${city}`);
  }
}
