export function isBorder(c, r, cols, rows) {
  return c === 0 || r === 0 || r === rows - 1 || c === cols - 1;
}
export function getTilesInView(map) {
  if (!map.centerTile) return {};
  return {
    startCol: Math.max(0, Math.round(map.centerTile.c - map.viewCols / 2)),
    endCol: Math.min(map.cols, Math.round(map.centerTile.c + map.viewCols / 2)),
    startRow: Math.max(0, Math.round(map.centerTile.r - map.viewRows / 2)),
    endRow: Math.min(map.rows, Math.round(map.centerTile.r + map.viewRows / 2)),
  };
}

export function exportMap(map, entities) {
  const tiles = {};
  for (let r = 0; r < map.rows; r++) {
    for (let c = 0; c < map.cols; c++) {
      if (!isBorder(c, r, map.cols, map.rows)) {
        const tile = map.getTile(c, r);
        if (tile) {
          tiles["" + c + "-" + r] = tile;
        }
      }
    }
  }
  const exptEntities = entities.map((e) => {
    const ret = {
      position: e.start || e.position,
      type: e.type,
    };

    if (e.speed) ret.speed = e.speed;
    if (e.steps) ret.steps = e.steps.slice(1);

    return ret;
  });

  return JSON.stringify({
    tiles,
    entities: exptEntities,
    cols: map.cols,
    rows: map.rows,
  });
}
export function canvasPosToTile(x, y, canvas, map) {
  const rel = { x: x / canvas.width, y: y / canvas.height };

  const { startCol, endCol, startRow, endRow } = getTilesInView(map);

  return {
    c: Math.round((endCol - startCol) * rel.x + startCol),
    r: Math.round((endRow - startRow) * rel.y + startRow),
  };
}

export function tileToCanvasPos(c, r, canvas, map) {
  return {
    x: Math.round(c * map.tsize + map.pov.x),
    y: Math.round(r * map.tsize + map.pov.y),
  };
}

export function pxXSecond(map, tXs) {
  return tXs * map.tsize;
}
export function generateMap(width, height, tsize = 4, loadMap = null) {
  let tiles = [];

  const cols = width;
  const rows = height;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (isBorder(c, r, cols, rows)) {
        tiles.push(1);
      } else if (loadMap && loadMap["" + c + "-" + r]) {
        tiles.push(loadMap["" + c + "-" + r]);
      } else {
        tiles.push(0);
      }
    }
  }

  const map = {
    cols,
    rows,
    tsize,
    tiles,
    centerTile: { c: Math.round(cols / 2), r: Math.round(rows / 2) },
    getTile: (col, row) => map.tiles[row * map.cols + col],
    setTile: (col, row, val) => (map.tiles[row * map.cols + col] = val),
    renderTile: () => null,
    tCoords: () => tiles.map((_, i) => [Math.floor(i / cols), i % rows]),
  };

  return map;
}

export function setVOF(map, width, height) {
  if (!map) {
    console.error("Map is null");
    return;
  }
  const visibleWidth = Math.ceil(width / map.tsize);
  const visibleHeight = Math.ceil(height / map.tsize);
  const viewCols = visibleWidth;
  const viewRows = visibleHeight;

  const camera = {
    viewCols: viewCols,
    viewRows: viewRows,
  };

  return { ...map, ...camera };
}
/**
 * Return the distance between two points
 *
 * @param {x,y} p1 Point 1
 * @param {x,y} p2 Point 2
 */
export function dstBtw2Pnts(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}
/**
 * Returns the point between 2 other points at a given distance
 *
 * @param {x,y} p1 Point 1
 * @param {x,y} p2 Point 2
 */
export function pntBtw2Pnts(p1, p2, dist) {
  const ptsDist = dstBtw2Pnts(p1, p2);
  if (ptsDist < dist) {
    return { ...p2 };
  }
  const distRatio = ptsDist ? dist / ptsDist : 0;
  return {
    x: p1.x + distRatio * (p2.x - p1.x),
    y: p1.y + distRatio * (p2.y - p1.y),
  };
}
export function isCenterBlock(c, r, map) {
  return c % (map.scaleFactor / 2) === 0 && r % (map.scaleFactor / 2) === 0;
}
export function getBlockCenters(map) {
  return [...map.tiles.filter(([c, r]) => isCenterBlock())];
}

export function surrounding(map, center, range) {
  const pos = [];
  for (let c = -range; c < range; c++) {
    for (let r = -range; r < range; r++) {
      const [cc, cr] = center;
      if (cc >= 0 && cc < map.cols && cr >= 0 && cr < map.rows)
        pos.push([cc + c, cr + r]);
    }
  }
  return pos;
}
