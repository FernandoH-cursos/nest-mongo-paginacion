//* Este archivo se encarga de obtener las variables de entorno que se encuentran en el archivo .env
//* y las exporta para que puedan ser utilizadas en toda la aplicación
export const EnvConfiguration = () => ({
  ENVIROMENT: process.env.NODE_ENV || 'dev',
  MONGO_URL: process.env.MONGO_URL,
  PORT: process.env.PORT || 3001,
  DEFAULT_LIMIT: process.env.DEFAULT_LIMIT || 7,
});
