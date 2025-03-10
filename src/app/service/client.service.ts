import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Client } from '../model/Client';
import { ResponseHttp } from '../model/ResponseHttp';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'https://localhost:7288/api/Client'; // Ensure this matches your API URL

  constructor(private http: HttpClient) {}

  // Get all clients with pagination
  getClients(pageNumber?: number, pageSize?: number): Observable<Client[]> {
    const url = `${this.apiUrl}?pageNumber=${pageNumber || ''}&pageSize=${pageSize || ''}`;
    return this.http.get<{ resultat: Client[] }>(url).pipe(
      map(response => response.resultat), // Extract the 'resultat' property
      catchError(this.handleError)
    );
  }

  // Add a new client
  addClient(client: Client): Observable<ResponseHttp> {
    return this.http.post<ResponseHttp>(this.apiUrl, client).pipe(
      catchError(this.handleError)
    );
  }

  // Update a client
  updateClient(client: Client): Observable<ResponseHttp> {
    return this.http.put<ResponseHttp>(this.apiUrl, client).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a client
  deleteClient(id: string): Observable<ResponseHttp> {
    return this.http.delete<ResponseHttp>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get a client by ID
  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Handle errors
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', {
      status: error.status,
      message: error.message,
      url: error.url,
      error: error.error,
    });
    return throwError('Something went wrong; please try again later.');
  }
  isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
    return payload.exp < Date.now() / 1000; // Check if the token is expired
  }
}