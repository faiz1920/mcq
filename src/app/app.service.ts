import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private httpClient: HttpClient) { }

  getQuestions(): Observable<any> {
    return this.httpClient.get('data/questions.json');

    // this.httpClient.get('./data/questions.json').subscribe((res) => {
    //   console.log(res);
    // });
  }
}
