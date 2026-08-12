import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy
} from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

import { ProductCatalogComponent } from '../../components/product-catalog/product-catalog.component';

import { Product } from '../../../../core/models/product.model';
import { CashRegister } from '../../../../core/models/cash-register.model';

import { CashRegisterService } from '../../../../core/services/cash-register.service';

import {
  OperatorStateService,
  OperatorSession
} from '../../../../core/services/operator-state.service';

import { PaymentMethod } from '../../../../core/models/payment-method.model';

import { PaymentMethodService } from '../../../../core/services/payment-method.service';

import {
  CreateSaleRequest,
  SaleResponse
} from '../../../../core/models/sale.model';

import { SaleService } from '../../../../core/services/sale.service';


@Component({
  selector: 'app-pos',
  standalone: true,

  imports: [
    CurrencyPipe,
    MatButtonModule,
    ProductCatalogComponent
  ],

  templateUrl: './pos.component.html',

  styleUrl: './pos.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PosComponent implements OnDestroy {

  private readonly router =
    inject(Router);

  private readonly operatorStateService =
    inject(OperatorStateService);

  private readonly cashRegisterService =
    inject(CashRegisterService);

  private readonly paymentMethodService =
    inject(PaymentMethodService);

  private readonly saleService =
    inject(SaleService);


  private readonly changeDetectorRef =
    inject(ChangeDetectorRef);


  readonly currencyCode = 'COP';


  // ============================================================
  // ESTADO DE CAJA
  // ============================================================

  cashRegister: CashRegister | null = null;

  cashRegisterLoading = false;

  cashRegisterError = '';


  // ============================================================
  // HORA ACTUAL
  // ============================================================

  currentTime = '';

  private readonly timeInterval = setInterval(() => {

    this.updateCurrentTime();

  }, 1000);


  // ============================================================
  // OPERADOR
  // ============================================================

  get currentOperator(): OperatorSession | null {

    return this.operatorStateService.currentOperator();

  }


  get operadorActivo(): boolean {

    return this.operatorStateService.isOperatorActive();

  }


  // ============================================================
  // PRODUCTO SELECCIONADO
  // ============================================================

  selectedProduct: Product | null = null;


  // ============================================================
  // PRECIO
  // ============================================================

  priceLoading = false;

  priceError = '';


  // ============================================================
  // MÉTODOS DE PAGO
  // ============================================================

  paymentMethods: PaymentMethod[] = [];

  selectedPaymentMethod: PaymentMethod | null = null;


  // ============================================================
  // VENTA
  // ============================================================

  venta: VentaPos = {

    items: []

  };


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor() {

    this.updateCurrentTime();

    this.loadCurrentCashRegister();

    this.loadPaymentMethods();

    console.log(
      '[POS] Operador actual:',
      this.currentOperator
    );

  }


  // ============================================================
  // GETTERS DE LA VENTA
  // ============================================================

  get ventaActiva(): boolean {

    return this.venta.items.length > 0;

  }


  get totalProductos(): number {

    return this.venta.items.reduce(
      (total, item) =>
        total + item.cantidad,
      0
    );

  }


  get subtotalVenta(): number {

    return this.venta.items.reduce(
      (total, item) =>
        total + item.subtotal,
      0
    );

  }


  get totalVenta(): number {

    return this.subtotalVenta;

  }


  // ============================================================
  // PRODUCTOS
  // ============================================================

  onProductSelected(product: Product): void {

    console.log(
      '[POS] Producto seleccionado:',
      product
    );


    // ----------------------------------------------------------
    // VALIDAR OPERADOR
    // ----------------------------------------------------------

    if (!this.operadorActivo) {

      console.log(
        '[POS] Selección bloqueada: no hay operador activo.'
      );

      this.selectedProduct = product;

      return;

    }


    // ----------------------------------------------------------
    // VALIDAR CAJA
    // ----------------------------------------------------------

    if (!this.cajaAbierta) {

      console.log(
        '[POS] Selección bloqueada: la caja está cerrada.'
      );

      this.selectedProduct = product;

      return;

    }


    // ----------------------------------------------------------
    // VALIDAR PRECIO
    // ----------------------------------------------------------

    if (
      product.precioVenta === null ||
      product.precioVenta === undefined
    ) {

      console.warn(
        '[POS] El producto no tiene precio de venta vigente:',
        product.id
      );


      this.selectedProduct =
        product;


      this.priceError =
        'El producto no tiene un precio de venta vigente.';

            this.changeDetectorRef.markForCheck();

            return;

          }


    const precioVenta =
      Number(product.precioVenta);


          if (
            !Number.isFinite(precioVenta) ||
            precioVenta < 0
          ) {

      console.error(
        '[POS] Precio de venta inválido:',
        product
      );


      this.selectedProduct =
        product;


      this.priceError =
        'El producto tiene un precio de venta inválido.';

            this.changeDetectorRef.markForCheck();

            return;

          }


    // ----------------------------------------------------------
    // PRODUCTO SELECCIONADO
    // ----------------------------------------------------------

    this.selectedProduct =
      product;


    this.priceLoading =
      false;

    this.priceError =
      '';


    console.log(
      '[POS] Precio vigente:',
      precioVenta
    );


    // ----------------------------------------------------------
    // BUSCAR PRODUCTO EXISTENTE
    // ----------------------------------------------------------

    const existingItem =
      this.venta.items.find(

        item =>
          item.productoId ===
          product.id

      );


    // ----------------------------------------------------------
    // INCREMENTAR CANTIDAD
    // ----------------------------------------------------------

    if (existingItem) {

            existingItem.cantidad += 1;

            existingItem.subtotal =
              existingItem.cantidad *
              existingItem.precioUnitario;

    }


    // ----------------------------------------------------------
    // AGREGAR PRODUCTO
    // ----------------------------------------------------------

    else {

            this.venta.items.push({

              productoId:
                product.id,

              codigo:
                product.codigo,

              nombre:
                product.nombre,

              cantidad:
                1,

              precioUnitario:
                precioVenta,

              subtotal:
                precioVenta

            });

          }


    // ----------------------------------------------------------
    // NUEVA REFERENCIA PARA ONPUSH
    // ----------------------------------------------------------

    this.actualizarVenta();


    console.log(
      '[POS] Venta actual:',
      this.venta
    );

  }


  // ============================================================
  // OPERADOR
  // ============================================================

  iniciarOperador(): void {

    this.router.navigate([
      '/operator-selection'
    ]);

  }


  finalizarOperador(): void {

    if (!this.operadorActivo) {

      return;

    }


    console.log(
      '[POS] Finalizando operador:',
      this.currentOperator
    );


    this.venta = {

      items: []

    };

    this.selectedProduct = null;

    this.selectedPaymentMethod = null;


    this.operatorStateService.clearOperator();


    this.router.navigate([
      '/'
    ]);

  }


  // ============================================================
  // ADMINISTRACIÓN
  // ============================================================

  abrirAdministracion(): void {

    if (this.operadorActivo) {

      console.warn(
        '[POS] No se puede iniciar sesión administrativa mientras exista un operador activo.'
      );

      return;

    }


    this.router.navigate([
      '/login'
    ]);

  }


  // ============================================================
  // CONSULTAR PRECIO
  // ============================================================

  consultarPrecio(): void {

    console.log(
      '[POS] Consultar precio'
    );

  }


  // ============================================================
  // COBRAR
  // ============================================================

  cobrar(): void {

    if (!this.operadorActivo) {

      console.warn(
        '[POS] No se puede cobrar sin operador activo.'
      );

      return;

    }


    if (!this.cajaAbierta) {

      console.warn(
        '[POS] No se puede cobrar porque la caja está cerrada.'
      );

      return;

    }


    if (!this.ventaActiva) {

      return;

    }


    if (!this.selectedPaymentMethod) {

      console.warn(
        '[POS] Debe seleccionar un método de pago.'
      );

      return;

    }


    const operator =
      this.currentOperator;


    if (!operator) {

      return;

    }


    const request: CreateSaleRequest = {

      usuarioId:
        operator.usuarioId,

      metodoPagoId:
        this.selectedPaymentMethod.id,

      observacion:
        'Venta POS',

      detalles:
        this.venta.items.map(item => ({

          productoId:
            item.productoId,

          cantidad:
            item.cantidad

        }))

    };


    console.log(
      '[POS] Request venta:',
      request
    );


    this.saleService
      .create(request)
      .subscribe({

        next: response => {

          console.log(
            '[POS] Venta registrada:',
            response
          );

          this.onSaleCreated(response);

        },


        error: error => {

          console.error(
            '[POS] Error registrando venta:',
            error
          );

        }

      });

  }


  // ============================================================
  // PROCESAR RESPUESTA DE VENTA
  // ============================================================

  private onSaleCreated(
    response: SaleResponse
  ): void {

    console.log(
      '[POS] Venta confirmada:',
      response
    );


    this.venta = {

      items: []

    };

    this.selectedProduct = null;

    this.selectedPaymentMethod = null;


    this.loadCurrentCashRegister();

    this.changeDetectorRef.markForCheck();

  }


  // ============================================================
  // LIMPIAR CARRITO
  // ============================================================

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


    console.log(
      '[POS] Carrito limpiado'
    );


    this.changeDetectorRef.markForCheck();

  }


  // ============================================================
  // CANTIDADES
  // ============================================================

  aumentarCantidad(
    item: SaleItemPos
  ): void {

    if (!this.operadorActivo) {

      return;

    }


    item.cantidad += 1;

    item.subtotal =
      item.cantidad *
      item.precioUnitario;


    this.actualizarVenta();

  }


  disminuirCantidad(
    item: SaleItemPos
  ): void {

    if (!this.operadorActivo) {

      return;

    }


    if (item.cantidad <= 1) {

      this.eliminarItem(
        item.productoId
      );

      return;

    }


    item.cantidad -= 1;

    item.subtotal =
      item.cantidad *
      item.precioUnitario;


    this.actualizarVenta();

  }


  // ============================================================
  // EDITAR CANTIDAD
  // ============================================================

  cambiarCantidad(
    item: SaleItemPos,
    cantidad: number
  ): void {

    if (!this.operadorActivo) {

      return;

    }


    const nuevaCantidad =
      Math.floor(Number(cantidad));


    if (
      !Number.isFinite(nuevaCantidad) ||
      nuevaCantidad <= 0
    ) {

      this.eliminarItem(
        item.productoId
      );

      return;

    }


    item.cantidad =
      nuevaCantidad;


    item.subtotal =
      item.cantidad *
      item.precioUnitario;


    this.actualizarVenta();

  }


  // ============================================================
  // ELIMINAR PRODUCTO
  // ============================================================

  eliminarItem(
    productoId: number
  ): void {

    if (!this.operadorActivo) {

      return;

    }


    this.venta = {

      ...this.venta,

      items:
        this.venta.items.filter(
          item =>
            item.productoId !== productoId
        )

    };


    this.selectedProduct = null;



    if (!this.ventaActiva) {

      this.selectedPaymentMethod = null;

    }


    console.log(
      '[POS] Producto eliminado:',
      productoId
    );


    this.changeDetectorRef.markForCheck();

  }


  // ============================================================
  // ACTUALIZAR REFERENCIA DE VENTA
  // ============================================================

  private actualizarVenta(): void {

    this.venta = {

      ...this.venta,

      items: [
        ...this.venta.items
      ]

    };


    this.changeDetectorRef.markForCheck();

  }


  // ============================================================
  // HORA
  // ============================================================

  private updateCurrentTime(): void {

    this.currentTime =
      new Date().toLocaleTimeString(
        'es-CO',
        {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }
      );

  }


  // ============================================================
  // CONSULTAR CAJA ACTUAL
  // ============================================================

  private loadCurrentCashRegister(): void {

    this.cashRegisterLoading = true;

    this.cashRegisterError = '';


    this.cashRegisterService
      .getCurrent()
      .subscribe({

        next: cashRegister => {

          this.cashRegister =
            cashRegister;

          this.cashRegisterLoading =
            false;


          console.log(
            '[POS] Caja actual:',
            cashRegister
          );


          this.changeDetectorRef.markForCheck();

        },


        error: error => {

          console.error(
            '[POS] Error consultando caja actual:',
            error
          );

          this.cashRegister = null;

          this.cashRegisterLoading =
            false;

          this.cashRegisterError =
            'No fue posible consultar el estado de la caja.';


          this.changeDetectorRef.markForCheck();

        }

      });

  }


  get cajaAbierta(): boolean {

    return this.cashRegister?.estado === 'ABIERTA';

  }


  get cajaId(): number | null {

    return this.cashRegister?.id ?? null;

  }


  // ============================================================
  // MÉTODOS DE PAGO
  // ============================================================

  private loadPaymentMethods(): void {

    this.paymentMethodService
      .getActive()
      .subscribe({

        next: methods => {

          this.paymentMethods =
            methods;


          console.log(
            '[POS] Métodos de pago:',
            methods
          );


          this.changeDetectorRef.markForCheck();

        },


        error: error => {

          console.error(
            '[POS] Error consultando métodos de pago:',
            error
          );


          this.changeDetectorRef.markForCheck();

        }

      });

  }


  // ============================================================
  // SELECCIONAR MÉTODO DE PAGO
  // ============================================================

  selectPaymentMethod(
    method: PaymentMethod
  ): void {

    if (!this.operadorActivo) {

      return;

    }


    if (!this.cajaAbierta) {

      return;

    }


    if (!this.ventaActiva) {

      return;

    }


    this.selectedPaymentMethod =
      method;


    console.log(
      '[POS] Método de pago seleccionado:',
      method
    );


    this.changeDetectorRef.markForCheck();

  }


  // ============================================================
  // LIMPIEZA
  // ============================================================

  ngOnDestroy(): void {

    clearInterval(
      this.timeInterval
    );

  }

}


// ================================================================
// MODELOS LOCALES DEL POS
// ================================================================

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