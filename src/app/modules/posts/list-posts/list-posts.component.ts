import { Component, inject, signal } from '@angular/core';
import { AddPostComponent } from '../modals/add-post/add-post.component';
import { MatDialog } from '@angular/material/dialog';
import { PostsService } from '../services/posts.service';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { map, Observable, startWith, Subscription } from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import { SwallService } from '../../../shared/swall.service';

@Component({
  selector: 'app-list-posts',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatIconModule
  ],
  templateUrl: './list-posts.component.html',
  styleUrl: './list-posts.component.scss'
})
export default class ListPostsComponent {
  private subscriptions = new Subscription();
  readonly dialog = inject(MatDialog);
  readonly _post = inject(PostsService);
  private readonly _swall = inject(SwallService);

  public list = [
    {
      "name": "John Doe",
      "description": "A software engineer with 10 years of experience in web development."
    },
    {
      "name": "Jane Smith",
      "description": "A project manager who specializes in Agile methodologies and team coordination."
    },
    {
      "name": "Acme Corp",
      "description": "A leading company in the tech industry, known for innovative solutions and cutting-edge technology."
    },
    {
      "name": "FastTrack App",
      "description": "An application designed to streamline project management and enhance team productivity."
    }
  ]
  filteredItems: any[] = [...this.list];
  myControl = new FormControl('');
  filteredOptions: Observable<any[]>;

  constructor(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  openAddPost() {
    const dialogRef = this.dialog.open(AddPostComponent);
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
      }
    });
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.list.filter((option:any) => option.name.toLowerCase().includes(filterValue));
  }

  deletePost(item:any){
    this._swall.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this._swall.showLoading();
        this.subscriptions.add(
          this._post.detele(item.id).subscribe({
            next: (value: any) => {
              this._swall.showMessage(
                'Success',
                'Eliminado correctamente',
                'success'
              );
            },
            error: (err) => {
              this._swall.showMessage(
                'Error al eliminar',
                err.error['message'],
                'error'
              );
              console.error('Error delete inventory', err);
            },
          })
        );
      }
    });
  }

  getPosts() {
    this.subscriptions.add(
      this._post.getAll().subscribe({
        next: (value: any) => {
          if (value?.response?.data.length != 0) {
            this.list = value?.response?.data
          } else {
            this.list = []
          }
        },
        error: (error: any) => {
          console.error('error', error);
        },
      })
    );
  }
}
