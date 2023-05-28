import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap, map } from 'rxjs';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = environment.api+'/users';
  private userUrl = environment.api+'/user';
  //private usersUrl = 'http://appserver.alunos.di.fc.ul.pt:3012/users';
  //private userUrl = 'http://appserver.alunos.di.fc.ul.pt:3012/user';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }


  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
      .pipe(
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  getUserById(id: string | null): Observable<User> {
    const url = `${this.userUrl}/id/${id}`;
    return this.http.get<User>(url).pipe(
      catchError(this.handleError<User>(`getUser id=${id}`))
    );
  }

  getUserByIdFollowers(id: string | null): Observable<User> {
    const url = `${this.userUrl}/followers/id/${id}`;
    return this.http.get<User>(url).pipe(
      catchError(this.handleError<User>(`getUser id=${id}`))
    );
  }

  getUserByIdFollowing(id: string | null): Observable<User> {
    const url = `${this.userUrl}/following/id/${id}`;
    return this.http.get<User>(url).pipe(
      catchError(this.handleError<User>(`getUser id=${id}`))
    );
  }

  getUserByName(username: string | null) {
    const url = `${this.userUrl}/username/${username}`;
    return this.http.get<User>(url).toPromise();
  }
  
  updateUserProfile(userProfile: User): Observable<User> {
    const url = `${this.userUrl}/${userProfile._id}`;
    return this.http.put<User>(url, userProfile, this.httpOptions)
      .pipe(
        tap(_ => console.log(`updated user profile id=${userProfile._id}`)),
        catchError(this.handleError<any>('updateUserProfile'))
      );
  }

  checkUsernameAvailability(username: string): Observable<boolean> {
  const url = `${this.userUrl}/username/${username}`;
  return this.http.get<boolean>(url)
    .pipe(
      catchError(this.handleError<boolean>('checkUsernameAvailability', false))
    );
  }


  /**POST: add a new user to the server */
  addUser(user: User){
    return this.http.post<User>(this.usersUrl, user, this.httpOptions);  
  }


  updateUser(user: User){
    const url = `${this.userUrl}/${user._id}`;
    console.log('url : ', url);
    return this.http.put<User>(url, user, this.httpOptions);
  }


   /**
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
