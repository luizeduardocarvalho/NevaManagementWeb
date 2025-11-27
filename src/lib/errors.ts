interface ErrorResponsePayload {
  error?: string
  message?: string
}

interface ErrorWithResponse {
  response?: {
    data?: ErrorResponsePayload
  }
}

interface ErrorWithMessage {
  message?: string
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'string' && error.trim().length > 0) {
    return error
  }

  if (typeof error === 'object' && error !== null) {
    const withResponse = error as ErrorWithResponse
    const responseMessage = withResponse.response?.data?.error || withResponse.response?.data?.message
    if (typeof responseMessage === 'string' && responseMessage.trim().length > 0) {
      return responseMessage
    }

    const withMessage = error as ErrorWithMessage
    if (typeof withMessage.message === 'string' && withMessage.message.trim().length > 0) {
      return withMessage.message
    }
  }

  return fallback
}
