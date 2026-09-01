import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  PurchaseService
} from '../../../../core/services/purchase.service';

import {
  Purchase
} from '../../../../core/models/purchase.model';


@Component({
  selector: 'app-purchase-detail',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './purchase-detail.component.html',

  styleUrl: './purchase-detail.component.scss'
})
export class PurchaseDetailComponent
  implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly purchaseService =
    inject(PurchaseService);


  compra: Purchase | null = null;

  loading = false;

  errorMessage = '';


  ngOnInit(): void {

    const id =
      Number(
        this.route.snapshot.paramMap.get('id')
      );


    if (!id) {

      this.errorMessage =
        'Identificador de compra inválido.';

      return;

    }


    this.cargarCompra(id);

  }


  cargarCompra(id: number): void {

    this.loading = true;

    this.errorMessage = '';


    this.purchaseService
      .getById(id)
      .subscribe({

        next: (compra) => {

          this.compra = compra;

          this.loading = false;

        },

        error: (error: unknown) => {

          console.error(
            'Error al cargar compra:',
            error
          );

          this.errorMessage =
            'No fue posible cargar la compra.';

          this.loading = false;

        }

      });

  }


  obtenerTextoEstado(
    estado: Purchase['estado']
  ): string {

    switch (estado) {

      case 'REGISTRADA':
        return 'Registrada';

      case 'ANULADA':
        return 'Anulada';

      default:
        return estado;

    }

  }


  volver(): void {

    this.router.navigate([
      '/purchases'
    ]);

  }

}