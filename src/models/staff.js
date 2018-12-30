import Model from './config';

class Staff extends Model {
  static get tableName() {
    return 'staff';
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

}


export default Staff;
