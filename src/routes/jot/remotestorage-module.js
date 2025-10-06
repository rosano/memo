export default {
  name: 'todos',
  builder: function (privateClient) {
    privateClient.declareType('todo', {
      type: 'object',
      properties: {
        description: { type: 'string' },
        completed: { type: 'boolean' },
        dateCreated: { type: 'string' },
      },
      required: ['description'],
    });

    const inject = function (object, properties) {
      return Object.assign(Object.assign({}, object), properties);
    };

    const formatOut = function (object, properties) {
      delete object.$id;

      return inject(object, properties);
    };

    const formatIn = function (object, properties) {
      object.completed = !!object.completed;
      
      return inject(object, properties);
    };

    const hydrate = function (path, object) {
      return formatIn(object, {
        $id: path,
        dateCreated: object.dateCreated ? new Date(object.dateCreated) : object.dateCreated,
      });
    };

    return {
      exports: {
        cacheTodos: () => privateClient.cache(''),

        handle: privateClient.on,

        addTodo: (object) => {
          const date = new Date();
          const dateCreated = date.toJSON();
          const $id = dateCreated.replace(/\D/g, '');

          return privateClient.storeObject('todo', $id, Object.assign(object, {
            dateCreated,
          })).then(e => hydrate($id, object));
        },

        updateTodo: ($id, object) => privateClient.storeObject('todo', $id, formatOut(object)).then(e => hydrate($id, object)),

        removeTodo: privateClient.remove.bind(privateClient),

        getAllTodos: () => privateClient.getAll('', false).then(map => 
          Object.entries(map).reduce((coll, item) => 
            coll.concat(hydrate(item[0], item[1])),
            [])),

        hydrate,
      }
    }
  }
};
