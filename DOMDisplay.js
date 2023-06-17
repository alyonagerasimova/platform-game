const scale = 20;
const heartHeight = 20;

class DOMDisplay {
    constructor(parent, level) {
        this.wrap = parent.appendChild(elt("div", "game"));
        this.level = level;

        this.wrap.appendChild(this.drawBackground());
        this.actorLayer = null;
        this.drawFrame();
    }

    drawBackground() {
        const table = elt("table", "background");
        table.style.width = this.level.width * scale + "px";
        this.level.grid.forEach(function (row) {
            const rowElt = table.appendChild(elt("tr"));
            rowElt.style.height = scale + "px";
            row.forEach(function (type) {
                rowElt.appendChild(elt("td", type));
            });
        });
        return table;
    }

    drawActors() {
        const wrap = elt("div");
        this.level.actors.forEach(function (actor) {
            const rect = wrap.appendChild(elt("div",
                "actor " + actor.type));

            rect.style.width = actor.size.x * scale + "px";
            rect.style.height = actor.size.y * scale + "px";
            rect.style.left = actor.pos.x * scale + "px";
            rect.style.top = actor.pos.y * scale + "px";
        });
        return wrap;
    }

    drawFrame() {
        if (this.actorLayer)
            this.wrap.removeChild(this.actorLayer);
        this.actorLayer = this.wrap.appendChild(this.drawActors());

        this.wrap.className = "game " + (this.level.status || "");
        this.scrollPlayerIntoView();
    }

    scrollPlayerIntoView() {
        const width = this.wrap.clientWidth;
        const height = this.wrap.clientHeight;
        const margin = width / 3;

        const left = this.wrap.scrollLeft, right = left + width;
        const top = this.wrap.scrollTop, bottom = top + height;

        const player = this.level.player;
        const center = player.pos.plus(player.size.times(0.5))
            .times(scale);

        if (center.x < left + margin)
            this.wrap.scrollLeft = center.x - margin;
        else if (center.x > right - margin)
            this.wrap.scrollLeft = center.x + margin - width;
        if (center.y < top + margin)
            this.wrap.scrollTop = center.y - margin;
        else if (center.y > bottom - margin)
            this.wrap.scrollTop = center.y + margin - height;
    }

    clear() {
        this.wrap.parentNode.removeChild(this.wrap);
    }
}

function elt(name, className) {
    const elt = document.createElement(name);
    if (className) elt.className = className;
    return elt;
}

