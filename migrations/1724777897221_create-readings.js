exports.up = (pgm) => {
  pgm.createTable('readings', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()')
    },
    customer_code: {
      type: 'varchar(255)',
      notNull: true
    },
    measure_datetime: {
      type: 'timestamp',
      notNull: true
    },
    measure_type: {
      type: 'varchar(50)',
      notNull: true
    },
    description: {
      type: 'text',  
      notNull: true
    },
    image: {
      type: 'text', 
      notNull: true
    },
    confirmed: {
      type: 'boolean',
      default: false
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp')
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('readings');
};
