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
       console.log(this.masStatus)
     }
     const x = new XMLHttpRequest();
     x.open("GET", "http://192.168.1.87:9999/api/get?objE=evgen.sqilsoft.by.domain.Courses", false);
     x.setRequestHeader('Authorization', 'Bearer '+"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyIiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTYyOTE4NzcxMX0.T3z9UWPP-TbENYOrze96AhZL9q0zWE0GWysjZG4KQWyiq2lMI6dIJX--FdLk7nivmT5bbPUM196iWf8n_8rbOw");
     console.log(sessionStorage.getItem("jhi-authenticationToken"))
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

   getStatusRecord  (idRecord:any):any {
     const newElemet :any = this.masStatus.filter((masStat) => masStat.objId === idRecord.toString() );
     if (newElemet.length===0){return 0;}
     console.log(newElemet[0].mask)

     return newElemet[0].mask;
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
