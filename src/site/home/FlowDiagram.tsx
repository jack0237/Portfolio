// Schéma de flux redessiné (DESIGN 7.4 et 11 n° 5) : nœuds génériques, aucun identifiant,
// URL interne ni nom de client. Le fil cyan entre par le déclencheur, puis relie les étapes.
const W = 480;
const H = 320;

export function FlowDiagram({ steps, label }: { steps: string[]; label: string }) {
  const n = steps.length;
  const perRow = Math.ceil(n / 2);
  const gap = 28;
  const padX = 24;
  const nodeW = Math.min(150, (W - padX * 2 - gap * (perRow - 1)) / perRow);
  const nodeH = 40;
  const rowY = [92, 212];
  const rowWidth = perRow * nodeW + (perRow - 1) * gap;
  const startX = (W - rowWidth) / 2;

  // Rangée 1 de gauche à droite, rangée 2 de droite à gauche (lecture en S).
  const nodes = steps.map((text, i) => {
    const row = i < perRow ? 0 : 1;
    const col = row === 0 ? i : perRow - 1 - (i - perRow);
    return { text, x: startX + col * (nodeW + gap), y: rowY[row], row };
  });

  const cx = (i: number) => nodes[i].x + nodeW / 2;
  const cy = (i: number) => nodes[i].y + nodeH / 2;

  // Chemin continu : entrée depuis le bord gauche, puis d'un nœud à l'autre.
  let d = `M0 ${cy(0)} H${nodes[0].x}`;
  for (let i = 1; i < n; i++) {
    const a = nodes[i - 1];
    const b = nodes[i];
    if (a.row === b.row) {
      d += a.row === 0 ? ` M${a.x + nodeW} ${cy(i)} H${b.x}` : ` M${a.x} ${cy(i)} H${b.x + nodeW}`;
    } else {
      const x = a.x + nodeW;
      d += ` M${x} ${cy(i - 1)} H${x + 12} Q${x + 20} ${cy(i - 1)} ${x + 20} ${cy(i - 1) + 8} V${cy(i) - 8} Q${x + 20} ${cy(i)} ${x + 12} ${cy(i)} H${x}`;
    }
  }

  return (
    <svg className="flow" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      <path className="flow__path" d={d} fill="none" />
      {nodes.map((node, i) => (
        <g key={node.text + i} className={i === 0 ? "flow__node flow__node--trigger" : "flow__node"}>
          <rect x={node.x} y={node.y} width={nodeW} height={nodeH} rx={2} />
          <text x={cx(i)} y={cy(i) + 4} textAnchor="middle">
            {node.text}
          </text>
        </g>
      ))}
    </svg>
  );
}
