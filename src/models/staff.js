import Model from './config';

class Staff extends Model {
  static get tableName() {
    return 'staff';
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

}


export default Staff;
