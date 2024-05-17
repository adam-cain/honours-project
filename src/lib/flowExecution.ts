export type Graph = {
    nodes: string[];
    edges: { source: string, target: string }[];
};

export type LevelGroups = { [level: number]: string[] };

export const parallelTopologicalSort = (graph: Graph): LevelGroups => {
    const inDegree: { [key: string]: number } = {};
    const level: { [key: string]: number } = {};
    const levelGroups: LevelGroups = {};

    // Initialize in_degree and level for each node
    graph.nodes.forEach(node => {
        inDegree[node] = 0;
        level[node] = 0;
    });

    // Calculate in_degree for each node
    graph.edges.forEach(({ source, target }) => {
        inDegree[target] += 1;
    });

    // Initialize queue with nodes having in_degree of 0
    const queue: string[] = graph.nodes.filter(node => inDegree[node] === 0);

    while (queue.length > 0) {
        const u = queue.shift() as string;

        // Add node u to the level_groups under its corresponding level
        if (!levelGroups[level[u]]) {
            levelGroups[level[u]] = [];
        }
        levelGroups[level[u]].push(u);

        // Process all nodes that u points to
        graph.edges.forEach(({ source, target }) => {
            if (source === u) {
                inDegree[target] -= 1;
                level[target] = Math.max(level[target], level[u] + 1);

                if (inDegree[target] === 0) {
                    queue.push(target);
                }
            }
        });
    }

    return levelGroups;
};