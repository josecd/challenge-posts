import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:"",
    children:[
    { path: '',   loadChildren: () => import('./modules/posts/posts.routes')},
    ]
  }
]
;
