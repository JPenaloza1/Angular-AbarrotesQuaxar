import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productCollection: AngularFirestoreCollection<Product>;
  productDoc: AngularFirestoreDocument<Product> | undefined;
  products:Observable<Product[]> | undefined;
  product:Observable<Product> | undefined;

  constructor(private db:AngularFirestore) {
    this.productCollection = db.collection('productos', ref => ref.orderBy("name" , "asc"));
  }

  getProducts():Observable<Product[]> {
    this.products = this.productCollection.snapshotChanges().pipe(
      map( changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Product;
          data.id = action.payload.doc.id;
          data.expiration = this.timestampToDate(data.expiration);
          return data;
        })
      })
    );
    return this.products;
  }

  addProduct(product:Product) {
    let date = this.dateToTimestamp(product.expiration);
    let dateTimestamp = this.addDayTimestamp(date);
    product.expiration = dateTimestamp;

    this.productCollection.add(product);
  }

  getProductById(id:string) {
    this.productDoc = this.db.doc<Product>(`productos/${id}`);
  }

  timestampToDate( date:string ) {
    let newDate = new Date(date);
    return newDate.toLocaleDateString();
  }

  dateToTimestamp( date:string ) {
    return new Date(date);
  }

  addDayTimestamp(date:Date) {
    let dateSplited = date.toString().split(" ");
    
    let dia = +dateSplited[2] + 1;
    dateSplited[2] = dia.toString();

    const re = /,/gi; 
    let str = dateSplited.toString();
    let newDate = str.replace(re, " "); 
    console.log(" A ver este otro: " + newDate);

    return newDate;
  }

}
