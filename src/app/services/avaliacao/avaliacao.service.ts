import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Avaliacao } from 'src/app/models/avaliacao';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {

  private avaliacoesUrl = environment.api+'/avaliacoes';
  private avaliacaoUrl = environment.api+'/avaliacao';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAvaliacoes(): Observable<Avaliacao[]> {
    return this.http.get<Avaliacao[]>(this.avaliacoesUrl)
      .pipe(
        catchError(this.handleError<Avaliacao[]>('getAvaliacoes', []))
      );
  }

  getAvaliacoesByItem(itemId:string): Observable<Avaliacao[]> {
    const url = `${this.avaliacoesUrl}/item/${itemId}`;
    return this.http.get<Avaliacao[]>(url)
      .pipe(
        catchError(this.handleError<Avaliacao[]>('getAvaliacoes', []))
      );
  }

  getAvaliacaoById(id: string | null): Observable<Avaliacao> {
    const url = `${this.avaliacaoUrl}/id/${id}`;
    return this.http.get<Avaliacao>(url).pipe(
      catchError(this.handleError<Avaliacao>(`getAvaliacao id=${id}`))
    );
  }

  addAvaliacao(aval: Avaliacao){
    return this.http.post<Avaliacao>(this.avaliacoesUrl, aval, this.httpOptions);  
  }

  updateAvaliacao(aval: Avaliacao){
    const url = `${this.avaliacaoUrl}/${aval._id}`;
    console.log('url : ', url);
    return this.http.put<Avaliacao>(url, aval, this.httpOptions);
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
