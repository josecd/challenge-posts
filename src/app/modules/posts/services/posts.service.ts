import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { HttpClientUserService } from '../../../shared/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly _http = inject(HttpClientUserService);
  constructor() { }

  public getAll(){
    return this._http.get(`/posts/all`);
  }

  public new(data: any) {
    return this._http.post(`/posts/create`, data);
  }

  public detele(id: any) {
    return this._http.delete(`/posts/${id}`);
  }


}
