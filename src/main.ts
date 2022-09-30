import "./style.css";
import ecs from "ecs";
import type {
  Entity,
  Component,
  ComponentName,
  System,
  SystemHandler,
  World,
} from "ecs";

type Ctx = CanvasRenderingContext2D;

const w = ecs.createWorld();
const addComp = (e: Entity, name: string, comp?: Component) => {
  // TODO: add comp to types
  ecs.addComponentToEntity(w, e, name, comp);
};

const materials: Record<string, Record<"color", string>> = {
  water: { color: "#7ae" },
  "fish-scales": { color: "#830" },
};
const renderers: Record<string, (ctx: Ctx, e: Entity) => void> = {
  item: (ctx, e) => {
    const { x, y, w, h } = e.pos;
    if (e.vessel) {
      ctx.fillStyle = materials[e.vessel.liquid].color;
      ctx.fillRect(x, y + h / 2, w, h / 2);
    }
  },
};

const e = ecs.createEntity(w);
addComp(e, "pos", { x: 0, y: 0, w: 10, h: 10 });
addComp(e, "render", { col: "#ff0", renderer: "item" });
addComp(e, "desc", { text: "a wild entity in the wild" });
addComp(e, "vessel", {
  maxVolume: 50,
  volume: 0,
  liquid: "water",
  leakRate: 0.1,
});
addComp(e, "item");
addComp(e, "material", { name: "fish-scales" });

const renderSystem =
  (ctx: Ctx) =>
  (world: World): SystemHandler => {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    return {
      onUpdate: () => {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);
        for (const e of ecs.getEntities(world, ["pos", "render"])) {
          ctx.fillStyle = e.render.col;
          ctx.fillRect(e.pos.x, e.pos.y, e.pos.w, e.pos.h);
          e.render.renderer && renderers[e.render.renderer](ctx, e);
        }
      },
    };
  };

const moveSystem: System = (world): SystemHandler => ({
  onUpdate: (dt) => {
    for (const e of ecs.getEntities(world, ["pos"])) {
      e.pos.x += 10 * dt;
      e.pos.y += 10 * dt;
    }
  },
});

const ctx: Ctx = document.getElementById("board").getContext("2d");
ecs.addSystem(w, moveSystem);
ecs.addSystem(w, renderSystem(ctx));

ecs.update(w, 1);
ecs.cleanup(w);

console.log("done", w);
