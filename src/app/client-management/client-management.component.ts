import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Import MatPaginatorModule
import { MatSort, MatSortModule } from '@angular/material/sort'; // Import MatSortModule
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // Import MatTableModule
import { ClientService } from '../service/client.service';
import { ClientDetailComponent } from '../client-detail/client-detail.component';
import { DialogComponent } from '../dialog/dialog.component';
import { Client } from '../model/Client';
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-client-management',
  standalone: true, // Mark as standalone
  imports: [MatToolbarModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.scss']
})
export class ClientManagementComponent implements OnInit {
  clients: Client[] = [];
  displayedColumns: string[] = ['Nom', 'Prenom', 'Adresse', 'CIN', 'Telephone', 'Email', 'action'];
  dataSource!: MatTableDataSource<Client>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private clientService: ClientService) {}

  ngOnInit(): void {
    this.getClients();
  }
 
  
  getClients(): void {
    this.clientService.getClients().subscribe({
      next: (response) => {
        this.clients = response;
        this.dataSource = new MatTableDataSource(this.clients);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error('Error fetching clients:', error);
      }
    });
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '600px',
      height: '500px',
    }).afterClosed().subscribe(
      val=>{
        if(val === 'save'){
          this.getClients();
          }
      }
    )
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateClient(Client:any) {
    this.dialog.open(DialogComponent, {
      width: '600px',
      height: '500px',
      data: Client
    }).afterClosed().subscribe(
      val=>{
        if(val==='update'){
          this.getClients();
        }
      }
    )
  }
  
  

  deleteClient(id: string): void {
    this.clientService.deleteClient(id).subscribe({
      next: () => {
        this.getClients();
        alert('Client deleted successfully');
      },
      error: () => {
        console.error('Error deleting client');
      }
    });
  }

  viewClient(client: Client): void {
    this.dialog.open(ClientDetailComponent, {
      width: '450px',
      height: '350px',
      data: client
    });
  }
}