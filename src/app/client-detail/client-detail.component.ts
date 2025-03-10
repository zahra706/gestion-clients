import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from '../model/Client';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent implements OnInit {
  client!: Client;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Client,
    private dialogRef: MatDialogRef<ClientDetailComponent>
  ) {}

  ngOnInit(): void {
    this.client = this.data;
  }

  // Close the dialog
  close(): void {
    this.dialogRef.close();
  }
}