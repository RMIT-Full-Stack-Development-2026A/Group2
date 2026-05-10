import React from "react";
import { Search } from "lucide-react";

const RoomSearchBar = ({
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
}) => {
    return (
        <div className="d-flex align-items-center gap-2">
            <div className="position-relative flex-grow-1">
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
                    className="form-control"
                    style={{ paddingLeft: "32px" }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <select
                className="form-select"
                style={{ width: "160px" }}
                aria-label="Filter rooms by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="all">All rooms</option>
                <option value="active">Active rooms</option>
                <option value="closed">Closed rooms</option>
            </select>
        </div>
    );
};

export default RoomSearchBar;
