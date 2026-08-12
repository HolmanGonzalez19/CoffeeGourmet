export interface PaymentMethod {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}