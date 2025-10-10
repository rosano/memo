export default {
  name: 'todos',
  builder: function (privateClient) {
    privateClient.declareType('todo', {
      type: 'object',
      properties: {
        description: { type: 'string' },
        dateCreated: { type: 'string' },
        completed: { type: 'boolean' },
      },
      required: ['description'],
    });

    const trim = (object) => {
      Object.keys(object).forEach(e => {
        if (!object[e]) {
          delete object[e];
        }
      })
      
      return object;
    };

    const dehydrate = (object) => {
      delete object.$id;

      return trim(Object.assign(object, {
        description: object.description.trim(),
        dateCreated: object.dateCreated ? object.dateCreated.toJSON() : undefined,
      }));
    };

    const hydrate = (path, object) => {
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
