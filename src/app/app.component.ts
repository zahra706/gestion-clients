import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogComponent } from './dialog/dialog.component';
import { ProductService } from './service/product.service';
import { Product } from './model/Product';
import { ProductDetailComponent } from './product-detail/product-detail.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    DialogComponent,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,ProductDetailComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], // Fixed styleUrls here
  providers: [ProductService]
})
export class AppComponent implements OnInit {
  title = 'ProductManagementAPP';
  products: Product[] = [];
  displayedColumns: string[] = ['Name', 'Description', 'Price', 'Stock', 'Action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe(
      (response: any) => {
        this.products = response.resultat;
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.products);
      },
      error => {
        console.error('Error fetching products', error);
      }
    );
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '600px',
      height: '500px',
    }).afterClosed().subscribe(
      val=>{
        if(val === 'save'){
          this.getProducts();
          }
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  updateProduct(product:any) {
    this.dialog.open(DialogComponent, {
      width: '600px',
      height: '500px',
      data: product
    }).afterClosed().subscribe(
      val=>{
        if(val==='update'){
          this.getProducts();
        }
      }
    )
  }

  deleteProduct(id: string) {
    this.productService.deleteProduct(id).subscribe({
      next: ()=>{
        this.getProducts();
        alert("Product deleted successfulyy")}, 
      
      error:() => {
        console.error('Error deleting product');
      } }
    );
  }
  viewProduct(product:any){
    this.dialog.open(ProductDetailComponent, {
      width: '450px',
      height: '350px',
      data: product
      })
}
}
