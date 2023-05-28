import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { List } from 'src/app/models/list';
import { Observable, catchError, of, tap } from 'rxjs';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  
  private listUrl = environment.api+'/lists';

  //private listUrl = 'http://appserver.alunos.di.fc.ul.pt:3012/lists';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  getListById(id: string | null): Observable<List> {
    const url = `${this.listUrl}/${id}`;
    return this.http.get<List>(url).pipe(
      catchError(this.handleError<List>(`getList id=${id}`))
    );
  }

  addList(list: List){
    return this.http.post<List>(this.listUrl, list, this.httpOptions);
          
  }

  getUserAndUserListsByID(id: string | null): Observable<User> {
    const url = `${this.listUrl}/id/${id}`;
    return this.http.get<User>(url).pipe(
      catchError(this.handleError<User>(`getUser id=${id}`))
    );
  }

  /*
  * Handle Http operation that failed.
  * Let the app continue.
  *
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
     private handleError<T>(operation = 'operation', result?: T) {
       return (error: any): Observable<T> => {

       // TODO: send the error to remote logging infrastructure
         console.error(error); // log to console instead

       // Let the app keep running by returning an empty result.
         return of(result as T);
       };
     }

}
