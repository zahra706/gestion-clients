import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'; // Import MatDialogModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { ClientService } from '../service/client.service';
import { Client } from '../model/Client';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-dialog',
  standalone: true, // Mark as standalone
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  clientForm!: FormGroup;
  btnText: string = 'Save';
  formTitle: string = 'Client Form';

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    @Inject(MAT_DIALOG_DATA) public editData: Client,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      id: [''],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      adresse: ['', Validators.required],
      CIN: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    if (this.editData) {
      this.btnText = 'Update';
      this.formTitle = 'Edit Client Form';
      this.clientForm.patchValue(this.editData);
    }
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;
      if (this.editData) {
        this.clientService.updateClient(clientData).subscribe({
          next: () => {
            alert('Client updated successfully');
            this.dialogRef.close('update');
          },
          error: () => {
            alert('Error updating client');
          }
        });
      } else {
        this.clientService.addClient(clientData).subscribe({
          next: () => {
            alert('Client added successfully');
            this.dialogRef.close('save');
          },
          error: () => {
            alert('Error adding client');
          }
        });
      }
    }
  }

  closeForm(): void {
    this.dialogRef.close();
  }
}