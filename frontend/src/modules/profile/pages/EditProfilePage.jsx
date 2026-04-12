import { Link } from "react-router-dom";

export default function EditProfilePage() {
  return (
    <div>
      <Link to="/profile" className="btn btn-outline-secondary btn-sm mb-3">
        Back to profile
      </Link>
      <p className="text-secondary mb-0">Edit profile — coming soon.</p>
    </div>
  );
}
