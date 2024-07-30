import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})


export class ApiService {

  constructor(private http: HttpClient) {   }


  private apiUrl = 'https://voicerss-text-to-speech.p.rapidapi.com/?key=6c2a6566037642758434ccde99f92b81';
  apiKey = 'b0e47c3b84mshec8fc86f5faf16dp127ba0jsn1d07028cf63e';
  apiHost= 'voicerss-text-to-speech.p.rapidapi.com';

 


  speak(text: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'x-rapidapi-key': this.apiKey,
      'x-rapidapi-host': this.apiHost
    });

    const body = new FormData();
    body.append('src', text);
    body.append('hl', 'en-us');
    body.append('r', '0');
    body.append('c', 'mp3');
    body.append('f', '8khz_8bit_mono');

    return this.http.post(this.apiUrl, body, { headers, responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('Error in fetching', error);
        return throwError('service is currently unavailable.');
      })
    );
  
  }
}
