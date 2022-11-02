import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products:Product[] = [];
  product: Product = {
    id: "",
    name: "",
    expiration: "",
    price: 0,
    quantity: 0,
    createdAt: "",
    updatedAt: ""
  }

  @ViewChild("productForm") productForm:NgForm;
  @ViewChild("closeBtn") closeBtn:ElementRef;

  constructor(private productService:ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      products => {
        this.products = products;
      }
    );
  }

  add({value, valid} : {value:Product, valid:boolean}){
    value.createdAt = new Date().toString();
    value.updatedAt = new Date().toString();

    this.productService.addProduct(value);
    this.productForm.resetForm();
    this.closeModal();
  }

  getDateToday() {
    let date = new Date()
    const offset = date.getTimezoneOffset()
    date = new Date(date.getTime() - (offset*60*1000))
    return date.toISOString().split('T')[0];
  }

  private closeModal() {
    this.closeBtn.nativeElement.click();
  }

}
