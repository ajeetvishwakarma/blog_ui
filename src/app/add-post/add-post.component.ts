import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {PostPayload} from './post-payload';
import {AddPostService} from '../add-post.service';
import {Router} from '@angular/router';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  addPostForm: FormGroup;
  postPayload: PostPayload;
  title = new FormControl('');
  body = new FormControl('');
  attachment = new FormControl('');
  currentFileUpload: File;
  selectedFiles: FileList;

  constructor(private addpostService: AddPostService, private router: Router) {
    this.addPostForm = new FormGroup({
      title: this.title,
      body: this.body,
      attachment: this.attachment,
    });
    this.postPayload = {
      id: '',
      content: '',
      title: '',
      username: '',
      createdOn:'',
      imageFile:null,
    }
  }

  ngOnInit() {
  }
  selectFile(event) {
   const file = event.target.files.item(0);

   if (file.type.match('image.*')) {
     var size = event.target.files[0].size;
     if(size > 1000000)
     {
         alert("size must not exceeds 1 MB");
         this.addPostForm.get('profileImage').setValue("");
     }
     else
     {
       this.selectedFiles = event.target.files;
     }
   } else {
     alert('invalid format!');
   }

 }

  addPost() {
    this.postPayload.content = this.addPostForm.get('body').value;
    this.postPayload.title = this.addPostForm.get('title').value;
    this.currentFileUpload = this.selectedFiles.item(0);
    this.addpostService.addPost(this.postPayload).subscribe(data => {
      this.addpostService.addPostImage(this.currentFileUpload,data['id']).subscribe(data => {
        this.router.navigateByUrl('/');
      }, error => {
        console.log('Failure Response');
      })
    }, error => {
      console.log('Failure Response');
    })
  }
}
