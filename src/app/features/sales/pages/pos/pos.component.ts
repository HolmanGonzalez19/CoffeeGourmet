import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  HostListener,
  ViewChild
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { ProductCatalogComponent } from '../../components/product-catalog/product-catalog.component';
import { LoginComponent } from '../../../auth/pages/login/login.component';
import { OperatorSelectionComponent } from '../../../operator/pages/operator-selection/operator-selection.component';

import { Product } from '../../../../core/models/product.model';
import { PaymentMethod } from '../../../../core/models/payment-method.model';
import { CreateSaleRequest, SaleResponse } from '../../../../core/models/sale.model';

import { CashRegisterService } from '../../../../core/services/cash-register.service';
import { OperatorStateService, OperatorSession } from '../../../../core/services/operator-state.service';
import { PaymentMethodService } from '../../../../core/services/payment-method.service';
import { SaleService } from '../../../../core/services/sale.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SaleItemPos, VentaPos } from '../../../../core/models/pos.model';
import { ProductService } from '../../../../core/services/product.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    MatButtonModule,
    ProductCatalogComponent,
    MatSlideToggleModule
  ],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PosComponent implements OnDestroy, OnInit {
  private readonly router = inject(Router);
  private readonly operatorStateService = inject(OperatorStateService);
  private readonly cashRegisterService = inject(CashRegisterService);
  private readonly paymentMethodService = inject(PaymentMethodService);
  private readonly saleService = inject(SaleService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);
  private readonly productService = inject(ProductService);
  private readonly timeInterval = setInterval(() => {
    this.updateCurrentTime();
  }, 1000);
  private scannerBuffer = '';
  private scannerLastKeyTime = 0;

  readonly currencyCode = 'COP';

  get currentOperator(): OperatorSession | null {
    return this.operatorStateService.currentOperator();
  }

  get operadorActivo(): boolean {
    return this.operatorStateService.isOperatorActive();
  }

  currentTime = '';
  cashRegisterStatus: 'ABIERTA' | 'CERRADA' = 'CERRADA';
  cashRegisterLoading = false;
  mostrarBotonAdministrador: boolean = true;
  selectedProduct: Product | null = null;
  priceLoading = false;
  priceError = '';
  escaneoAgregaVenta = false;
  paymentMethods: PaymentMethod[] = [];
  selectedPaymentMethod: PaymentMethod | null = null;
  venta: VentaPos = {
    items: []
  };

  ngOnInit(): void {
    this.verificarToken();
    this.loadCurrentCashRegister();
    this.updateCurrentTime();

    if (this.operadorActivo) {
      this.loadPaymentMethods();
    }
  }

  constructor() {}

  verificarToken() {
    const token = localStorage.getItem('coffeeGourmetOperator');
    this.mostrarBotonAdministrador = !token;
  }

  get ventaActiva(): boolean {
    return this.venta.items.length > 0;
  }

  get totalProductos(): number {
    return this.venta.items.reduce(
      (total, item) => total + item.cantidad,
      0
    );
  }

  get subtotalVenta(): number {
    return this.venta.items.reduce(
      (total, item) => total + item.subtotal,
      0
    );
  }

  get totalVenta(): number {
    return this.subtotalVenta;
  }

  onProductSelected(product: Product): void {
    if (!this.operadorActivo || !this.cajaAbierta) {
      this.selectedProduct = product;
      return;
    }

    if ( product.precioVenta === null || product.precioVenta === undefined ) {
      this.selectedProduct = product;
      this.priceError = 'El producto no tiene un precio de venta vigente.';
      this.changeDetectorRef.markForCheck();
      return;
    }

    const precioVenta = Number(product.precioVenta);

    if (!Number.isFinite(precioVenta) || precioVenta < 0) {
      this.selectedProduct = product;
      this.priceError = 'El producto tiene un precio de venta inválido.';
      this.changeDetectorRef.markForCheck();
      return;
    }

    this.selectedProduct = product;
    this.priceLoading = false;
    this.priceError = '';

    const existingItem = this.venta.items.find(
      item => item.productoId === product.id
    );

    if (existingItem) {
      existingItem.cantidad += 1;
      existingItem.subtotal =
        existingItem.cantidad * existingItem.precioUnitario;
    } else {
      this.venta.items.push({
        productoId: product.id,
        codigo: product.codigo,
        nombre: product.nombre,
        cantidad: 1,
        precioUnitario: precioVenta,
        subtotal: precioVenta
      });
    }

    this.actualizarVenta();
  }

  iniciarOperador(): void {
    const dialogRef = this.dialog.open(
      OperatorSelectionComponent,
      {
        width: '500px',
        maxWidth: 'calc(100vw - 50px)',
        height: '700px',
        disableClose: true,
        autoFocus: false,
        panelClass: 'operator-dialog'
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.mostrarBotonAdministrador = false;
        this.changeDetectorRef.markForCheck();
        this.loadPaymentMethods();
        this.notificationService.success(
          'Sesión iniciada correctamente.'
        );
      }
    });
  }

  finalizarOperador(): void {
    if (!this.operadorActivo) {
      return;
    }

    this.venta = {
      items: []
    };

    this.selectedProduct = null;
    this.selectedPaymentMethod = null;
    this.mostrarBotonAdministrador = true;
    this.paymentMethods = [];
    this.changeDetectorRef.markForCheck();
    this.operatorStateService.clearOperator();
    this.router.navigate(['/']);
  }

  abrirAdministracion(): void {
    if (this.operadorActivo) {
      return;
    }

    const dialogRef = this.dialog.open(
      LoginComponent,
      {
        width: '390px',
        maxWidth: 'calc(100vw - 32px)',
        disableClose: true,
        autoFocus: false,
        panelClass: 'coffee-gourmet-login-dialog'
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        console.log('[POS] Acceso administrativo iniciado.'); // HOLMAN CORREGIR
      }
    });
  }

  // Consultar precio
  consultarPrecio(): void {// HOLMAN CORREGIR
    console.log('[POS] Consultar precio');
  }

  cobrar(): void {
    if (!this.operadorActivo || !this.cajaAbierta || !this.ventaActiva || !this.selectedPaymentMethod) {
      return;
    }

    const operator = this.currentOperator;

    if (!operator) {
      return;
    }

    const request: CreateSaleRequest = {
      usuarioId: operator.usuarioId,
      metodoPagoId: this.selectedPaymentMethod.id,
      observacion: 'Venta POS',
      detalles: this.venta.items.map(item => ({
        productoId: item.productoId,
        cantidad: item.cantidad
      }))
    };

    this.saleService
      .create(request)
      .subscribe({
        next: response => {
          this.onSaleCreated(response);
          this.notificationService.success(
            'Venta registrada correctamente.'
          );
        },
        error: error => {
          const message = error?.error?.message ??
            'No fue posible registrar la venta.';
          this.notificationService.warning(message);
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  private onSaleCreated(response: SaleResponse): void {
    this.venta = {
      items: []
    };

    this.selectedProduct = null;
    this.selectedPaymentMethod = null;
    this.loadCurrentCashRegister();
    this.changeDetectorRef.markForCheck();
  }

  limpiarCarrito(): void {
    if (!this.operadorActivo) {
      return;
    }

    if (!this.ventaActiva) {
      return;
    }

    this.venta = {
      items: []
    };

    this.selectedProduct = null;
    this.selectedPaymentMethod = null;
    this.changeDetectorRef.markForCheck();
  }

  aumentarCantidad(item: SaleItemPos): void {
    if (!this.operadorActivo) {
      return;
    }

    item.cantidad += 1;
    item.subtotal = item.cantidad * item.precioUnitario;
    this.actualizarVenta();
  }

  disminuirCantidad(item: SaleItemPos): void {
    if (!this.operadorActivo) {
      return;
    }

    if (item.cantidad <= 1) {
      this.eliminarItem(item.productoId);
      return;
    }

    item.cantidad -= 1;
    item.subtotal = item.cantidad * item.precioUnitario;
    this.actualizarVenta();
  }

  cambiarCantidad( item: SaleItemPos, cantidad: number ): void {
    if (!this.operadorActivo) {
      return;
    }

    const nuevaCantidad = Math.floor(Number(cantidad));

    if ( !Number.isFinite(nuevaCantidad) || nuevaCantidad <= 0 ) {
      this.eliminarItem(item.productoId);
      return;
    }

    item.cantidad = nuevaCantidad;
    item.subtotal = item.cantidad * item.precioUnitario;
    this.actualizarVenta();
  }

  eliminarItem(productoId: number): void {
    if (!this.operadorActivo) {
      return;
    }

    this.venta = {
      ...this.venta,
      items: this.venta.items.filter(
        item => item.productoId !== productoId
      )
    };

    this.selectedProduct = null;

    if (!this.ventaActiva) {
      this.selectedPaymentMethod = null;
    }

    this.changeDetectorRef.markForCheck();
  }

  private actualizarVenta(): void {
    this.venta = {
      ...this.venta,
      items: [...this.venta.items]
    };

    this.changeDetectorRef.markForCheck();
  }

  private updateCurrentTime(): void {
    this.currentTime = new Date().toLocaleTimeString(
      'es-CO',
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    );
  }

  private loadCurrentCashRegister(): void {
    this.cashRegisterLoading = true;
    this.cashRegisterService
      .getCurrent()
      .subscribe({
        next: response => {
          this.cashRegisterStatus = response.estado;
          this.cashRegisterLoading = false;
          this.changeDetectorRef.markForCheck();
        },
        error: error => {
          console.error(
            '[POS] Error consultando estado de caja:',
            error
          );// HOLMAN CORREGIR
          this.cashRegisterStatus = 'CERRADA';
          this.cashRegisterLoading = false;
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  get cajaAbierta(): boolean {
    return this.cashRegisterStatus === 'ABIERTA';
  }

  // Métodos de pago
  private loadPaymentMethods(): void {
    this.paymentMethodService.getActive().subscribe({
        next: methods => {
          this.paymentMethods = methods;
          this.changeDetectorRef.markForCheck();
        },
        error: error => {
          console.error(
            '[POS] Error consultando métodos de pago:',
            error
          );//HOLMAN CORREGIR
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  selectPaymentMethod(method: PaymentMethod): void {
    if (!this.operadorActivo || !this.cajaAbierta || !this.ventaActiva) {
      return;
    }
    this.selectedPaymentMethod = method;
    this.changeDetectorRef.markForCheck();
  }
  
  @HostListener('document:keydown', ['$event'])
  onGlobalKeyDown(event: KeyboardEvent): void {

    const currentTime = Date.now();

    const timeSinceLastKey =
      currentTime - this.scannerLastKeyTime;

    /*
    * Si pasa demasiado tiempo entre teclas,
    * asumimos que comenzó una nueva entrada.
    */
    if (timeSinceLastKey > 100) {
      this.scannerBuffer = '';
    }

    this.scannerLastKeyTime = currentTime;

    /*
    * ENTER indica que el lector terminó
    * de enviar el código.
    */
    if (event.key === 'Enter') {

      event.preventDefault();
      event.stopPropagation();

      const codigoBarras =
        this.scannerBuffer.trim();

      this.scannerBuffer = '';

      if (!codigoBarras) {
        return;
      }

      this.procesarCodigoBarras(codigoBarras);

      return;
    }

    /*
    * Ignoramos teclas especiales.
    */
    if (
      event.key.length !== 1 ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey
    ) {
      return;
    }

    this.scannerBuffer += event.key;
  }

  private procesarCodigoBarras(
    codigoBarras: string
  ): void {
    this.productService
      .getProductByBarcode(codigoBarras)
      .subscribe({
        next: product => {

          if (!product.activo) {
            this.notificationService.error(
              'El producto asociado al código de barras está inactivo.'
            );

            return;
          }

          if (!this.operadorActivo) {
            this.productCatalog.showScannedProduct(product);
            this.selectedProduct = product;
            this.changeDetectorRef.markForCheck();
            return;
          }

          if (!this.escaneoAgregaVenta) {
            this.productCatalog.showScannedProduct(product);
            this.selectedProduct = product;
            this.changeDetectorRef.markForCheck();
            return;
          }

          this.onProductSelected(product);
        },

        error: error => {

          console.error(
            '[POS] Producto no encontrado por código de barras:',
            error
          );

          this.notificationService.error(
            'No existe un producto asociado a este código de barras.'
          );

          this.changeDetectorRef.markForCheck();
        }
      });
  }

  @ViewChild(ProductCatalogComponent)
  private productCatalog!: ProductCatalogComponent;

  ngOnDestroy(): void {
    clearInterval(this.timeInterval);
  }
}