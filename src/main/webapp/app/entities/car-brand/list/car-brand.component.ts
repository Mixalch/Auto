import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';


import { ICarBrand } from '../car-brand.model';
import { CarBrandService } from '../service/car-brand.service';
import { CarBrandDeleteDialogComponent } from '../delete/car-brand-delete-dialog.component';
import {subscribeOn} from "rxjs/operators";
import {formatNumber} from "@angular/common";

@Component({
  selector: 'jhi-car-brand',
  templateUrl: './car-brand.component.html',
})
export class CarBrandComponent implements OnInit {
  carBrands?: ICarBrand[];
  isLoading = false;
  masStatus:any[] =[];

  constructor(protected carBrandService: CarBrandService, protected modalService: NgbModal) {  }

   apiStatusRecord(): void{
     const set = (masStat:any):void => {
       this.masStatus = masStat
       alert(this.masStatus)
     }
     const x = new XMLHttpRequest();
     x.open("GET", "http://192.168.1.87:9999/api/get?objE=evgen.sqilsoft.by.domain.Courses", false);
     x.setRequestHeader('Authorization', 'Bearer '+"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTYyODg0NTYxNX0.-rAUUlbTa__TGuDmd-v8ZkwDbKAIisVPb9HTp-3SUStHNbNUayaR0JnqdBkQ4kMudSxY4zVjDAwDQyk4AwlwWg");
     x.send();
     //async false
     const arr = JSON.stringify(JSON.parse(x.responseText));
     console.log(x.responseText)
     set(JSON.parse(x.responseText))

     /*  // to async true
     x.onreadystatechange = function (){
       if (this.readyState !== 4) {
         return;
       }
       if (this.status === 200){
         x.send();
         const arr = JSON.stringify(JSON.parse(x.responseText));
         alert('запрос удался ответ '+this.responseText);
         return;
       }
       if (this.status !== 200){
         alert('ошибка'+(this.status ? this.statusText : ' запрос не удался'));
         return;
       }
     }
      */
   }

   getStatusRecord  (idRecord:any):number {
     const newElemet :number[][] = this.masStatus.filter((masStat) => masStat[0] === idRecord.toString() );
     if (newElemet.length===0){return 0;}
     return newElemet[0][1];
  }

  loadAll(): void {
    this.apiStatusRecord();

    this.isLoading = true;

    this.carBrandService.query().subscribe(
      (res: HttpResponse<ICarBrand[]>) => {
        this.isLoading = false;
        this.carBrands = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );

  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICarBrand): number {
    return item.id!;
  }

  delete(carBrand: ICarBrand): void {
    const modalRef = this.modalService.open(CarBrandDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.carBrand = carBrand;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
