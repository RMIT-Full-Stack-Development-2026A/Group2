export default function PlayerCard({ name, marker }) {
  return (
    <div className="card border-secondary-subtle bg-light bg-opacity-50">
      <div className="card-body py-3 text-start">
        <div className="fw-semibold text-truncate">{name}</div>
        <div className="small text-secondary">Marker: {marker}</div>
      </div>
    </div>
  );
}
