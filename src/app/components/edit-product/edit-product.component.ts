import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  product: Product = {
    id: "",
    name: "",
    expiration: "",
    price: 0,
    quantity: 0,
    createdAt: "",
    updatedAt: ""
  }

  id:string;
  
  constructor(
    private productService:ProductService,
    private router:Router,
    private route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params["id"];
    this.productService.getProductById(this.id).subscribe( product => {
      product.expiration = this.productService.flipDate( this.productService.timestampToDate(product.expiration));
      this.product = product;
    });
  }

  save({value, valid} : {value:Product , valid:boolean}) {
    value.id = this.id;
    this.productService.updateProduct(value);
    this.router.navigate(["/"]);
  }

  

}
