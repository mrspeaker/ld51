declare module "ecs" {
  type Entity = Record<ComponentName, Component>;
  type Component = Record<string, number | string | boolean>;
  type System = (world: World) => SystemHandler;
  type SystemHandler = {
    onUpdate: (dt: number) => void;
  };
  type World = {
    entities: Entity[];
    filters: object;
    listeners: {
      added: any;
      removed: any;
    };
    components: Component[];
    removals: {
      entities: Entity[];
      components: Component[];
    };
    stats: {
      componentCount: Record<ComponentName, number>;
      currentSystem: number;
      entityCount: number;
      filterInvocationCount: Record<ComponentName, number>;
      lastSentTime: number;
      systems: any[];
    };
    systems: System[];
  };
  type ComponentName = string;

  function addComponentToEntity(
    world: World,
    entity: Entity,
    componentName: string,
    componentData?: Component
  ): void;
  function addSystem(world: World, system: System);
  function createEntity(w: World): Entity;
  function createWorld(): World;
  function getEntities(world: World, comps: ComponentName[]);

  function update(world: World, dt: number);
  function cleanup(world: World);
}
