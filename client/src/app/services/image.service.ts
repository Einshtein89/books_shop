import {Injectable, OnInit} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/user.model";
import {Constants} from "../constants/constants";
import {Book} from "../models/book.model";

const IMAGE_POST_URL = `${Constants.hostUrl}${Constants.photoUpload}`;

@Injectable()
export class ImageService implements OnInit {

  private photo: any;

  constructor(private http:HttpClient){}

  public postImage(photo: FormData): Observable<any> {
    return this.http.post(IMAGE_POST_URL, photo)
      .catch(this._handleError);
  }

  public getImage(url: string) {
    return this.http.get(url)
      .catch(this._handleError)
  }

  public prepareMultipartRequest(image: any) {
    const fd = new FormData();
    fd.append('image',
      image.file ? image.file : image.body,
      image.file ? image.file.name : image.name);
    return fd;
  }

  ngOnInit(): void {
  }

  public convertByteArraytoFormData(byteArray: any, contentType: any) {
    let formDataToUpload = new FormData();
    let blob = this.b64toBlob(byteArray, contentType);
    formDataToUpload.append("image", blob);
    return formDataToUpload;
  }

  public getImgSrc(entity: any) {
    return entity.photo ? 'data:image/jpg;base64,' + entity.photo.body : this.getDefaultImageSrc(entity);
  }

  private getDefaultImageSrc(entity: any) {
    if (entity instanceof User) {
      return `../../assets/icons/${entity.sex}.png`;
    }
    return `../../assets/icons/book_icon_default.png`;
  }

  private b64toBlob(b64Data, contentType, sliceSize?) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  private _handleError (error: HttpResponse<any> | any) {
    console.error(error.message || error);
    return Observable.throw(error);
  }


}
