import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Persona {
  cedula: string;
  nombre: string;
  direccion: string;
}

@Injectable({
  providedIn: 'root'
})
export class GestionPersonasService {
  private apiUrl = 'http://localhost:8000/api/personas';

  constructor(private http: HttpClient) { }

  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.apiUrl);
  }

  getPersona(cedula: string): Observable<Persona> {
    return this.http.get<Persona>(`${this.apiUrl}/${cedula}`);
  }

  createPersona(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(this.apiUrl, persona);
  }

  updatePersona(persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(this.apiUrl, persona);
  }

  deletePersona(cedula: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${cedula}`);
  }
}
