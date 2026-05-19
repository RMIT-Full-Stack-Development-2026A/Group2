import { useParams } from "react-router-dom";
import SpectatorMatchView from "../components/SpectatorMatchView/SpectatorMatchView";

export default function SpectatorMatchPage() {
  const { token } = useParams();

  return <SpectatorMatchView token={token} />;
}
