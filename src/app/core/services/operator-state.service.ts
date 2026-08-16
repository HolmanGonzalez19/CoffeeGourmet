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


    localStorage.setItem(
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


    localStorage.removeItem(
      this.operatorStorageKey
    );

  }


  // ============================================================
  // CARGAR OPERADOR DESDE LOCALSTORAGE
  // ============================================================

  private loadOperator():
    OperatorSession | null {

    const storedOperator =
      localStorage.getItem(
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

      localStorage.removeItem(
        this.operatorStorageKey
      );

      return null;

    }

  }

}