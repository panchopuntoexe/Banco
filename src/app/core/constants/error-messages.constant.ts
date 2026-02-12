export const ERROR_MESSAGES = {
  PRODUCT: {
    LOAD_FAILED: 'No se pudieron cargar los productos',
    CREATE_FAILED: 'Error al crear el producto',
    UPDATE_FAILED: 'Error al actualizar el producto',
    DELETE_FAILED: 'No se pudo eliminar el producto',
    NOT_FOUND: 'Producto no encontrado',
    ID_EXISTS: 'El ID ya existe en el sistema',
    INVALID_ID: 'ID de producto inválido',
    INVALID_DATA: 'Los datos del producto son inválidos'
  },
  VALIDATION: {
    REQUIRED_FIELD: 'Este campo es obligatorio',
    MIN_LENGTH: (min: number) => `Debe tener al menos ${min} caracteres`,
    MAX_LENGTH: (max: number) => `No debe exceder ${max} caracteres`,
    INVALID_DATE: 'Fecha inválida',
    INVALID_URL: 'URL inválida',
    DATE_MUST_BE_FUTURE: 'La fecha debe ser mayor a la fecha actual',
    DATE_REVISION_INVALID: 'La fecha de revisión debe ser exactamente un año después de la fecha de liberación'
  },
  HTTP: {
    BAD_REQUEST: 'Solicitud incorrecta. Verifica los datos enviados',
    UNAUTHORIZED: 'No autorizado. Debes iniciar sesión',
    FORBIDDEN: 'Acceso denegado. No tienes permisos para esta acción',
    NOT_FOUND: 'Recurso no encontrado',
    CONFLICT: 'Conflicto. El recurso ya existe o hay un conflicto de datos',
    UNPROCESSABLE_ENTITY: 'Datos de entrada inválidos',
    INTERNAL_SERVER_ERROR: 'Error interno del servidor. Inténtalo más tarde',
    BAD_GATEWAY: 'Error de puerta de enlace. El servidor no está disponible',
    SERVICE_UNAVAILABLE: 'Servicio no disponible temporalmente',
    GATEWAY_TIMEOUT: 'Tiempo de espera agotado',
    UNKNOWN_ERROR: 'Ha ocurrido un error inesperado'
  },
  NETWORK: {
    CONNECTION_ERROR: 'Error de conexión. Verifica tu conexión a internet',
    TIMEOUT: 'La solicitud ha excedido el tiempo de espera'
  }
} as const;

export const SUCCESS_MESSAGES = {
  PRODUCT: {
    CREATED: 'Producto creado correctamente',
    UPDATED: 'Producto actualizado correctamente',
    DELETED: 'Producto eliminado correctamente'
  }
} as const;
