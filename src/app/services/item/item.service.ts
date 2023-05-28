import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {User} from "../../models/user";
import {Item} from "../../models/item";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  //private itemsUrl = 'http://appserver.alunos.di.fc.ul.pt:3012/items';
  //private itemUrl = 'http://appserver.alunos.di.fc.ul.pt:3012/item';
  private itemsUrl = environment.api+'/items';
  private itemUrl = environment.api+'/item';


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.itemsUrl)
      .pipe(
        catchError(this.handleError<Item[]>('getItems', []))
      );
  }

  getItemById(id: string | null): Observable<Item> {
    const url = `${this.itemUrl}/id/${id}`;
    return this.http.get<Item>(url).pipe(
      catchError(this.handleError<Item>(`getItem id=${id}`))
    );
  }

  addItem(item: Item){
    return this.http.post<Item>(this.itemsUrl, item, this.httpOptions);

  }

  updateItem(item: Item){
    const url = `${this.itemUrl}/${item._id}`;
    console.log('url : ', url);
    return this.http.put<Item>(url, item, this.httpOptions);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
