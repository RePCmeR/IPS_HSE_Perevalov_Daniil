export class Strategy {
  constructor(name, nodes = [], edges = [], startNodeId = null) {
    this.name = name;
    this.nodes = nodes;
    this.edges = edges;
    this.startNodeId = startNodeId;
  }

  getAction(nodeId) {
    const node = this.nodes.find(vertex => vertex.id === nodeId);
    return node ? node.action : 'C';
  }

  getNextState(currentNodeId, playerAction, useRandom = false) {
    const candidates = this.edges.filter(
      e => e.source === currentNodeId && e.playerAction === playerAction
    );
    if (candidates.length === 0) {
      return currentNodeId;
    }
    if (!useRandom || candidates.length === 1 || candidates.every(e => e.probability === undefined)) {
      return candidates[0].target;
    }
    const totalProb = candidates.reduce((sum, e) => sum + (e.probability || 0), 0);
    let r = Math.random() * totalProb;
    for (const e of candidates) {
      r -= e.probability;
      if (r <= 0) {
        return e.target;
      }
    }
    return candidates[candidates.length - 1].target;
  }

  toJSON() {
    return {
      name: this.name,
      nodes: this.nodes,
      edges: this.edges,
      startNodeId: this.startNodeId
    };
  }

  static fromJSON(json) {
    return new Strategy(json.name, json.nodes, json.edges, json.startNodeId);
  }

  clone(newName) {
    return new Strategy(
      newName || this.name + ' (копия)',
      JSON.parse(JSON.stringify(this.nodes)),
      JSON.parse(JSON.stringify(this.edges)),
      this.startNodeId
    );
  }
}