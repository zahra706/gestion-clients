import { Component, Inject, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Product } from '../model/Product';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule,CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  providers: [ProductService]
})
export class ProductDetailComponent implements OnInit {
  dataSource!: MatTableDataSource<Product>;
  products: Product[] = [];
  constructor(private productService:ProductService,
    @Inject(MAT_DIALOG_DATA) public product : any,
    private dialogRef: MatDialogRef<ProductDetailComponent>
  ){

  }
 ngOnInit(): void {
 }
  close(){
    this.dialogRef.close();
  }
}
