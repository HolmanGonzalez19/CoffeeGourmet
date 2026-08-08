import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ProductCatalogComponent } from '../../components/product-catalog/product-catalog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    MatButtonModule,
    ProductCatalogComponent
  ],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PosComponent {
  readonly currencyCode = 'COP';
  private readonly router = inject(Router);

  cajaAbierta = true;
  cajaId: number | null = null;

  operador: OperadorPos | null = {
    id: 1,
    nombre: 'María López'
  };

  venta: VentaPos = {
    items: []
  };

  get operadorActivo(): boolean {
    return this.operador !== null;
  }

  get ventaActiva(): boolean {
    return this.venta.items.length > 0;
  }

  consultarPrecio(): void {
    console.log('Consultar precio');
  }

  finalizarOperador(): void {
    console.log('Finalizar operador');
  }

  abrirAdministracion(): void {
    this.router.navigate(['/login']);
  }

  cobrar(): void {
    if (!this.ventaActiva) {
      return;
    }

    console.log('Iniciar proceso de cobro');
  }

  limpiarCarrito(): void {
    if (!this.ventaActiva) {
      return;
    }

    this.venta.items = [];
  }
}

interface OperadorPos {
  id: number;
  nombre: string;
}

interface SaleItemPos {
  productoId: number;
  codigo: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface VentaPos {
  items: SaleItemPos[];
}