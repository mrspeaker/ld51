"use strict";
exports.__esModule = true;
require("./style.css");
/// <reference path="../types/ecs/index.d.ts" />
var ecs_1 = require("ecs");
var w = ecs_1["default"].createWorld();
var addComp = function (e, name, comp) { return ecs_1["default"].addComponentToEntity(w, e, name, comp); };
var materials = {
    water: "#7ae",
    "fish-scales": { color: "#830" }
};
var renderers = {
    item: function (ctx, e) {
        var _a = e.pos, x = _a.x, y = _a.y, w = _a.w, h = _a.h;
        if (e.vessel) {
            ctx.fillStyle = materials[e.vessel.liquid];
            ctx.fillRect(x, y + h / 2, w, h / 2);
        }
    }
};
var e = ecs_1["default"].createEntity(w);
addComp(e, "pos", { x: 0, y: 0, w: 10, h: 10 });
addComp(e, "render", { col: "#ff0", renderer: "item" });
addComp(e, "desc", "a wild entity in the wild");
addComp(e, "vessel", {
    maxVolume: 50,
    volume: 0,
    liquid: "water",
    leakRate: 0.1
});
addComp(e, "item");
addComp(e, "material", "fish-scales");
var renderSystem = function (ctx) { return function (world) {
    var w = ctx.canvas.width;
    var h = ctx.canvas.height;
    return {
        onUpdate: function (dt) {
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, w, h);
            for (var _i = 0, _a = ecs_1["default"].getEntities(world, ["pos", "render"]); _i < _a.length; _i++) {
                var e_1 = _a[_i];
                ctx.fillStyle = e_1.render.col;
                ctx.fillRect(e_1.pos.x, e_1.pos.y, e_1.pos.w, e_1.pos.h);
                e_1.render.renderer && renderers[e_1.render.renderer](ctx, e_1);
            }
        }
    };
}; };
var moveSystem = function (world) { return ({
    onUpdate: function (dt) {
        for (var _i = 0, _a = ecs_1["default"].getEntities(world, ["pos"]); _i < _a.length; _i++) {
            var e_2 = _a[_i];
            e_2.pos.x += 10 * dt;
            e_2.pos.y += 10 * dt;
        }
    }
}); };
var ctx = document.getElementById("board").getContext("2d");
ecs_1["default"].addSystem(w, moveSystem);
ecs_1["default"].addSystem(w, renderSystem(ctx));
ecs_1["default"].update(w, 1);
ecs_1["default"].cleanup(w);
console.log("done");
