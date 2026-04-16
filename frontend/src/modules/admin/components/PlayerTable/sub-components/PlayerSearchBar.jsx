import React from "react";
import { Search } from "lucide-react";

const PlayerSearchBar = ({search, setSearch}) => {
    return (
        <div className="position-relative">
            <Search
                style={{
                    width: "16px",
                    height: "16px",
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6c757d",
                }}
            />
            <input
                type="text"
                placeholder="Search by username or email..."
                className="form-control" style={{ paddingLeft: "32px" }}
                value = {search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    );
};

export default PlayerSearchBar;
