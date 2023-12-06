export interface IUsuario {
  usuario: string;
  password: string;
  sucursal?: 'AV' | 'R20' | 'SV' | 'CVL' | 'SAL' | '60C' | 'AG' | 'TLH' | 'TSM' | 'COC' | string
}

export interface IUsuarioResponse {
  status: number;
  data: IUsuario | null;
}