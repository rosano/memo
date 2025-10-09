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

    const dehydrate = function (object) {
      delete object.$id;

      return Object.assign(object, {
        description: object.description.trim(),
        dateCreated: object.dateCreated.toJSON(),
      });
    };

    const hydrate = function (path, object) {
      object.completed = !!object.completed;

      return Object.assign(object, {
        $id: path,
        dateCreated: object.dateCreated ? new Date(object.dateCreated) : object.dateCreated,
      });
    };

    return {
      exports: {
        hydrate,

        cacheTodos: () => privateClient.cache(''),

        handle: privateClient.on,

        addTodo: (object) => {
          dehydrate(Object.assign(object, {
            dateCreated: new Date(),
          }));

          const $id = object.dateCreated.replace(/\D/g, '');
          return privateClient.storeObject('todo', $id, object).then(e => hydrate($id, object));
        },

        updateTodo: ($id, object) => privateClient.storeObject('todo', $id, dehydrate(object)).then(e => hydrate($id, object)),

        removeTodo: privateClient.remove.bind(privateClient),

        getAllTodos: () => privateClient.getAll('', false).then(map => 
          Object.entries(map).reduce((coll, item) => 
            coll.concat(hydrate(item[0], item[1])),
            [])),
      }
    }
  }
};
