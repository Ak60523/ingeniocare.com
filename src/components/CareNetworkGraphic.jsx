import HomeMark from "./HomeMark.jsx";

const NODES = [
  { label: "Providers", icon: "providers", angle: -90 },
  { label: "Health Systems", icon: "systems", angle: -30 },
  { label: "Health Plans", icon: "plans", angle: 30 },
  { label: "Employers", icon: "employers", angle: 90 },
  { label: "Post-Acute Care", icon: "postacute", angle: 150 },
  { label: "Community Care", icon: "community", angle: 210 },
];

function point(radius, angle) {
  const rad = (angle * Math.PI) / 180;
  return [320 + radius * Math.cos(rad), 320 + radius * Math.sin(rad)];
}

export default function CareNetworkGraphic() {
  const hub = point(0, 0);
  const orbit = 214;

  return (
    <div className="care-network-graphic" role="img" aria-label="Patient at the center of providers, health systems, health plans, employers, post-acute care, and community care">
      <svg viewBox="0 0 640 640">
        <circle className="care-network-orbit" cx="320" cy="320" r={orbit} />
        <circle className="care-network-orbit is-inner" cx="320" cy="320" r="118" />
        {NODES.map((node) => {
          const [x, y] = point(orbit, node.angle);
          return (
            <line
              key={node.label}
              className="care-network-link"
              x1={hub[0]}
              y1={hub[1]}
              x2={x}
              y2={y}
            />
          );
        })}
      </svg>
      <div className="care-network-hub">
        <HomeMark name="patient" />
        <span>Patient</span>
      </div>
      {NODES.map((node) => {
        const [x, y] = point(orbit, node.angle);
        return (
          <div
            key={node.label}
            className="care-network-node"
            style={{ left: `${(x / 640) * 100}%`, top: `${(y / 640) * 100}%` }}
          >
            <span className="care-network-node-icon">
              <HomeMark name={node.icon} />
            </span>
            <span>{node.label}</span>
          </div>
        );
      })}
    </div>
  );
}
