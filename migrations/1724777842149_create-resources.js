exports.up = (pgm) => {
  pgm.createTable('resources', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()')
    },
    name: {
      type: 'varchar(255)',
      notNull: true
    },
    description: {
      type: 'text'
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
  pgm.dropTable('resources');
};
