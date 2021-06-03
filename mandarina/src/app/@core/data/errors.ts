export const SERVER_ERRORS: Map<
  string,
  { title?: string; message?: string }
> = new Map<string, { title?: string; message?: string }>([
  [
    'INSUFFICIENT_ROLES',
    {
      title: 'No permitido',
      message: 'No cuenta con los permisos necesarios para realizar esta acción'
    }
  ]
]);
