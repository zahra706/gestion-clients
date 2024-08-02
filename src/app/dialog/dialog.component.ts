import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Product } from '../model/Product';
import { ProductService } from '../service/product.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'], // Fixed styleUrls here
  providers: [ProductService]
})
export class DialogComponent implements OnInit {
  productform!: FormGroup;
  Btn: string = 'Save';
  formtitle:string="Product Form"
  product!:any;
  id!:string;
  constructor(
    private formbuilder: FormBuilder,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.productform = this.formbuilder.group({
      id:[''],
      Name: ['', Validators.required],
      Description: ['', Validators.required],
      Price: ['', Validators.required],
      Stock: ['', Validators.required],
    });
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.editData) {
      this.Btn = 'Update';
      this.formtitle="Edit Product Form"
      this.productform.patchValue({
        id: this.editData.id,
        Name: this.editData.name,
        Description: this.editData.description,
        Price: this.editData.price,
        Stock: this.editData.stock,
      });
    }
  }

  addProduct() {
    if (!this.editData) {
      if (this.productform.valid) {
        this.productService.addProduct(this.productform.value).subscribe({
          next: (res) => {
            alert('Product added successfully');
            this.productform.reset();
            this.dialogRef.close('save');
          },
          error: () => {
            alert('Error adding product');
          }
        });
      }
    } else {
      this.updateProduct();
    }
  }

  updateProduct(): void {
    if (this.productform.valid) {
      const updatedProduct = this.productform.value;
      console.log('Updating product with data:', updatedProduct);
      this.productService.updateProduct(updatedProduct).subscribe(
        response => {
          console.log('Update response:', response);
          if (response.status === 200) {
            alert('Product updated successfully');
            this.productform.reset();
            this.dialogRef.close('update');
          } else {
            alert(`Error updating product: ${response.fail_Messages}`);
          }
        },
        error => {
          console.error('Error updating product:', error);
          alert('Error updating product: ' + error);
        }
      );
    }
  }

  closeForm() {
    this.dialogRef.close();
  }
}
