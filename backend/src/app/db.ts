import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

const configs: { [key: string]: SequelizeOptions } = require('./config/config.js');

let sequelize: Sequelize | null = null;

export function init() {
  const env = process.env.NODE_ENV || 'development' as string;
  var actualConfig = configs[env];
  configs[env].models = [__dirname + "/models"]
  sequelize = new Sequelize(actualConfig);
}

export default () : Sequelize => {
  if(sequelize === null) 
    init();
  return sequelize as Sequelize;
};