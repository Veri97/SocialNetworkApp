import { Component, EventEmitter, Input, Output,OnInit } from '@angular/core';
import { Photo } from '../../_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  /*PhotoEditorComponent is the child of MemberEditComponent
  each user has a collection of photos, and this collection will be passed from MemberEdit to PhotoEditor
  component as an Input property*/

  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMainPhoto: Photo;

  constructor(private authService: AuthService, 
              private userService: UserService,
              private alertify: AlertifyService)  { }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e:any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/'+this.authService.decodedToken.nameid + "/photos",
      authToken: 'Bearer '+ localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10*1024*1024,
    });

    //remove CORS error when sending file with ng2-file-upload
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.showPhotoInList(this.uploader);
  }

  showPhotoInList(uploader: FileUploader){
      uploader.onSuccessItem = (item,response,status,headers) => {
      if(response){
        const result: Photo = JSON.parse(response);
        const photo = {
          id: result.id,
          url: result.url,
          dateAdded: result.dateAdded,
          description: result.description,
          isMain: result.isMain
        };
        this.photos.push(photo);
      }
   };
  }
 
  setMainPhoto(photo: Photo){
    this.userService.setMainPhoto(this.authService.decodedToken.nameid,photo.id)
        .subscribe(() => {
            this.currentMainPhoto = this.photos.filter(p=>p.isMain === true)[0];
            this.currentMainPhoto.isMain = false;
            photo.isMain = true;
            this.authService.changeMemberPhoto(photo.url);
            this.authService.currentUser.photoUrl = photo.url;
            localStorage.setItem('user',JSON.stringify(this.authService.currentUser));
        },
        error =>{
            this.alertify.error(error);
        });
  }


}
