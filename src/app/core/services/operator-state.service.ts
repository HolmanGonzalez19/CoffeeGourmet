import {
  Injectable,
  signal
} from '@angular/core';


export interface OperatorSession {

  usuarioId: number;

  nombre: string;

  usuario: string;

  rolId: number;

  rolNombre: string;

  token: string;

  permisos: string[];

}


@Injectable({
  providedIn: 'root'
})
export class OperatorStateService {

  private readonly operatorStorageKey =
    'coffeeGourmetOperator';


  private readonly operator =
    signal<OperatorSession | null>(
      this.loadOperator()
    );


  // ============================================================
  // OPERADOR ACTUAL
  // ============================================================

  currentOperator():
    OperatorSession | null {

    return this.operator();

  }


  // ============================================================
  // VALIDAR OPERADOR ACTIVO
  // ============================================================

  isOperatorActive(): boolean {

    return this.operator() !== null;

  }


  // ============================================================
  // ESTABLECER OPERADOR
  // ============================================================

  setOperator(
    session: OperatorSession
  ): void {

    this.operator.set(
      session
    );


    sessionStorage.setItem(
      this.operatorStorageKey,
      JSON.stringify(session)
    );

  }


  // ============================================================
  // FINALIZAR OPERADOR
  // ============================================================

  clearOperator(): void {

    this.operator.set(
      null
    );


    sessionStorage.removeItem(
      this.operatorStorageKey
    );

  }


  // ============================================================
  // CARGAR OPERADOR DESDE sessionStorage
  // ============================================================

  private loadOperator():
    OperatorSession | null {

    const storedOperator =
      sessionStorage.getItem(
        this.operatorStorageKey
      );


    if (!storedOperator) {

      return null;

    }


    try {

      return JSON.parse(
        storedOperator
      ) as OperatorSession;

    } catch {

      sessionStorage.removeItem(
        this.operatorStorageKey
      );

      return null;

    }

  }

}