import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { ApiService } from '../service/api.service';
import { HttpClientModule } from '@angular/common/http';


interface Product {
  name: string;
  quantity: number | null;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})



export class HomeComponent {

  
  products:Product[] = [{ name: '', quantity: null }];
  productOptions = ['Product 1', 'Product 2', 'Product 3'];
  quantities = [0, 1, 2, 3, 4, 5];


  selectedProducts:Product[] = [{ name: '', quantity: null }];
  orderVisible = false;

  isLoading = false;
  errorMessage = '';



  constructor(private ttsService: ApiService){
    
  }



addRow(index: number){
  if (this.products.length < 8 && ( this.products[index].name && this.products[index].quantity) !== null) {
        this.products.push({ name: '', quantity: null });
      }
  console.log("index",index, this.products[index]);
  console.log(this.products)
}



  isValidOrder(): boolean {
    return this.products.some(product => product.name && product.quantity !== null);
  }

  showOrder() {
    this.selectedProducts = this.products.filter(p => p.name && p.quantity !== null);
    this.orderVisible = true;
    this.products = this.selectedProducts.concat({ name: '', quantity: null });
  }






  whatIsMyOrder() {
    const orderDescription = this.selectedProducts.map(p => `${p.quantity} of ${p.name}`).join(', ');
    const textToRead = `Your order consists of ${orderDescription}`;
    

    this.isLoading = true;
    this.errorMessage = '';


    this.ttsService.speak(textToRead).subscribe((blob: Blob) => {
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        this.errorMessage = 'Could not play the audio. Please check your device settings.';
      });
    }, error => {
      console.error('Error fetching speech', error);
      this.isLoading = false;
        this.errorMessage = error;
      
    });
  }

}
