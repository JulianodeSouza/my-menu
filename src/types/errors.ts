export default class AppError extends Error {
  constructor(message: string, error?: Error[]) {
    super(message);
    console.error(error);
  }
}
