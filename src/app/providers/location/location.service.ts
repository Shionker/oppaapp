import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  baseUrl: string = 'https://apis.digital.gob.cl/dpa'

  constructor(
    private http: HttpClient
  ) { }

  getDistricts(): Observable<any> {
    return this.http.jsonp<any>(`${this.baseUrl}/comunas`, 'callback')
  }

  getRegions(): Observable<any> {
    return this.http.jsonp<any>(`${this.baseUrl}/regiones`, 'callback')
  }

  getDistrictsByRegion(region: string): Observable<any> {
    return this.http.jsonp<any>(`${this.baseUrl}/regiones/${region}/comunas`, 'callback')
  }
}
