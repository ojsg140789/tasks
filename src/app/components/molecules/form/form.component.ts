import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { getDownloadURL, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { ref } from 'firebase/storage';
import { ActivatedRoute } from '@angular/router';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { Router } from '@angular/router';
import {MatDividerModule} from '@angular/material/divider';


import { TasksService } from '../../../services/tasks.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [MatButtonModule, ReactiveFormsModule, MatSelectModule, MatInputModule, MatFormFieldModule, RouterLink, RouterLinkActive, RouterOutlet, MatDividerModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  private readonly _storage = inject(Storage);
  private service = inject(TasksService);
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;
  public videoURL: string | null = null;
  showVideo: Boolean = false;
  recoding: Boolean = false;

  taskForm: FormGroup;
  weather: string;
  url: string;
  task: Object;
  taskId: string;
  

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required]
    });

    this.route.params.subscribe(params => {
      this.taskId = params['id'];
      if(this.taskId) {
        this.service.getTaskById(this.taskId).subscribe(
          (task) => {
            this.taskForm.setValue({
              name: task.name,
              email: task.email,
              city: task.city
            });
            this.weather = task.weather;
            this.url = task.url;
            this.videoURL = task.url;
          }
        );
      }
   });
  }

  submitForm() {
    this.task = {
      ...this.taskForm.value,
      url: this.url,
      weather: this.weather
    };
    if(this.taskId) {
      this.service.updateTask(this.taskId, this.task).finally(
        () => this.router.navigate(['/home'])
      );
    } else {
      this.service.addTask(this.task).finally(
        () => {
          emailjs.init({
            publicKey: environment.emailJSApiKey,
          });
          emailjs.send( environment.serviceEmailJSKey, environment.templateEmailJSKey,{
              name: this.taskForm.value.name,
              video: this.url,
              city: this.taskForm.value.city,
              weather: this.weather,
              cc_to: this.taskForm.value.email  
            });
            this.router.navigate(['/home']);
        });
    }
  }

  getWeather(city: string) {
    this.service.getWeather(city).subscribe(
      (weather: any) => {
        this.weather = weather.weather[0].main;
      },
      (error) => {
        this.weather = error.error.message;
      }
    );
  }

  getVideo() {
    this.showVideo = true;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.stream = stream;
        this.videoElement.nativeElement.srcObject = stream;
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
          this.chunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
          const videoBlob = new Blob(this.chunks, { type: 'video/mp4' });
          this.videoURL = URL.createObjectURL(videoBlob);
          this.uploadVideo(videoBlob);
          this.chunks = [];
          stream.getTracks().forEach(track => track.stop());
        };
      })
      .catch((error) => {
        console.error('Error accessing media devices.', error);
      });
  }

  startRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'inactive') {
      this.recoding = true;
      this.mediaRecorder.start();
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.recoding = false;
      this.showVideo = false;
      this.mediaRecorder.stop();
    }
  }

  uploadVideo(videoBlob: Blob): void {
    const storageRef = ref(this._storage, `videos/${Date.now()}_video.mp4`);
    const uploadTask = uploadBytesResumable(storageRef, videoBlob);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      }, 
      (error) => {
        console.error('Error uploading video', error);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          this.url = downloadURL;
        });
      }
    );
  }
}
