import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { HttpClientModule } from '@angular/common/http';


interface Product {
  name: string;
  quantity: number | null;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})



export class HomeComponent {
  orderForm: FormGroup;
  
  // products:Product[] = [{ name: '', quantity: null }];
  productOptions = ['Product 1', 'Product 2', 'Product 3'];
  quantities = [0, 1, 2, 3, 4, 5];


  selectedProducts: Product[]=[];
 
  isLoading = false;
  errorMessage = '';



  constructor(private fb: FormBuilder, private ttsService: ApiService){
    this.orderForm = this.fb.group({
      items: this.fb.array([this.createItem()])
    });
  }
  
  createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(0), Validators.max(5)]]
    });
  }


  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }


addRow(): void{
  if (this.items.length < 8) {
    this.items.push(this.createItem());
      }
}



  showOrder(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
      
  }
  this.selectedProducts = this.items.value.filter((item: Product) => item.name && item.quantity !== null);
  
}






  whatIsMyOrder():void {

    if (this.orderForm.invalid) {
      this.errorMessage = 'Please fill out all fields correctly.';
      return;
    }

    const orderDescription = this.selectedProducts.map(p => `${p.quantity} of ${p.name}`).join(', ');
    
    const textToRead = `Your order consists of ${orderDescription}`;
    

    this.isLoading = true;
    this.errorMessage = '';


    this.ttsService.speak(textToRead).subscribe((blob: Blob) => {
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        this.errorMessage = 'Could not play the audio.';
      });
    }, error => {
      console.error('Error fetching speech', error);
      this.isLoading = false;
        this.errorMessage = error;
      
    },
    () => {
      this.isLoading = false;
    }
  );
  }

}
